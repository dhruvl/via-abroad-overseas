import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  fingerprintLimit: vi.fn(),
  contactLimit: vi.fn(),
  hashFingerprint: vi.fn(),
  getClientIp: vi.fn(),
  deriveContactKey: vi.fn(),
  getSalt: vi.fn(),
}));

vi.mock("@/lib/rate-limit/limiter", () => ({
  formFingerprintLimiter: { limit: mocks.fingerprintLimit },
  formContactLimiter: { limit: mocks.contactLimit },
}));
vi.mock("@/lib/security/fingerprint", () => ({
  hashRequestFingerprint: mocks.hashFingerprint,
  getClientIp: mocks.getClientIp,
}));
vi.mock("@/lib/rate-limit/contact-key", () => ({
  deriveContactPairRateLimitKey: mocks.deriveContactKey,
}));
vi.mock("@/lib/rate-limit/config", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/rate-limit/config")>();
  return { ...actual, getAbuseHashSalt: mocks.getSalt };
});
vi.mock("@/lib/security/spam-checks", () => ({
  isHoneypotTripped: () => false,
  isSuspiciouslyFast: () => false,
  isFormStale: () => false,
}));
vi.mock("@/lib/security/turnstile", () => ({ verifyTurnstileToken: vi.fn() }));
vi.mock("@/lib/database/enquiries", () => ({ insertEnquiry: vi.fn() }));
vi.mock("@/lib/email/send", () => ({
  sendBusinessNotificationEmail: vi.fn(),
  sendStudentConfirmationEmail: vi.fn(),
}));

import { runEnquiryPipeline } from "@/lib/server/enquiry-pipeline";
import { RateLimitUnavailableError } from "@/lib/rate-limit/config";

describe("enquiry rate limit infrastructure failure", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getClientIp.mockReturnValue("203.0.113.10");
    mocks.hashFingerprint.mockResolvedValue("safe-fingerprint-digest");
    mocks.getSalt.mockReturnValue("test-only-abuse-hash-salt-which-is-long-enough-123456");
    mocks.deriveContactKey.mockReturnValue("contact-pair:v1:private-digest");
    mocks.fingerprintLimit.mockRejectedValue(
      new RateLimitUnavailableError("upstash_unavailable")
    );
  });

  it("returns a stable 503 without exposing provider errors or contact PII", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = await runEnquiryPipeline({
      request: new Request("https://example.test/api/enquiries/contact", {
        headers: { "user-agent": "browser-agent" },
      }),
      honeypotValue: undefined,
      formRenderedAt: Date.now() - 10_000,
      turnstileToken: "turnstile-token",
      record: {
        enquiry_type: "general",
        full_name: "Test Person",
        phone: "+14155550199",
        email: "private.person@example.com",
        interested_country: "UK",
        service_required: "Study Abroad",
        consent: true,
      },
      attribution: {},
    });

    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body).toEqual({
      error: "Service temporarily unavailable. Please try again shortly.",
    });
    expect(JSON.stringify(body)).not.toContain("upstash");
    expect(JSON.stringify(body)).not.toContain("private.person@example.com");
    expect(JSON.stringify(body)).not.toContain("+14155550199");
    expect(JSON.stringify(log.mock.calls)).not.toContain("private.person@example.com");
    expect(JSON.stringify(log.mock.calls)).not.toContain("+14155550199");
    expect(JSON.stringify(log.mock.calls)).not.toContain("203.0.113.10");
    expect(log).toHaveBeenCalledWith("[enquiry] Abuse protection unavailable.", {
      reason: "upstash_unavailable",
    });
  });
});
