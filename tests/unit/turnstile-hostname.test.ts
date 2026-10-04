// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { isAllowedTurnstileHostname } from "@/lib/security/turnstile";

const prodEnv = {
  NODE_ENV: "production",
  VERCEL_ENV: "production",
  NEXT_PUBLIC_SITE_URL: "https://www.viaabroad.example",
};
const prodSiteUrl = "https://www.viaabroad.example";

describe("isAllowedTurnstileHostname", () => {
  it("accepts the configured site host (case-insensitive)", () => {
    expect(isAllowedTurnstileHostname("www.viaabroad.example", prodEnv, prodSiteUrl)).toBe(true);
    expect(isAllowedTurnstileHostname("WWW.ViaAbroad.example", prodEnv, prodSiteUrl)).toBe(true);
  });

  it("accepts the Vercel production domain and *.vercel.app preview hosts", () => {
    const env = { ...prodEnv, VERCEL_PROJECT_PRODUCTION_URL: "via-abroad-overseas.vercel.app" };
    expect(isAllowedTurnstileHostname("via-abroad-overseas.vercel.app", env, prodSiteUrl)).toBe(true);
    expect(
      isAllowedTurnstileHostname("via-abroad-overseas-git-feat-x-team.vercel.app", env, prodSiteUrl)
    ).toBe(true);
  });

  it("rejects other hosts, look-alikes, and nested vercel.app lookalikes", () => {
    for (const host of [
      "evil.example",
      "viaabroad.example.evil.example",
      "www.viaabroad.example.evil.example",
      "vercel.app",
      "evil.vercel.app.attacker.example",
      "a.b.vercel.app",
    ]) {
      expect(isAllowedTurnstileHostname(host, prodEnv, prodSiteUrl)).toBe(false);
    }
  });

  it("fails closed on a missing or non-string hostname", () => {
    expect(isAllowedTurnstileHostname(undefined, prodEnv, prodSiteUrl)).toBe(false);
    expect(isAllowedTurnstileHostname("", prodEnv, prodSiteUrl)).toBe(false);
    expect(isAllowedTurnstileHostname(42, prodEnv, prodSiteUrl)).toBe(false);
  });

  it("accepts localhost only outside production runtimes", () => {
    expect(isAllowedTurnstileHostname("localhost", { NODE_ENV: "development" }, "http://localhost:3000")).toBe(true);
    expect(isAllowedTurnstileHostname("localhost", { NODE_ENV: "production" }, "http://localhost:3000")).toBe(false);
    expect(
      isAllowedTurnstileHostname("localhost", { NODE_ENV: "development", VERCEL_ENV: "production" }, prodSiteUrl)
    ).toBe(false);
  });
});

describe("verifyTurnstileToken hostname enforcement", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  async function verifyWith(siteverifyBody: unknown) {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "test-turnstile-secret");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", prodSiteUrl);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify(siteverifyBody), { status: 200 }))
    );
    vi.resetModules();
    const { verifyTurnstileToken } = await import("@/lib/security/turnstile");
    return verifyTurnstileToken("token", "203.0.113.10");
  }

  it("accepts a successful verification for the site host", async () => {
    expect(await verifyWith({ success: true, hostname: "www.viaabroad.example" })).toBe(true);
  });

  it("rejects a successful verification solved on a foreign host", async () => {
    expect(await verifyWith({ success: true, hostname: "evil.example" })).toBe(false);
  });

  it("rejects a successful verification with no hostname", async () => {
    expect(await verifyWith({ success: true })).toBe(false);
  });
});
