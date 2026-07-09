import { describe, it, expect, beforeEach, vi } from "vitest";

async function loadConfig() {
  vi.resetModules();
  return import("@/lib/config");
}

describe("siteUrl resolution", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses NEXT_PUBLIC_SITE_URL when set, stripping a trailing slash", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://viaabroadoverseas.com/");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "via-abroad-overseas.vercel.app");
    const { siteUrl } = await loadConfig();
    expect(siteUrl).toBe("https://viaabroadoverseas.com");
  });

  it("falls back to the Vercel production domain (never localhost) when the explicit var is unset", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "via-abroad-overseas.vercel.app");
    const { siteUrl } = await loadConfig();
    expect(siteUrl).toBe("https://via-abroad-overseas.vercel.app");
  });

  it("only uses localhost when neither the explicit nor the Vercel var is present", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    const { siteUrl } = await loadConfig();
    expect(siteUrl).toBe("http://localhost:3000");
  });
});

describe("whatsapp config", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("is not configured when the env var is unset", async () => {
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "");
    const { whatsapp } = await loadConfig();
    expect(whatsapp.isConfigured).toBe(false);
    expect(whatsapp.href()).toBeUndefined();
  });

  it("builds a valid wa.me link once configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "918639996069");
    const { whatsapp } = await loadConfig();
    expect(whatsapp.isConfigured).toBe(true);
    expect(whatsapp.href()).toContain("https://wa.me/918639996069?text=");
  });

  it("strips non-digit characters from a formatted number", async () => {
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "+91 86399 96069");
    const { whatsapp } = await loadConfig();
    expect(whatsapp.number).toBe("918639996069");
  });
});

describe("social link config", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("is not configured when unset", async () => {
    vi.stubEnv("NEXT_PUBLIC_INSTAGRAM_URL", "");
    const { social } = await loadConfig();
    expect(social.instagram.isConfigured).toBe(false);
  });

  it("rejects a non-https URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_INSTAGRAM_URL", "http://instagram.com/example");
    const { social } = await loadConfig();
    expect(social.instagram.isConfigured).toBe(false);
  });

  it("accepts a valid https URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_INSTAGRAM_URL", "https://instagram.com/example");
    const { social } = await loadConfig();
    expect(social.instagram.isConfigured).toBe(true);
    expect(social.instagram.url).toBe("https://instagram.com/example");
  });
});
