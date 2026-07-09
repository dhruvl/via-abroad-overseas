import { describe, it, expect } from "vitest";
import { isDevTurnstileBypassAllowed } from "@/lib/security/turnstile";

/**
 * These tests lock the single most important form-security invariant:
 * a production deployment must NEVER accept an unverified Turnstile token
 * because of the development bypass variable.
 */
describe("isDevTurnstileBypassAllowed", () => {
  it("NEVER bypasses when NODE_ENV=production, even with the dev flag true", () => {
    expect(
      isDevTurnstileBypassAllowed({
        NODE_ENV: "production",
        ALLOW_UNVERIFIED_TURNSTILE_IN_DEV: "true",
      })
    ).toBe(false);
  });

  it("NEVER bypasses on a Vercel production deployment, even if NODE_ENV is mis-set", () => {
    expect(
      isDevTurnstileBypassAllowed({
        NODE_ENV: "development",
        VERCEL_ENV: "production",
        ALLOW_UNVERIFIED_TURNSTILE_IN_DEV: "true",
      })
    ).toBe(false);
  });

  it("does not bypass in production when the flag is unset", () => {
    expect(isDevTurnstileBypassAllowed({ NODE_ENV: "production" })).toBe(false);
  });

  it("allows bypass only in development with the flag explicitly 'true'", () => {
    expect(
      isDevTurnstileBypassAllowed({
        NODE_ENV: "development",
        ALLOW_UNVERIFIED_TURNSTILE_IN_DEV: "true",
      })
    ).toBe(true);
  });

  it("does not bypass in development when the flag is missing or not exactly 'true'", () => {
    expect(isDevTurnstileBypassAllowed({ NODE_ENV: "development" })).toBe(false);
    expect(
      isDevTurnstileBypassAllowed({
        NODE_ENV: "development",
        ALLOW_UNVERIFIED_TURNSTILE_IN_DEV: "1",
      })
    ).toBe(false);
    expect(
      isDevTurnstileBypassAllowed({
        NODE_ENV: "development",
        ALLOW_UNVERIFIED_TURNSTILE_IN_DEV: "TRUE",
      })
    ).toBe(false);
  });

  it("allows bypass under the test runner with the flag on (dev-like), but never in a prod runtime", () => {
    expect(
      isDevTurnstileBypassAllowed({
        NODE_ENV: "test",
        ALLOW_UNVERIFIED_TURNSTILE_IN_DEV: "true",
      })
    ).toBe(true);
  });
});
