import { corsHeaders } from "./cors.ts";

export function json(request: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), "Content-Type": "application/json; charset=utf-8" },
  });
}

export function safeError(request: Request, status: number, code: string) {
  return json(request, { error: code }, status);
}
