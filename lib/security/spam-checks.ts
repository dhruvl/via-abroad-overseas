import "server-only";

/**
 * Minimum plausible time (ms) between the form rendering and a human
 * submitting it. Used only as one signal among several (honeypot +
 * Turnstile + rate limiting) — never the sole gate, since legitimate
 * users on slow connections or autofill can submit quickly too.
 */
const MIN_SUBMIT_MS = 1500;
const MAX_FORM_AGE_MS = 1000 * 60 * 60; // 1 hour — stale forms are rejected too.

export function isHoneypotTripped(value: string | undefined) {
  return Boolean(value && value.length > 0);
}

export function isSuspiciouslyFast(formRenderedAt: number) {
  const elapsed = Date.now() - formRenderedAt;
  return elapsed < MIN_SUBMIT_MS;
}

export function isFormStale(formRenderedAt: number) {
  const elapsed = Date.now() - formRenderedAt;
  return elapsed > MAX_FORM_AGE_MS || elapsed < 0;
}

/** Reject payloads larger than reasonable before even parsing JSON. */
export const MAX_REQUEST_BYTES = 20_000;
