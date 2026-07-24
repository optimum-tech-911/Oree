import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const routes = [
  "/", "/comment-ca-marche", "/offres", "/tarifs", "/accompagnement", "/choisir-statut", "/diagnostic", "/rendez-vous",
  "/creation-sasu", "/creation-eurl", "/creation-sas", "/creation-sarl", "/creer-entreprise-seul", "/creer-entreprise-a-plusieurs",
  "/creer-entreprise-en-etant-salarie", "/creer-entreprise-demandeur-emploi", "/passer-micro-entreprise-en-societe", "/dossier-creation-entreprise-bloque",
  "/confidentialite", "/mentions-legales", "/connexion", "/inscription", "/mot-de-passe-oublie", "/reinitialiser-mot-de-passe",
  "/auth/callback", "/auth/confirmation", "/app", "/app/projet", "/app/orientation", "/app/associes", "/app/documents", "/app/formalites",
  "/app/suivi", "/app/messages", "/app/rendez-vous", "/app/notifications", "/app/parametres", "/ops", "/ops/leads", "/ops/projets",
  "/ops/documents", "/ops/rendez-vous", "/ops/equipe", "/ops/messages", "/ops/analytics", "/ops/audit", "/ops/aide", "/ops/profil",
];

const mimeTypes = {
  ".css": "text/css; charset=utf-8", ".gif": "image/gif", ".html": "text/html; charset=utf-8", ".ico": "image/x-icon",
  ".jpeg": "image/jpeg", ".jpg": "image/jpeg", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".woff2": "font/woff2",
};

function routeFile(route) {
  return route === "/" ? path.join(distDir, "index.html") : path.join(distDir, route.replace(/^\/+|\/+$/g, ""), "index.html");
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
    const routeIndex = path.join(distDir, relativePath, "index.html");
    const filePath = requestedFile ?? await existingFile(routeIndex) ?? path.join(distDir, "index.html");
    response.writeHead(200, { "content-type": mimeTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream", "cache-control": "no-store" });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end(error instanceof Error ? error.message : "Unable to serve prerender files.");
  }
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      resolve(server.address().port);
    });
  });
}

async function settlePage(page, port, route) {
  await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "networkidle0", timeout: 60_000 });
  await page.waitForSelector("main, [data-page-loader], #root > *", { timeout: 30_000 });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function renderRoutes(page, port) {
  for (const route of routes) {
    await settlePage(page, port, route);
    const html = await page.evaluate(() => document.documentElement.outerHTML);
    const target = routeFile(route);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, `${html}\n`, "utf8");
    console.log(`prerendered ${route} → ${path.relative(rootDir, target)}`);
  }
}

async function verifyHydration(page, port) {
  const warnings = [];
  const pageErrors = [];
  const onConsole = (message) => {
    if (message.type() === "warning" && /hydration|did not match|hydrating/i.test(message.text())) warnings.push(message.text());
  };
  const onPageError = (error) => {
    if (/hydration|did not match|hydrating|react error #418/i.test(error.message)) pageErrors.push(error.message);
  };
  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  for (const route of routes) {
    warnings.length = 0;
    pageErrors.length = 0;
    await settlePage(page, port, route);
    if (warnings.length || pageErrors.length) throw new Error(`React hydration issue on ${route}: ${[...warnings, ...pageErrors].join(" | ")}`);
  }
  page.off("console", onConsole);
  page.off("pageerror", onPageError);
}

const server = createServer((request, response) => void serveDist(request, response));
let browser;
try {
  const port = await listen(server);
  browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
  await renderRoutes(page, port);
  await verifyHydration(page, port);
  console.log(`Prerendered and hydration-checked ${routes.length} routes.`);
} finally {
  await browser?.close();
  server.close();
}
