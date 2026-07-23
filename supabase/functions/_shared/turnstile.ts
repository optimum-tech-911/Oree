export async function verifyTurnstile(token: string | undefined, ip?: string | null) {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  const expectedAction = Deno.env.get("TURNSTILE_EXPECTED_ACTION")?.trim() || "submit_lead";
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not configured");
    return false;
  }
  if (!token) return false;

  const form = new FormData();
  form.set("secret", secret);
  form.set("response", token);
  if (ip) form.set("remoteip", ip);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      signal: controller.signal,
    });
    if (!response.ok) return false;
    const result = await response.json() as { success?: boolean; action?: string; hostname?: string };
    if (result.success !== true || result.action !== expectedAction) return false;

    const allowedHostnames = (Deno.env.get("TURNSTILE_ALLOWED_HOSTNAMES") ?? "")
      .split(",")
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean);
    return allowedHostnames.length === 0 || Boolean(result.hostname && allowedHostnames.includes(result.hostname.toLowerCase()));
  } catch (error) {
    console.error("Turnstile verification failed", error);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
