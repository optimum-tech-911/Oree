import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { CANONICAL_ORIGIN, canonicalUrl, normalizeRoutePath, prerenderRoutes, publicRoutes } from "./crawlability-routes.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const publicRouteByPath = new Map(publicRoutes.map((route) => [normalizeRoutePath(route.path), route]));

const mimeTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function routeFile(route) {
  const normalized = normalizeRoutePath(route);
  return normalized === "/" ? path.join(distDir, "index.html") : path.join(distDir, normalized.replace(/^\/+|\/+$/g, ""), "index.html");
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
    const filePath = requestedFile ?? routeIndex ?? path.join(distDir, "index.html");

    response.writeHead(200, {
      "cache-control": "no-store",
      "content-type": mimeTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream",
    });
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
      const address = server.address();
      if (!address || typeof address === "string") reject(new Error("Unable to resolve prerender server port."));
      else resolve(address.port);
    });
  });
}

function schemaForRoute(route) {
  const url = canonicalUrl(route.path);
  const graph = [
    {
      "@type": "Organization",
      "@id": `${CANONICAL_ORIGIN}/#organization`,
      name: "Orée Entreprises",
      url: CANONICAL_ORIGIN,
      logo: `${CANONICAL_ORIGIN}/android-chrome-512x512.png`,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "Sebaasofiene@gmail.com",
        telephone: "+33787823208",
        areaServed: "FR",
        availableLanguage: ["fr"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${CANONICAL_ORIGIN}/#website`,
      name: "Orée",
      url: CANONICAL_ORIGIN,
      inLanguage: "fr-FR",
      publisher: { "@id": `${CANONICAL_ORIGIN}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: route.title,
      description: route.description,
      isPartOf: { "@id": `${CANONICAL_ORIGIN}/#website` },
      about: { "@id": `${CANONICAL_ORIGIN}/#organization` },
      inLanguage: "fr-FR",
    },
  ];

  if (route.kind === "landing" || route.kind === "service" || route.kind === "pricing" || route.kind === "diagnostic") {
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: route.title.replace(" - Orée", ""),
      serviceType: "Accompagnement à la création de société",
      areaServed: "FR",
      provider: { "@id": `${CANONICAL_ORIGIN}/#organization` },
      url,
    });
  }

  if (route.path !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: `${CANONICAL_ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: route.title.replace(" - Orée", ""), item: url },
      ],
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

async function applyPublicMetadata(page, route) {
  const routeMeta = publicRouteByPath.get(normalizeRoutePath(route));
  if (!routeMeta) return;

  await page.evaluate(
    ({ canonical, description, image, schema, title }) => {
      const upsertMeta = (selector, attribute, key, content) => {
        const meta = document.querySelector(selector) ?? document.head.appendChild(document.createElement("meta"));
        meta.setAttribute(attribute, key);
        meta.setAttribute("content", content);
      };

      document.title = title;
      upsertMeta('meta[name="description"]', "name", "description", description);
      upsertMeta('meta[name="robots"]', "name", "robots", "index, follow");
      upsertMeta('meta[property="og:title"]', "property", "og:title", title);
      upsertMeta('meta[property="og:description"]', "property", "og:description", description);
      upsertMeta('meta[property="og:type"]', "property", "og:type", "website");
      upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);
      upsertMeta('meta[property="og:image"]', "property", "og:image", image);
      upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", "Orée");
      upsertMeta('meta[property="og:locale"]', "property", "og:locale", "fr_FR");
      upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
      upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
      upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
      upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", image);

      const link = document.querySelector('link[rel="canonical"]') ?? document.head.appendChild(document.createElement("link"));
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", canonical);

      document.querySelector('script[data-oree-structured-data="true"]')?.remove();
      const jsonLd = document.createElement("script");
      jsonLd.type = "application/ld+json";
      jsonLd.dataset.oreeStructuredData = "true";
      jsonLd.textContent = JSON.stringify(schema);
      document.head.appendChild(jsonLd);
    },
    {
      canonical: canonicalUrl(routeMeta.path),
      description: routeMeta.description,
      image: `${CANONICAL_ORIGIN}/assets/imagery/heroes/hero-home-company-journey-1280.webp`,
      schema: schemaForRoute(routeMeta),
      title: routeMeta.title,
    },
  );
}

async function settlePage(page, port, route) {
  await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "networkidle0", timeout: 60_000 });
  await page.waitForSelector("main, [data-page-loader], #root > *", { timeout: 30_000 });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function renderRoutes(page, port) {
  for (const route of prerenderRoutes) {
    await settlePage(page, port, route);
    await applyPublicMetadata(page, route);
    const html = (await page.evaluate(() => document.documentElement.outerHTML)).replaceAll(`http://127.0.0.1:${port}/`, "/");
    const target = routeFile(route);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, `${html}\n`, "utf8");
    console.log(`prerendered ${route} -> ${path.relative(rootDir, target)}`);
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
  for (const route of prerenderRoutes) {
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
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const hostname = new URL(request.url()).hostname;
    if (hostname === "www.googletagmanager.com" || hostname === "www.google-analytics.com" || hostname === "www.gstatic.com") {
      request.abort();
      return;
    }
    request.continue();
  });
  await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
  await renderRoutes(page, port);
  await verifyHydration(page, port);
  console.log(`Prerendered and hydration-checked ${prerenderRoutes.length} routes.`);
} finally {
  await browser?.close();
  server.close();
}
