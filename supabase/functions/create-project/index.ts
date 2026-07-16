import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@4";
import { corsHeaders, isAllowedOrigin } from "../_shared/cors.ts";
import { json, safeError } from "../_shared/http.ts";

const schema = z.object({
  displayName: z.string().trim().min(2).max(160),
  leadId: z.string().uuid().optional(),
  activity: z.string().max(2000).optional(),
  department: z.string().max(8).optional(),
  desiredDate: z.string().date().optional(),
});

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
  if (!url || !anon) return safeError(request, 503, "backend_not_configured");

  const client = createClient(url, anon, {
    global: { headers: { Authorization: auth } },
    auth: { persistSession: false },
  });
  const { data, error } = await client.rpc("create_project_bundle", {
    p_display_name: parsed.data.displayName,
    p_lead_id: parsed.data.leadId ?? null,
    p_activity: parsed.data.activity ?? null,
    p_department: parsed.data.department ?? null,
    p_desired_date: parsed.data.desiredDate ?? null,
  });
  if (error) {
    console.error("create-project", error);
    return safeError(request, 400, "project_creation_failed");
  }
  return json(request, { id: data }, 201);
});
