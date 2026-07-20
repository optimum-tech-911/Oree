import { safeStorage } from "@/lib/storage";

const ATTRIBUTION_KEY = "oree:first-attribution:v1";

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  landing_page: string;
  referrer?: string;
  first_visit_at: string;
};

type AttributionPage = {
  search: string;
  pathname: string;
  referrer?: string;
  firstVisitAt?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanString(value: unknown, maxLength = 500): string | undefined {
  if (typeof value !== "string") return undefined;
  const cleaned = value.trim();
  return cleaned ? cleaned.slice(0, maxLength) : undefined;
}

function firstString(record: Record<string, unknown>, keys: string[], maxLength?: number): string | undefined {
  for (const key of keys) {
    const value = cleanString(record[key], maxLength);
    if (value) return value;
  }
  return undefined;
}

/** Converts both the former camelCase draft and the server wire format to one contract. */
export function normalizeAttribution(input: unknown): Attribution | null {
  if (!isRecord(input)) return null;
  const landingPage = firstString(input, ["landing_page", "landingPage"], 2048);
  const firstVisitAt = firstString(input, ["first_visit_at", "firstVisitAt"], 64);
  if (!landingPage || !firstVisitAt || Number.isNaN(Date.parse(firstVisitAt))) return null;

  return {
    utm_source: firstString(input, ["utm_source", "source"]),
    utm_medium: firstString(input, ["utm_medium", "medium"]),
    utm_campaign: firstString(input, ["utm_campaign", "campaign"]),
    utm_term: firstString(input, ["utm_term", "term"]),
    utm_content: firstString(input, ["utm_content", "content"]),
    gclid: firstString(input, ["gclid"]),
    gbraid: firstString(input, ["gbraid"]),
    wbraid: firstString(input, ["wbraid"]),
    landing_page: landingPage,
    referrer: firstString(input, ["referrer"], 2048),
    first_visit_at: firstVisitAt,
  };
}

export function buildAttributionFromPage(page: AttributionPage): Attribution {
  const params = new URLSearchParams(page.search);
  return {
    utm_source: cleanString(params.get("utm_source")),
    utm_medium: cleanString(params.get("utm_medium")),
    utm_campaign: cleanString(params.get("utm_campaign")),
    utm_term: cleanString(params.get("utm_term")),
    utm_content: cleanString(params.get("utm_content")),
    gclid: cleanString(params.get("gclid")),
    gbraid: cleanString(params.get("gbraid")),
    wbraid: cleanString(params.get("wbraid")),
    landing_page: cleanString(page.pathname, 2048) ?? "/",
    referrer: cleanString(page.referrer, 2048),
    first_visit_at: page.firstVisitAt ?? new Date().toISOString(),
  };
}

export function captureAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  const existing = safeStorage.get(ATTRIBUTION_KEY);
  if (existing) {
    try {
      const attribution = normalizeAttribution(JSON.parse(existing));
      if (attribution) {
        safeStorage.set(ATTRIBUTION_KEY, JSON.stringify(attribution));
        return attribution;
      }
      safeStorage.remove(ATTRIBUTION_KEY);
    } catch {
      safeStorage.remove(ATTRIBUTION_KEY);
    }
  }

  const attribution = buildAttributionFromPage({ search: window.location.search, pathname: window.location.pathname, referrer: document.referrer });
  safeStorage.set(ATTRIBUTION_KEY, JSON.stringify(attribution));
  return attribution;
}

export function readAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  const raw = safeStorage.get(ATTRIBUTION_KEY);
  if (!raw) return null;
  try {
    const attribution = normalizeAttribution(JSON.parse(raw));
    if (!attribution) {
      safeStorage.remove(ATTRIBUTION_KEY);
      return null;
    }
    safeStorage.set(ATTRIBUTION_KEY, JSON.stringify(attribution));
    return attribution;
  } catch {
    safeStorage.remove(ATTRIBUTION_KEY);
    return null;
  }
}
