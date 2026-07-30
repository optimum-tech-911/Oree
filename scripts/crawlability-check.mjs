import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalUrl, crawlerUserAgents, normalizeRoutePath, publicRoutes } from "./crawlability-routes.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const requiredTextLength = 700;
const requiredInternalLinks = 3;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function routeFile(route) {
  const normalized = normalizeRoutePath(route);
  return normalized === "/" ? path.join(distDir, "index.html") : path.join(distDir, normalized.replace(/^\/+|\/+$/g, ""), "index.html");
}

function fail(message) {
  throw new Error(message);
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function textOnly(html) {
  return decodeEntities(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function titleOf(html) {
  return decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "");
}

function attributeOf(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, "i"));
  return decodeEntities(match?.[2]?.trim() ?? "");
}

function metaContent(html, selector) {
  const attribute = selector === "description" || selector === "robots" ? "name" : "property";
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const tag = tags.find((candidate) => attributeOf(candidate, attribute) === selector);
  return tag ? attributeOf(tag, "content") : "";
}

function canonicalOf(html) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  const tag = tags.find((candidate) => attributeOf(candidate, "rel") === "canonical");
  return tag ? attributeOf(tag, "href") : "";
}

function h1Of(html) {
  return textOnly(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
}

function paragraphText(html) {
  return [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => textOnly(match[1] ?? "")).join(" ");
}

function internalLinks(html) {
  const links = [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => match[1])
    .filter((href) => href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/assets/"));
  return new Set(links);
}

function hasStructuredData(html) {
  return /<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[\s\S]*?<\/script>/i.test(html);
}

async function assertStaticFiles() {
  const robotsPath = path.join(distDir, "robots.txt");
  const sitemapPath = path.join(distDir, "sitemap.xml");
  const llmsPath = path.join(distDir, "llms.txt");
  await stat(robotsPath).catch(() => fail("dist/robots.txt is missing."));
  await stat(sitemapPath).catch(() => fail("dist/sitemap.xml is missing."));
  await stat(llmsPath).catch(() => fail("dist/llms.txt is missing."));

  const robots = await readFile(robotsPath, "utf8");
  const sitemap = await readFile(sitemapPath, "utf8");
  const llms = await readFile(llmsPath, "utf8");
  if (!robots.includes("Sitemap: https://oree.optimutech.fr/sitemap.xml")) fail("robots.txt points to the wrong sitemap.");
  if (!robots.includes("https://oree.optimutech.fr/llms.txt")) fail("robots.txt does not disclose the AI-readable overview.");
  if (!llms.startsWith("# Orée Entreprises\n\n> ")) fail("llms.txt does not follow the expected title and summary structure.");
  if (!llms.includes("600 € tout compris") || !llms.includes("100 €")) fail("llms.txt is missing the confirmed offer.");
  if (!llms.includes("ne constitue pas un conseil juridique automatique définitif")) fail("llms.txt is missing the legal-guidance boundary.");

  const sitemapRoutes = new Set(
    [...sitemap.matchAll(/<loc>(https:\/\/oree\.optimutech\.fr\/[^<]*)<\/loc>/g)].map((match) => {
      const url = new URL(match[1]);
      return normalizeRoutePath(url.pathname);
    }),
  );
  const requiredRoutes = new Set(publicRoutes.map((route) => normalizeRoutePath(route.path)));

  for (const route of requiredRoutes) {
    if (!sitemapRoutes.has(route)) fail(`sitemap.xml is missing ${route}.`);
    if (!llms.includes(canonicalUrl(route))) fail(`llms.txt is missing ${route}.`);
  }
  for (const route of sitemapRoutes) {
    if (!requiredRoutes.has(route)) fail(`sitemap.xml contains unexpected route ${route}.`);
  }
}

async function assertRoute(route) {
  const file = routeFile(route.path);
  const html = await readFile(file, "utf8").catch(() => fail(`${route.path} has no generated static HTML at ${path.relative(rootDir, file)}.`));

  if (/<div id=["']root["']>\s*<\/div>/i.test(html)) fail(`${route.path} still has an empty React root.`);
  if (/https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?\//i.test(html)) fail(`${route.path} contains a local preview URL.`);
  if (!html.includes("<script") || !html.includes("/assets/")) fail(`${route.path} is missing Vite asset tags.`);
  if (titleOf(html) !== route.title) fail(`${route.path} has an incorrect or missing title.`);
  if (metaContent(html, "description") !== route.description) fail(`${route.path} has an incorrect or missing meta description.`);
  if (canonicalOf(html) !== canonicalUrl(route.path)) fail(`${route.path} has an incorrect or missing canonical URL.`);
  if (!h1Of(html)) fail(`${route.path} has no H1.`);
  if (paragraphText(html).length < 240) fail(`${route.path} does not contain enough paragraph text before JavaScript.`);
  if (textOnly(html).length < requiredTextLength) fail(`${route.path} does not contain enough readable static text.`);
  if (internalLinks(html).size < requiredInternalLinks) fail(`${route.path} has too few crawlable internal links.`);
  if (metaContent(html, "robots").toLowerCase().includes("noindex")) fail(`${route.path} contains noindex.`);
  if (!metaContent(html, "og:title") || !metaContent(html, "og:description") || !metaContent(html, "og:url") || !metaContent(html, "og:image")) {
    fail(`${route.path} is missing Open Graph metadata.`);
  }
  if (!hasStructuredData(html)) fail(`${route.path} is missing structured data.`);
}

async function existingFile(candidate) {
  try {
    return (await stat(candidate)).isFile() ? candidate : null;
  } catch {
    return null;
  }
}

async function serveDist(request, response) {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://127.0.0.1").pathname);
    const relativePath = pathname.replace(/^\/+/, "");
    const requestedFile = await existingFile(path.join(distDir, relativePath));
    const routeIndex = await existingFile(path.join(distDir, relativePath, "index.html"));
    const filePath = requestedFile ?? routeIndex;

    if (!filePath) {
      const notFound = await existingFile(path.join(distDir, "404.html"));
      response.writeHead(404, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
      if (notFound) createReadStream(notFound).pipe(response);
      else response.end("<!doctype html><title>404</title><h1>Page introuvable</h1>");
      return;
    }

    response.writeHead(200, {
      "cache-control": "no-store",
      "content-type": mimeTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end(error instanceof Error ? error.message : "Unable to serve crawlability files.");
  }
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      const address = server.address();
      if (!address || typeof address === "string") reject(new Error("Unable to resolve crawlability server port."));
      else resolve(address.port);
    });
  });
}

async function assertBotFetches() {
  const server = createServer((request, response) => void serveDist(request, response));
  const port = await listen(server);
  try {
    for (const userAgent of crawlerUserAgents) {
      for (const route of publicRoutes) {
        const response = await fetch(`http://127.0.0.1:${port}${route.path}`, { headers: { "user-agent": userAgent } });
        const html = await response.text();
        if (response.status !== 200) fail(`${userAgent} received HTTP ${response.status} for ${route.path}.`);
        if (!/<h1\b/i.test(html)) fail(`${userAgent} did not receive an H1 for ${route.path}.`);
        if (textOnly(html).length < requiredTextLength) fail(`${userAgent} received thin HTML for ${route.path}.`);
      }
    }

    const unknown = await fetch(`http://127.0.0.1:${port}/url-inconnue-crawlability-test`, { headers: { "user-agent": "Googlebot" } });
    if (unknown.status === 200) fail("Unknown URLs return HTTP 200 instead of a 404 response.");
  } finally {
    server.close();
  }
}

await assertStaticFiles();
for (const route of publicRoutes) await assertRoute(route);
await assertBotFetches();

console.log(`Crawlability check passed for ${publicRoutes.length} public routes and ${crawlerUserAgents.length} crawler user agents.`);
