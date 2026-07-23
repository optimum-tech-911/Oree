import { describe, expect, it } from "vitest";
import { buildAttributionFromPage, normalizeAttribution } from "@/services/attribution";
import { buildLeadSubmissionBody, parseLeadSubmissionResponse } from "@/services/supabase/repositories";

describe("lead attribution contract", () => {
  it("captures browser parameters with the field names expected by submit-lead", () => {
    const attribution = buildAttributionFromPage({
      search: "?utm_source=google&utm_medium=cpc&utm_campaign=sasu&utm_term=creation%20sasu&utm_content=hero&gclid=click-1&gbraid=gb-1&wbraid=wb-1",
      pathname: "/creation-sasu",
      referrer: "https://www.google.com/",
      firstVisitAt: "2026-07-20T10:00:00.000Z",
    });
    const body = buildLeadSubmissionBody({ firstName: "Lina" }, attribution);

    expect(body.attribution).toEqual({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "sasu",
      utm_term: "creation sasu",
      utm_content: "hero",
      gclid: "click-1",
      gbraid: "gb-1",
      wbraid: "wb-1",
      landing_page: "/creation-sasu",
      referrer: "https://www.google.com/",
      first_visit_at: "2026-07-20T10:00:00.000Z",
    });
    expect(body.attribution).not.toHaveProperty("source");
    expect(body.attribution).not.toHaveProperty("landingPage");
    expect(body.attribution).not.toHaveProperty("firstVisitAt");
  });

  it("normalizes the former local attribution shape before submission", () => {
    expect(normalizeAttribution({
      source: "newsletter",
      medium: "email",
      campaign: "lancement",
      landingPage: "/choisir-statut",
      firstVisitAt: "2026-07-19T08:30:00.000Z",
    })).toEqual({
      utm_source: "newsletter",
      utm_medium: "email",
      utm_campaign: "lancement",
      utm_term: undefined,
      utm_content: undefined,
      gclid: undefined,
      gbraid: undefined,
      wbraid: undefined,
      landing_page: "/choisir-statut",
      referrer: undefined,
      first_visit_at: "2026-07-19T08:30:00.000Z",
    });
  });

  it("omits attribution when no valid first-touch record exists", () => {
    expect(buildLeadSubmissionBody({ firstName: "Lina" }, null)).toEqual({ answers: { firstName: "Lina" } });
    expect(normalizeAttribution({ landing_page: "/creation-sasu" })).toBeNull();
  });

  it("sends the anti-abuse, idempotency and diagnostic result contract", () => {
    const body = buildLeadSubmissionBody({ firstName: "Lina" }, null, {
      submissionId: "58c55530-9c39-4c52-bf1f-0ad01fbe8844",
      anonymousSessionId: "58c55530-9c39-4c52-bf1f-0ad01fbe8844",
      honeypot: "",
      result: { forms: ["SASU"], title: "Piste", explanation: "À confirmer", reasons: [], pointsToValidate: [], action: { label: "Continuer", href: "/inscription" }, complexity: "simple" },
    });
    expect(body).toMatchObject({
      submissionId: "58c55530-9c39-4c52-bf1f-0ad01fbe8844",
      anonymousSessionId: "58c55530-9c39-4c52-bf1f-0ad01fbe8844",
      result: { forms: ["SASU"] },
    });
    expect(body).not.toHaveProperty("honeypot");
  });

  it("rejects deceptive honeypot or malformed server responses", () => {
    expect(() => parseLeadSubmissionResponse({ ok: true })).toThrow(/pas été confirmée/i);
    expect(() => parseLeadSubmissionResponse({ id: "not-a-uuid", claimToken: "x".repeat(64) })).toThrow(/pas été confirmée/i);
    expect(parseLeadSubmissionResponse({ id: "58c55530-9c39-4c52-bf1f-0ad01fbe8844", claimToken: "x".repeat(64) })).toEqual({
      id: "58c55530-9c39-4c52-bf1f-0ad01fbe8844",
      claimToken: "x".repeat(64),
      demo: false,
    });
  });
});
