import { safeStorage } from "@/lib/storage";

export const CONSENT_KEY = "oree:consent:v1";
export const CONSENT_VERSION = "2026-07-15";

export type ConsentChoice = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  version: string;
  updatedAt: string;
};

export function readConsent(): ConsentChoice | null {
  const raw = safeStorage.get(CONSENT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ConsentChoice;
    return parsed.version === CONSENT_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

export function writeConsent(input: Pick<ConsentChoice, "analytics" | "marketing">): ConsentChoice {
  const choice: ConsentChoice = {
    necessary: true,
    analytics: input.analytics,
    marketing: input.marketing,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };
  safeStorage.set(CONSENT_KEY, JSON.stringify(choice));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("oree:consent-updated", { detail: choice }));
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({
      event: "consent_update",
      analytics_storage: choice.analytics ? "granted" : "denied",
      ad_storage: choice.marketing ? "granted" : "denied",
      ad_user_data: choice.marketing ? "granted" : "denied",
      ad_personalization: choice.marketing ? "granted" : "denied",
    });
  }
  return choice;
}
