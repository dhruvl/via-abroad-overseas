import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

const originalEnv = {
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  ALLOW_UNVERIFIED_TURNSTILE_IN_DEV: process.env.ALLOW_UNVERIFIED_TURNSTILE_IN_DEV,
};

function configureProduction() {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("VERCEL_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://Example.com/path");
  vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "server-secret");
  vi.stubEnv("ALLOW_UNVERIFIED_TURNSTILE_IN_DEV", "true");
}

function providerResponse(fields: Record<string, unknown>) {
  return new Response(JSON.stringify(fields), { status: 200 });
}

afterEach(() => {
  vi.unstubAllEnvs();
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("verifyTurnstileToken", () => {
  it("accepts success only with the expected hostname and action", async () => {
    configureProduction();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(providerResponse({
      success: true,
      hostname: "example.com",
      action: "contact",
    })));

    await expect(verifyTurnstileToken({ token: "token-1", expectedAction: "contact" })).resolves.toEqual({
      valid: true,
    });
  });

  it("normalizes a naked canonical hostname and permits loopback only outside production", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "Example.com/path");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "server-secret");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(providerResponse({
      success: true,
      hostname: "localhost",
      action: "contact",
    })));

    await expect(verifyTurnstileToken({ token: "token-1", expectedAction: "contact" })).resolves.toEqual({
      valid: true,
    });
  });

  it("rejects a success response from a different hostname", async () => {
    configureProduction();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(providerResponse({
      success: true,
      hostname: "not-example.com",
      action: "contact",
    })));

    await expect(verifyTurnstileToken({ token: "token-1", expectedAction: "contact" })).resolves.toEqual({
      valid: false,
      reason: "hostname_mismatch",
    });
  });

  it("rejects a success response with a different action", async () => {
    configureProduction();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(providerResponse({
      success: true,
      hostname: "example.com",
      action: "consultation",
    })));

    await expect(verifyTurnstileToken({ token: "token-1", expectedAction: "contact" })).resolves.toEqual({
      valid: false,
      reason: "action_mismatch",
    });
  });

  it("rejects provider success=false without exposing provider details", async () => {
    configureProduction();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(providerResponse({
      success: false,
      "error-codes": ["invalid-input-secret"],
    })));

    await expect(verifyTurnstileToken({ token: "token-1", expectedAction: "contact" })).resolves.toEqual({
      valid: false,
      reason: "provider_rejected",
    });
  });

  it("classifies Cloudflare internal errors as provider unavailability", async () => {
    configureProduction();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(providerResponse({
      success: false,
      "error-codes": ["internal-error"],
    })));

    await expect(verifyTurnstileToken({ token: "token-1", expectedAction: "contact" })).resolves.toEqual({
      valid: false,
      reason: "provider_unavailable",
    });
  });

  it("returns a controlled infrastructure failure for provider errors without logging the token", async () => {
    configureProduction();
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("provider detail token-1")));

    await expect(verifyTurnstileToken({ token: "token-1", expectedAction: "contact" })).resolves.toEqual({
      valid: false,
      reason: "provider_unavailable",
    });
    expect(JSON.stringify(log.mock.calls)).not.toContain("token-1");
    expect(JSON.stringify(log.mock.calls)).not.toContain("provider detail");
  });

  it("fails closed if production has no server secret, regardless of the dev bypass", async () => {
    configureProduction();
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(verifyTurnstileToken({ token: "token-1", expectedAction: "contact" })).resolves.toEqual({
      valid: false,
      reason: "configuration_missing",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails closed if production has no canonical hostname configuration", async () => {
    configureProduction();
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(verifyTurnstileToken({ token: "token-1", expectedAction: "contact" })).resolves.toEqual({
      valid: false,
      reason: "configuration_missing",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects localhost as a production canonical hostname", async () => {
    configureProduction();
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(verifyTurnstileToken({ token: "token-1", expectedAction: "contact" })).resolves.toEqual({
      valid: false,
      reason: "configuration_missing",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("allows only explicit non-production bypass and rejects a missing token", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    vi.stubEnv("ALLOW_UNVERIFIED_TURNSTILE_IN_DEV", "true");

    await expect(verifyTurnstileToken({ token: "local-token", expectedAction: "contact" })).resolves.toEqual({
      valid: true,
    });
    await expect(verifyTurnstileToken({ token: "", expectedAction: "contact" })).resolves.toEqual({
      valid: false,
      reason: "missing_token",
    });
  });

  it("does not accept arbitrary Vercel preview hostnames in production", async () => {
    configureProduction();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(providerResponse({
      success: true,
      hostname: "project-preview.vercel.app",
      action: "contact",
    })));

    await expect(verifyTurnstileToken({ token: "token-1", expectedAction: "contact" })).resolves.toMatchObject({
      valid: false,
      reason: "hostname_mismatch",
    });
  });
});
