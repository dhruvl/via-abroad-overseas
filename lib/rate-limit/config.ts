import "server-only";

export type RateLimitUnavailableReason =
  | "upstash_missing"
  | "upstash_invalid"
  | "upstash_unavailable"
  | "abuse_hash_salt_missing"
  | "abuse_hash_salt_invalid"
  | "fingerprint_unavailable";

export class RateLimitUnavailableError extends Error {
  constructor(readonly reason: RateLimitUnavailableReason) {
    super("Rate limiting is temporarily unavailable.");
    this.name = "RateLimitUnavailableError";
  }
}

type Environment = Record<string, string | undefined>;

export type RateLimitRuntimeConfig = {
  productionRuntime: boolean;
  localFallbackAllowed: boolean;
  upstash:
    | { kind: "configured"; url: string; token: string }
    | { kind: "missing" }
    | { kind: "invalid" };
  abuseHashSalt:
    | { kind: "configured"; value: string }
    | { kind: "missing" }
    | { kind: "invalid" };
};

const LOCAL_HASH_SALT = "dev-only-insecure-salt";
const MIN_ABUSE_HASH_SALT_LENGTH = 32;

function isValidUpstashUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname.length > 0 &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
}

export function resolveRateLimitRuntimeConfig(
  env: Environment = process.env
): RateLimitRuntimeConfig {
  const nodeEnv = env.NODE_ENV;
  const productionRuntime = nodeEnv === "production" || env.VERCEL_ENV === "production";
  const localFallbackAllowed =
    !productionRuntime && (nodeEnv === "development" || nodeEnv === "test");

  const rawUrl = env.UPSTASH_REDIS_REST_URL?.trim() ?? "";
  const rawToken = env.UPSTASH_REDIS_REST_TOKEN?.trim() ?? "";
  let upstash: RateLimitRuntimeConfig["upstash"];
  if (!rawUrl && !rawToken) {
    upstash = { kind: "missing" };
  } else if (
    !rawUrl ||
    !rawToken ||
    /\s/.test(rawToken) ||
    !isValidUpstashUrl(rawUrl)
  ) {
    upstash = { kind: "invalid" };
  } else {
    upstash = { kind: "configured", url: rawUrl, token: rawToken };
  }

  const rawSalt = env.ABUSE_HASH_SALT?.trim() ?? "";
  let abuseHashSalt: RateLimitRuntimeConfig["abuseHashSalt"];
  if (!rawSalt) {
    abuseHashSalt = { kind: "missing" };
  } else if (rawSalt.length < MIN_ABUSE_HASH_SALT_LENGTH) {
    abuseHashSalt = { kind: "invalid" };
  } else {
    abuseHashSalt = { kind: "configured", value: rawSalt };
  }

  return { productionRuntime, localFallbackAllowed, upstash, abuseHashSalt };
}

export function getAbuseHashSalt(env: Environment = process.env): string {
  const config = resolveRateLimitRuntimeConfig(env);
  if (config.abuseHashSalt.kind === "configured") return config.abuseHashSalt.value;

  if (config.abuseHashSalt.kind === "invalid") {
    throw new RateLimitUnavailableError("abuse_hash_salt_invalid");
  }

  if (config.localFallbackAllowed) return LOCAL_HASH_SALT;
  throw new RateLimitUnavailableError("abuse_hash_salt_missing");
}

/** A safe deployment-preflight view; secret values are never returned. */
export function getRateLimitConfigurationStatus(env: Environment = process.env) {
  const config = resolveRateLimitRuntimeConfig(env);
  return {
    productionRuntime: config.productionRuntime,
    localFallbackAllowed: config.localFallbackAllowed,
    upstashConfigured: config.upstash.kind === "configured",
    upstashConfiguration: config.upstash.kind,
    abuseHashSaltConfigured: config.abuseHashSalt.kind === "configured",
    abuseHashSaltConfiguration: config.abuseHashSalt.kind,
  };
}
