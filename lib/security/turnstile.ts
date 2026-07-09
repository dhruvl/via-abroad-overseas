import "server-only";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const isTurnstileConfiguredServer = Boolean(
  process.env.TURNSTILE_SECRET_KEY
);

/**
 * Decides whether the local-development Turnstile bypass may apply.
 *
 * The bypass is permitted ONLY when the app is definitively NOT running as
 * a production deployment. It requires BOTH:
 *   - the runtime is not production — `NODE_ENV !== "production"` AND
 *     `VERCEL_ENV !== "production"` (belt-and-suspenders: a Vercel
 *     production deployment always sets `VERCEL_ENV=production`, even in
 *     the unlikely event `NODE_ENV` were mis-set), AND
 *   - `ALLOW_UNVERIFIED_TURNSTILE_IN_DEV` is explicitly the string "true".
 *
 * Consequence: a Vercel Production deployment can never accept an
 * unverified form because of this development variable. Kept as a pure
 * function of its env input so the invariant is directly unit-tested.
 */
export function isDevTurnstileBypassAllowed(
  env: {
    NODE_ENV?: string;
    VERCEL_ENV?: string;
    ALLOW_UNVERIFIED_TURNSTILE_IN_DEV?: string;
  } = process.env
): boolean {
  const isProductionRuntime =
    env.NODE_ENV === "production" || env.VERCEL_ENV === "production";
  return (
    !isProductionRuntime && env.ALLOW_UNVERIFIED_TURNSTILE_IN_DEV === "true"
  );
}

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
    return isDevTurnstileBypassAllowed();
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
