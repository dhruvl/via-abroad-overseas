import "server-only";
import { createHmac } from "node:crypto";

/**
 * Mirrors the email/phone canonicalization in validation/enquiry.ts:
 * email is trimmed and lowercased; phone whitespace, parentheses, and
 * hyphens are removed while its leading plus sign is preserved.
 */
export function deriveContactPairRateLimitKey(email: string, phone: string, secret: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.trim().replace(/[\s()-]/g, "");
  const digest = createHmac("sha256", secret)
    .update("contact-pair:v1\0")
    .update(normalizedEmail)
    .update("\0")
    .update(normalizedPhone)
    .digest("hex");

  return `contact-pair:v1:${digest}`;
}
