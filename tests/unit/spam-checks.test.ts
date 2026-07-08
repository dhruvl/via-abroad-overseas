import { describe, it, expect } from "vitest";
import { isHoneypotTripped, isSuspiciouslyFast, isFormStale } from "@/lib/security/spam-checks";

describe("isHoneypotTripped", () => {
  it("is false for empty/undefined values", () => {
    expect(isHoneypotTripped(undefined)).toBe(false);
    expect(isHoneypotTripped("")).toBe(false);
  });

  it("is true when a bot fills the hidden field", () => {
    expect(isHoneypotTripped("http://spam.example")).toBe(true);
  });
});

describe("isSuspiciouslyFast", () => {
  it("flags submissions faster than a human could plausibly complete", () => {
    expect(isSuspiciouslyFast(Date.now())).toBe(true);
    expect(isSuspiciouslyFast(Date.now() - 100)).toBe(true);
  });

  it("allows submissions after a plausible delay", () => {
    expect(isSuspiciouslyFast(Date.now() - 5000)).toBe(false);
  });
});

describe("isFormStale", () => {
  it("rejects forms older than the max age", () => {
    expect(isFormStale(Date.now() - 1000 * 60 * 60 * 2)).toBe(true);
  });

  it("rejects a timestamp in the future", () => {
    expect(isFormStale(Date.now() + 10000)).toBe(true);
  });

  it("allows a recently rendered form", () => {
    expect(isFormStale(Date.now() - 10000)).toBe(false);
  });
});
