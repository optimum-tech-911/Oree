# Crawlability audit

Date: 25 July 2026

Production domain: `https://oree.optimutech.fr/`

## Original problem

The raw Vite build produced `dist/index.html` as a small shell around an empty React
mount:

- raw Vite `dist/index.html`: 1.47 kB before prerender;
- body content depended on client-side React execution;
- crawler-visible metadata in `public/robots.txt` and `public/sitemap.xml` still pointed
  to `https://example.fr`;
- Cloudflare Pages fallback was `/* /index.html 200`, so unknown URLs could be served as
  the homepage with HTTP 200.

That combination is unsafe for search engines, Google Ads destination checks and AI/search
crawlers: the route may render for a browser, but the static HTML is thin or misleading
before JavaScript executes.

## Root cause

The application is a React/Vite SPA. Public content exists in React components, while the
default Vite output contains only the mount node and JavaScript assets. The existing
metadata hook updates the browser document after React starts, which is useful for users
but not enough for crawlers that evaluate static HTML first.

The routing fallback also treated unknown paths as valid SPA paths. That preserved client
routing, but made crawl status ambiguous.

## Changes made

- Added `scripts/crawlability-routes.mjs` as the canonical list of public crawlable routes,
  crawler user agents and production canonical origin.
- Reworked `scripts/prerender.mjs` so `npm run build`:
  - builds the Vite application;
  - serves `dist` locally;
  - visits every required public route and known app/auth/ops route with Puppeteer;
  - writes full HTML into each route's `dist/<route>/index.html`;
  - preserves root-relative Vite asset tags;
  - injects production title, description, canonical, robots, Open Graph, Twitter card and
    JSON-LD structured data for public routes;
  - verifies React hydration for all prerendered routes.
- Updated `app/main.tsx` to hydrate existing markup and mount only when the root is empty.
- Added `npm run crawlability:check` via `scripts/crawlability-check.mjs`. The command fails
  if a public route is missing static HTML, has no title/description/canonical/H1, lacks
  readable text or crawlable internal links, contains `noindex`, has missing Open Graph or
  structured data, contains localhost asset URLs, has missing robots/sitemap files, or has
  sitemap routes that do not match the generated public route contract.
- Replaced placeholder crawler files:
  - `public/robots.txt` now points to `https://oree.optimutech.fr/sitemap.xml`;
  - `public/sitemap.xml` now contains the production public routes;
  - `public/_redirects` redirects `/offres` to `/tarifs/` and falls through unknown URLs to
    `/404.html` with status 404;
  - `public/404.html` provides a static noindex 404 page.

No JSX layout, Tailwind class, CSS or visual component was changed for this audit.

## Routes verified

The crawlability contract covers these public routes:

- `/`
- `/creation-sasu/`
- `/creation-eurl/`
- `/creation-sas/`
- `/creation-sarl/`
- `/choisir-statut/`
- `/creer-entreprise-seul/`
- `/creer-entreprise-a-plusieurs/`
- `/creer-entreprise-en-etant-salarie/`
- `/creer-entreprise-demandeur-emploi/`
- `/passer-micro-entreprise-en-societe/`
- `/dossier-creation-entreprise-bloque/`
- `/comment-ca-marche/`
- `/tarifs/`
- `/accompagnement/`
- `/diagnostic/`
- `/rendez-vous/`
- `/confidentialite/`
- `/mentions-legales/`

The build also prerenders known auth, client and operations routes so direct navigation to
known application URLs can still hydrate while the global Cloudflare fallback returns 404
for unknown URLs.

## Generated output evidence

After prerender:

- `dist/index.html`: 174,990 bytes, 1 H1, 129 paragraphs, 44 links, JSON-LD present;
- `dist/creation-sasu/index.html`: 87,382 bytes, 1 H1, 54 paragraphs, 36 links, JSON-LD present;
- `dist/diagnostic/index.html`: 56,944 bytes, 1 H1, 36 paragraphs, 26 links, JSON-LD present;
- 47 route `index.html` files were generated;
- checked sample files contain no empty `<div id="root"></div>`;
- checked sample files contain no `127.0.0.1` or `localhost` asset URLs.

## Crawler user agents tested

`npm run crawlability:check` serves the generated `dist` locally and fetches every public
route with:

- `Googlebot`
- `Bingbot`
- `OAI-SearchBot`
- `ChatGPT-User`
- `Claude-SearchBot`
- `Claude-User`

It also verifies that an unknown URL returns 404 instead of homepage HTML with HTTP 200.

## Command results

Executed successfully:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run crawlability:check`

Result details:

- ESLint: passed.
- TypeScript: passed.
- Vitest: 6 files passed, 26 tests passed.
- Build: Vite build passed; Puppeteer prerendered and hydration-checked 47 routes.
- Crawlability check: passed for 19 public routes and 6 crawler user agents.

The live-domain read-only probe against `https://oree.optimutech.fr/` could not be executed
from this environment because the command approval layer rejected the external network
request. The repository and generated production output are verified locally; production
will reflect these fixes after deploying this build.
