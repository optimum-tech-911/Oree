import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@4";
import { corsHeaders, isAllowedOrigin } from "../_shared/cors.ts";
import { json, safeError } from "../_shared/http.ts";
import { verifyTurnstile } from "../_shared/turnstile.ts";

const attributionText = z.string().trim().min(1).max(500).optional();
const attributionLocation = z.string().trim().min(1).max(2048).optional();
const attributionVisitDate = z.string().trim().max(64).refine((value) => !Number.isNaN(Date.parse(value)), "invalid_visit_date").optional();
const attributionSchema = z.object({
  utm_source: attributionText,
  utm_medium: attributionText,
  utm_campaign: attributionText,
  utm_term: attributionText,
  utm_content: attributionText,
  gclid: attributionText,
  gbraid: attributionText,
  wbraid: attributionText,
  landing_page: attributionLocation,
  referrer: attributionLocation,
  first_visit_at: attributionVisitDate,
  // Transitional aliases for clients that still hold the former local format.
  source: attributionText,
  medium: attributionText,
  campaign: attributionText,
  term: attributionText,
  content: attributionText,
  landingPage: attributionLocation,
  firstVisitAt: attributionVisitDate,
}).transform((attribution) => ({
  utm_source: attribution.utm_source ?? attribution.source,
  utm_medium: attribution.utm_medium ?? attribution.medium,
  utm_campaign: attribution.utm_campaign ?? attribution.campaign,
  utm_term: attribution.utm_term ?? attribution.term,
  utm_content: attribution.utm_content ?? attribution.content,
  gclid: attribution.gclid,
  gbraid: attribution.gbraid,
  wbraid: attribution.wbraid,
  landing_page: attribution.landing_page ?? attribution.landingPage,
  referrer: attribution.referrer,
  first_visit_at: attribution.first_visit_at ?? attribution.firstVisitAt,
}));

const inputSchema = z.object({
  answers: z.object({
    startingSituation: z.string().max(40).optional(),
    stage: z.string().max(80).optional(),
    founderMode: z.string().max(30).optional(),
    professionalStatus: z.string().max(50).optional(),
    currentStructure: z.string().max(50).optional(),
    activity: z.string().max(100).optional(),
    existingClients: z.boolean().optional(),
    priorities: z.array(z.string().max(80)).max(12).optional(),
    timeline: z.string().max(30).optional(),
    remunerationTiming: z.string().max(30).optional(),
    supportLevel: z.string().max(30).optional(),
    blockedStage: z.string().max(80).optional(),
    blockedMessage: z.string().max(4000).optional(),
    department: z.string().max(8).optional(),
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(254),
    phone: z.preprocess((value) => value === "" ? undefined : value, z.string().trim().min(6).max(30).optional()),
    privacyAccepted: z.literal(true),
    wantsCallback: z.boolean().optional(),
  }).superRefine((answers, context) => {
    if (answers.wantsCallback && !answers.phone) context.addIssue({ code: "custom", path: ["phone"], message: "phone_required_for_callback" });
  }),
  attribution: attributionSchema.nullish(),
  result: z.record(z.string(), z.unknown()).optional(),
  submissionId: z.string().uuid(),
  anonymousSessionId: z.string().max(160).optional(),
  turnstileToken: z.string().max(4096).optional(),
  honeypot: z.string().max(200).optional(),
});

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function deriveClaimToken(submissionId: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(submissionId));
  return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(request) });
  if (request.method !== "POST") return safeError(request, 405, "method_not_allowed");
  if (!isAllowedOrigin(request)) return safeError(request, 403, "origin_not_allowed");

  try {
    const parsed = inputSchema.safeParse(await request.json());
    if (!parsed.success) return safeError(request, 400, "invalid_payload");
    if (parsed.data.honeypot) return json(request, { ok: true }, 202);

    const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for");
    if (!(await verifyTurnstile(parsed.data.turnstileToken, ip))) return safeError(request, 400, "captcha_failed");

    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const claimSecret = Deno.env.get("LEAD_CLAIM_SECRET");
    const privacyPolicyVersion = Deno.env.get("PRIVACY_POLICY_VERSION");
    if (!url || !serviceKey || !claimSecret || claimSecret.length < 32 || !privacyPolicyVersion) return safeError(request, 503, "backend_not_configured");
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

    const claimToken = await deriveClaimToken(parsed.data.submissionId, claimSecret);
    const { data: leadId, error: intakeError } = await admin.rpc("submit_lead_bundle", {
      p_answers: parsed.data.answers,
      p_attribution: parsed.data.attribution ?? {},
      p_result: parsed.data.result ?? {},
      p_anonymous_session_id: parsed.data.anonymousSessionId ?? null,
      p_submission_id: parsed.data.submissionId,
      p_claim_token_hash: await sha256(claimToken),
      p_privacy_policy_version: privacyPolicyVersion,
      p_notification_email: Deno.env.get("LEAD_NOTIFICATION_EMAIL") ?? "",
    });
    if (intakeError || typeof leadId !== "string") throw intakeError ?? new Error("invalid_lead_id");

    return json(request, { id: leadId, claimToken }, 201);
  } catch (error) {
    console.error("submit-lead", error);
    return safeError(request, 500, "lead_submission_failed");
  }
});
