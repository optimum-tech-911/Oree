import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@4";
import { corsHeaders, isAllowedOrigin } from "../_shared/cors.ts";
import { json, safeError } from "../_shared/http.ts";

const schema = z.object({ leadId: z.string().uuid(), claimToken: z.string().min(40).max(200) });

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(request) });
  if (request.method !== "POST") return safeError(request, 405, "method_not_allowed");
  if (!isAllowedOrigin(request)) return safeError(request, 403, "origin_not_allowed");

  const auth = request.headers.get("Authorization");
  if (!auth) return safeError(request, 401, "authentication_required");
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return safeError(request, 400, "invalid_payload");

  const url = Deno.env.get("SUPABASE_URL");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !anon || !service) return safeError(request, 503, "backend_not_configured");

  const userClient = createClient(url, anon, { global: { headers: { Authorization: auth } }, auth: { persistSession: false } });
  const { data: userData } = await userClient.auth.getUser();
  const user = userData.user;
  if (!user?.email) return safeError(request, 401, "authentication_required");

  const admin = createClient(url, service, { auth: { persistSession: false } });
  const { data: lead } = await admin.from("leads").select("id,email,claim_token_hash,linked_user_id").eq("id", parsed.data.leadId).maybeSingle();
  if (!lead || lead.linked_user_id) return safeError(request, 409, "lead_unavailable");
  if (lead.email.toLowerCase() !== user.email.toLowerCase()) return safeError(request, 403, "email_mismatch");
  if (lead.claim_token_hash !== await sha256(parsed.data.claimToken)) return safeError(request, 403, "invalid_claim_token");

  const { error } = await admin.from("leads").update({ linked_user_id: user.id, claim_token_hash: null }).eq("id", lead.id).is("linked_user_id", null);
  if (error) return safeError(request, 500, "claim_failed");
  return json(request, { claimed: true });
});
