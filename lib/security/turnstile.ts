import "server-only";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const isTurnstileConfiguredServer = Boolean(
  process.env.TURNSTILE_SECRET_KEY
);

/**
 * Verifies a Turnstile token server-side. The client-side widget alone is
 * never trusted — every form submission is re-checked here before any
 * database write happens.
 *
 * In local development, when TURNSTILE_SECRET_KEY is not configured, this
 * fails closed (returns false) UNLESS explicitly relaxed via
 * ALLOW_UNVERIFIED_TURNSTILE_IN_DEV=true, so contributors can exercise the
 * rest of the form flow without provisioning real Turnstile keys.
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<boolean> {
  if (!isTurnstileConfiguredServer) {
    return (
      process.env.NODE_ENV !== "production" &&
      process.env.ALLOW_UNVERIFIED_TURNSTILE_IN_DEV === "true"
    );
  }

  if (!token) return false;

  try {
    const formData = new URLSearchParams();
    formData.set("secret", process.env.TURNSTILE_SECRET_KEY!);
    formData.set("response", token);
    if (remoteIp) formData.set("remoteip", remoteIp);

    const response = await fetch(VERIFY_URL, {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) return false;
    const result = (await response.json()) as { success: boolean };
    return result.success === true;
  } catch {
    // Network failure talking to Cloudflare — fail closed.
    return false;
  }
}
