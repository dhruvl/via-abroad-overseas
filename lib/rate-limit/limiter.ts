import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const isUpstashConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

// Surface — loudly, in logs — when a production/preview deployment is
// running without distributed rate limiting, so it never silently relies
// on the per-instance in-memory fallback (which is ineffective across
// Vercel's serverless instances). This is a visibility signal, not a
// hard failure: forms still work, but abuse protection is degraded until
// Upstash is configured.
const isProductionRuntime =
  process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
if (isProductionRuntime && !isUpstashConfigured) {
  console.warn(
    "[rate-limit] Upstash is NOT configured in a production runtime. " +
      "Falling back to per-instance in-memory rate limiting, which is NOT " +
      "distributed and provides weak abuse protection. Set " +
      "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN."
  );
}

const redis = isUpstashConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

/**
 * In-memory fallback so local development works without provisioning
 * Upstash. NOT distributed and NOT safe for production (resets on every
 * server restart / is per-instance only) — production deployments must
 * set UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN.
 */
class InMemoryRateLimiter {
  private hits = new Map<string, number[]>();

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  async limit(key: string) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const existing = (this.hits.get(key) ?? []).filter((t) => t > windowStart);
    existing.push(now);
    this.hits.set(key, existing);
    const success = existing.length <= this.maxRequests;
    return {
      success,
      limit: this.maxRequests,
      remaining: Math.max(0, this.maxRequests - existing.length),
      reset: windowStart + this.windowMs,
    };
  }
}

function createLimiter(requests: number, window: `${number} ${"s" | "m" | "h"}`) {
  if (redis) {
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(requests, window),
      analytics: true,
      prefix: "vao-ratelimit",
    });
  }

  const [amount, unit] = window.split(" ");
  const multiplier = unit === "h" ? 3_600_000 : unit === "m" ? 60_000 : 1000;
  return new InMemoryRateLimiter(requests, Number(amount) * multiplier);
}

/** Per-fingerprint burst limit: 5 submissions per 10 minutes. */
export const formFingerprintLimiter = createLimiter(5, "10 m");

/** Stricter limit keyed on the normalized email+phone pair: 3 per hour. */
export const formContactLimiter = createLimiter(3, "1 h");

export const isRateLimitDistributed = isUpstashConfigured;
