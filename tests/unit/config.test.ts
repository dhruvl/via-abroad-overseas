import { describe, it, expect, beforeEach, vi } from "vitest";

async function loadConfig() {
  vi.resetModules();
  return import("@/lib/config");
}

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
