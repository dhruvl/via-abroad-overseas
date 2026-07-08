import "server-only";

/**
 * Produces a short-lived, salted hash used only to group requests for
 * abuse-rate detection. Never stores or logs the raw IP address — only
 * this derived, non-reversible hash (paired with the coarse user agent)
 * is ever persisted alongside an enquiry.
 */
export async function hashRequestFingerprint(ip: string, userAgent: string) {
  const salt = process.env.ABUSE_HASH_SALT || "dev-only-insecure-salt";
  const input = `${salt}:${ip}:${userAgent.slice(0, 200)}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headers.get("x-real-ip") || "unknown";
}
