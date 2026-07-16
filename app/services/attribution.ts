import { safeStorage } from "@/lib/storage";

const ATTRIBUTION_KEY = "oree:first-attribution:v1";

export type Attribution = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  landingPage: string;
  referrer?: string;
  firstVisitAt: string;
};

export function captureAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  const existing = safeStorage.get(ATTRIBUTION_KEY);
  if (existing) {
    try {
      return JSON.parse(existing) as Attribution;
    } catch {
      safeStorage.remove(ATTRIBUTION_KEY);
    }
  }

  const params = new URLSearchParams(window.location.search);
  const attribution: Attribution = {
    source: params.get("utm_source") ?? undefined,
    medium: params.get("utm_medium") ?? undefined,
    campaign: params.get("utm_campaign") ?? undefined,
    term: params.get("utm_term") ?? undefined,
    content: params.get("utm_content") ?? undefined,
    gclid: params.get("gclid") ?? undefined,
    gbraid: params.get("gbraid") ?? undefined,
    wbraid: params.get("wbraid") ?? undefined,
    landingPage: window.location.pathname,
    referrer: document.referrer || undefined,
    firstVisitAt: new Date().toISOString(),
  };
  safeStorage.set(ATTRIBUTION_KEY, JSON.stringify(attribution));
  return attribution;
}

export function readAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  const raw = safeStorage.get(ATTRIBUTION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Attribution;
  } catch {
    return null;
  }
}
