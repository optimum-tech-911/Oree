import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { AnalyticsService, analyticsDedupeKey, sanitizeAnalyticsPayload } from "@/services/analytics";

describe("contrat analytics publicitaire", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      location: { pathname: "/creation-sasu/" },
      innerWidth: 390,
      sessionStorage: {
        getItem: vi.fn(),
        setItem: vi.fn(),
      },
      localStorage: {
        getItem: vi.fn((key: string) => {
          if (key === "oree:consent:v1") {
            return JSON.stringify({ necessary: true, analytics: true, marketing: true, version: "2026-07-15", updatedAt: new Date().toISOString() });
          }
          return null;
        }),
        setItem: vi.fn(),
      },
      dataLayer: [],
      gtag: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("retire les paramètres de données personnelles", () => {
    expect(sanitizeAnalyticsPayload({
      email: "prospect@example.fr",
      phone: "0600000000",
      telephone: "+33787823208",
      message: "Texte libre",
      legal_form: "SASU",
      value: 600,
    })).toEqual({ legal_form: "SASU", value: 600 });
  });

  it("déduplique une conversion à partir de son identifiant stable", () => {
    const service = new AnalyticsService();
    expect(service.trackOnce("lead_submitted", "lead-123", { legal_form: "SASU" })).toBe(true);
    expect(service.trackOnce("lead_submitted", "lead-123", { legal_form: "SASU" })).toBe(false);
    expect(service.trackOnce("callback_requested", "lead-123", { legal_form: "SASU" })).toBe(true);
    expect(analyticsDedupeKey("lead_submitted", "lead-123")).toContain("lead_submitted:lead-123");
  });

  it("réutilise un seul chargeur Google tag et configure une seule fois le suivi des appels", () => {
    const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
    expect(html.match(/googletagmanager\.com\/gtag\/js/g)).toHaveLength(1);
    expect(html.match(/gtag\('config', 'G-FL6QMMYVLM'\)/g)).toHaveLength(1);
    expect(html.match(/gtag\('config', 'AW-18362621917\/mQHqCLOG6tscEN2__bNE'/g)).toHaveLength(1);
    expect(html).toContain("'phone_conversion_number': '07 87 82 32 08'");
  });

  it("émet phone_click avec page_path, cta_location et device_category sans fuite PII", () => {
    const gtagMock = vi.fn();
    window.gtag = gtagMock as unknown as typeof window.gtag;

    const service = new AnalyticsService();
    service.track("phone_click", {
      location: "hero_call",
      legal_form: "SASU",
      phone: "0600000000", // PII qui doit être filtré
    });

    expect(gtagMock).toHaveBeenCalledTimes(1);
    const firstCall = gtagMock.mock.calls[0] as [string, string, Record<string, unknown>];
    const [command, eventName, payload] = firstCall;
    expect(command).toBe("event");
    expect(eventName).toBe("phone_click");
    expect(payload).toMatchObject({
      location: "hero_call",
      cta_location: "hero_call",
      legal_form: "SASU",
      page_path: "/creation-sasu/",
      device_category: "mobile",
      oree_event: "phone_click",
    });
    expect(payload).not.toHaveProperty("phone");
  });
});

