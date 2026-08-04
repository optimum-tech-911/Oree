import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { AnalyticsService, analyticsDedupeKey, sanitizeAnalyticsPayload } from "@/services/analytics";

describe("contrat analytics publicitaire", () => {
  it("retire les paramètres de données personnelles", () => {
    expect(sanitizeAnalyticsPayload({
      email: "prospect@example.fr",
      phone: "0600000000",
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
});
