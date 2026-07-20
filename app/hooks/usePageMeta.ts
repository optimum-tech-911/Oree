import { useEffect } from "react";

type PageMetaOptions = {
  canonicalPath?: string;
  noIndex?: boolean;
};

function upsertMeta(selector: string, attribute: "name" | "property", key: string) {
  const existing = document.querySelector<HTMLMetaElement>(selector) ?? document.head.appendChild(document.createElement("meta"));
  existing.setAttribute(attribute, key);
  return existing;
}

export function usePageMeta(title: string, description: string, options: PageMetaOptions = {}) {
  useEffect(() => {
    document.title = `${title} — Orée`;
    upsertMeta('meta[name="description"]', "name", "description").content = description;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.head.appendChild(document.createElement("link"));
    canonical.rel = "canonical";
    const canonicalPath = options.canonicalPath ?? window.location.pathname;
    canonical.href = `${window.location.origin}${canonicalPath}`;

    upsertMeta('meta[property="og:title"]', "property", "og:title").content = `${title} — Orée`;
    upsertMeta('meta[property="og:description"]', "property", "og:description").content = description;
    upsertMeta('meta[property="og:type"]', "property", "og:type").content = "website";
    upsertMeta('meta[property="og:url"]', "property", "og:url").content = canonical.href;
    upsertMeta('meta[property="og:image"]', "property", "og:image").content = `${window.location.origin}/assets/imagery/heroes/hero-home-company-journey-1280.webp`;
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card").content = "summary_large_image";
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title").content = `${title} — Orée`;
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description").content = description;

    const privateRoute = ["/app", "/ops", "/connexion", "/inscription", "/auth", "/mot-de-passe-oublie", "/reinitialiser-mot-de-passe"].some((prefix) => window.location.pathname === prefix || window.location.pathname.startsWith(`${prefix}/`));
    upsertMeta('meta[name="robots"]', "name", "robots").content = options.noIndex || privateRoute ? "noindex, nofollow" : "index, follow";
  }, [description, options.canonicalPath, options.noIndex, title]);
}
