import "server-only";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileFailureReason =
  | "missing_token"
  | "provider_rejected"
  | "hostname_mismatch"
  | "action_mismatch"
  | "provider_unavailable"
  | "configuration_missing";

export type TurnstileVerification =
  | { valid: true }
  | { valid: false; reason: TurnstileFailureReason };

type TurnstileSiteverifyResponse = {
  success?: boolean;
  hostname?: string;
  action?: string;
  challenge_ts?: string;
  "error-codes"?: string[];
};

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1"]);

function isProductionRuntime(env: NodeJS.ProcessEnv = process.env) {
  return env.NODE_ENV === "production" || env.VERCEL_ENV === "production";
}

function getExpectedHostname(env: NodeJS.ProcessEnv = process.env): string | null {
  const canonicalUrl = env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelProductionUrl = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const configuredValue = canonicalUrl || vercelProductionUrl;
  if (!configuredValue) return null;

  try {
    const parsed = new URL(
      configuredValue.includes("://") ? configuredValue : `https://${configuredValue}`
    );
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    if (parsed.username || parsed.password || !parsed.hostname) return null;
    return parsed.hostname.toLowerCase();
  } catch {
    return null;
  }
}

function hostnameMatches(
  receivedHostname: unknown,
  expectedHostname: string,
  env: NodeJS.ProcessEnv = process.env
): boolean {
  if (typeof receivedHostname !== "string") return false;
  const normalized = receivedHostname.trim().toLowerCase();
  if (normalized === expectedHostname) return true;
  return !isProductionRuntime(env) && LOCAL_HOSTNAMES.has(normalized);
}

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
 * In local development, when Turnstile configuration is missing, this
 * fails closed UNLESS explicitly relaxed via
 * ALLOW_UNVERIFIED_TURNSTILE_IN_DEV=true, so contributors can exercise the
 * rest of the form flow without provisioning real Turnstile keys.
 */
export async function verifyTurnstileToken(
  input: { token: string; expectedAction: string; remoteIp?: string }
): Promise<TurnstileVerification> {
  const { token, expectedAction, remoteIp } = input;
  if (!token) return { valid: false, reason: "missing_token" };

  const expectedHostname = getExpectedHostname();
  const localHostnameInProduction =
    isProductionRuntime() && expectedHostname !== null && LOCAL_HOSTNAMES.has(expectedHostname);
  if (!process.env.TURNSTILE_SECRET_KEY || !expectedHostname || localHostnameInProduction) {
    if (
      !isProductionRuntime() &&
      isDevTurnstileBypassAllowed()
    ) {
      return { valid: true };
    }
    return { valid: false, reason: "configuration_missing" };
  }

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

    if (!response.ok) return { valid: false, reason: "provider_unavailable" };
    const result = (await response.json()) as TurnstileSiteverifyResponse;
    if (result.success !== true) {
      return {
        valid: false,
        reason: result["error-codes"]?.includes("internal-error")
          ? "provider_unavailable"
          : "provider_rejected",
      };
    }
    if (!hostnameMatches(result.hostname, expectedHostname)) {
      return { valid: false, reason: "hostname_mismatch" };
    }
    if (result.action !== expectedAction) return { valid: false, reason: "action_mismatch" };
    return { valid: true };
  } catch {
    return { valid: false, reason: "provider_unavailable" };
  }
}
