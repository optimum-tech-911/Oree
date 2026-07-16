import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@4";
import { corsHeaders, isAllowedOrigin } from "../_shared/cors.ts";
import { json, safeError } from "../_shared/http.ts";
import { verifyTurnstile } from "../_shared/turnstile.ts";

const inputSchema = z.object({
  answers: z.object({
    stage: z.string().max(80).optional(),
    founderMode: z.string().max(30).optional(),
    professionalStatus: z.string().max(50).optional(),
    currentStructure: z.string().max(50).optional(),
    activity: z.string().max(100).optional(),
    existingClients: z.boolean().optional(),
    priorities: z.array(z.string().max(80)).max(12).optional(),
    timeline: z.string().max(30).optional(),
    department: z.string().max(8).optional(),
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(6).max(30),
  }),
  attribution: z.record(z.string(), z.unknown()).optional(),
  result: z.record(z.string(), z.unknown()).optional(),
  anonymousSessionId: z.string().max(160).optional(),
  turnstileToken: z.string().max(4096).optional(),
  honeypot: z.string().max(200).optional(),
});

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
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
    if (!url || !serviceKey) return safeError(request, 503, "backend_not_configured");
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

    const a = parsed.data.answers;
    const claimToken = crypto.randomUUID() + crypto.randomUUID();
    const { data: lead, error: leadError } = await admin.from("leads").insert({
      first_name: a.firstName,
      last_name: a.lastName,
      email: a.email.toLowerCase(),
      phone: a.phone,
      department: a.department,
      project_stage: a.stage,
      desired_creation_window: a.timeline,
      source_page: String(parsed.data.attribution?.landing_page ?? ""),
      claim_token_hash: await sha256(claimToken),
    }).select("id").single();
    if (leadError) throw leadError;

    const attribution = parsed.data.attribution ?? {};
    const { error: attributionError } = await admin.from("lead_attributions").insert({
      lead_id: lead.id,
      first_source: attribution.utm_source,
      first_medium: attribution.utm_medium,
      first_campaign: attribution.utm_campaign,
      first_term: attribution.utm_term,
      first_content: attribution.utm_content,
      first_landing_page: attribution.landing_page,
      first_referrer: attribution.referrer,
      last_source: attribution.utm_source,
      last_medium: attribution.utm_medium,
      last_campaign: attribution.utm_campaign,
      last_term: attribution.utm_term,
      last_content: attribution.utm_content,
      last_landing_page: attribution.landing_page,
      gclid: attribution.gclid,
      gbraid: attribution.gbraid,
      wbraid: attribution.wbraid,
      first_visit_at: attribution.first_visit_at,
    });
    if (attributionError) throw attributionError;

    const { error: diagnosticError } = await admin.from("diagnostic_sessions").insert({
      anonymous_session_id: parsed.data.anonymousSessionId,
      lead_id: lead.id,
      status: "completed",
      last_step: "contact",
      answers_json: a,
      result_json: parsed.data.result ?? {},
      completed_at: new Date().toISOString(),
    });
    if (diagnosticError) throw diagnosticError;

    await admin.from("notification_jobs").insert({
      channel: "email",
      template_key: "new_lead",
      recipient: Deno.env.get("LEAD_NOTIFICATION_EMAIL") ?? "operations@example.invalid",
      payload: { leadId: lead.id },
    });

    return json(request, { id: lead.id, claimToken }, 201);
  } catch (error) {
    console.error("submit-lead", error);
    return safeError(request, 500, "lead_submission_failed");
  }
});
