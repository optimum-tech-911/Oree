const configuredOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "http://localhost:5173")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

export function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const allowed = configuredOrigins.includes(origin) ? origin : configuredOrigins[0] ?? "";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

export function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || configuredOrigins.includes(origin);
}
