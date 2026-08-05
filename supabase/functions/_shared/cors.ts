const configuredOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "http://localhost:5173")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

export function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const allowed = configuredOrigins.includes(origin) ? origin : "";
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
  if (allowed) headers["Access-Control-Allow-Origin"] = allowed;
  return headers;
}

export function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || configuredOrigins.includes(origin);
}
