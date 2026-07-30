import { describe, expect, it } from "vitest";
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
});
