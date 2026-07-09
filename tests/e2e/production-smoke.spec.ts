import { test, expect, request as pwRequest } from "@playwright/test";

/**
 * Production smoke tests. These run ONLY when PROD_URL is set, e.g.:
 *
 *   PROD_URL=https://via-abroad-overseas.vercel.app npx playwright test production-smoke
 *
 * They are intentionally non-destructive: no valid lead is ever created
 * (only invalid/oversized submissions that the server rejects before any
 * database write), and no admin mutation is performed. Safe to run against
 * the live deployment and safe to leave OUT of default CI (which targets
 * localhost) because they self-skip when PROD_URL is absent.
 */
const PROD_URL = process.env.PROD_URL?.replace(/\/$/, "");

test.describe("Production smoke (live deployment)", () => {
  test.skip(!PROD_URL, "Set PROD_URL to run live production smoke tests");

  test("home page is up and sends security headers", async () => {
    const ctx = await pwRequest.newContext();
    const res = await ctx.get(`${PROD_URL}/`);
    expect(res.status()).toBe(200);
    const headers = res.headers();
    expect(headers["content-security-policy"]).toBeTruthy();
    expect(headers["content-security-policy"]).not.toContain("script-src *");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["strict-transport-security"]).toBeTruthy();
    await ctx.dispose();
  });

  test("robots.txt and sitemap.xml resolve", async () => {
    const ctx = await pwRequest.newContext();
    expect((await ctx.get(`${PROD_URL}/robots.txt`)).status()).toBe(200);
    expect((await ctx.get(`${PROD_URL}/sitemap.xml`)).status()).toBe(200);
    await ctx.dispose();
  });

  test("contact API rejects an invalid payload without leaking a stack trace", async () => {
    const ctx = await pwRequest.newContext();
    const res = await ctx.post(`${PROD_URL}/api/enquiries/contact`, {
      data: { fullName: "A" },
    });
    expect(res.status()).toBe(400);
    const body = await res.text();
    expect(body).not.toMatch(/at\s+\S+\s+\(.*:\d+:\d+\)/);
    await ctx.dispose();
  });

  test("contact API rejects an oversized payload with 413", async () => {
    const ctx = await pwRequest.newContext();
    const res = await ctx.post(`${PROD_URL}/api/enquiries/contact`, {
      data: { message: "a".repeat(25_000) },
    });
    expect(res.status()).toBe(413);
    await ctx.dispose();
  });

  test("admin export never serves data to an unauthenticated caller", async () => {
    const ctx = await pwRequest.newContext();
    const res = await ctx.get(`${PROD_URL}/api/admin/export`, { maxRedirects: 0 });
    expect(res.status()).not.toBe(200);
    const body = await res.text().catch(() => "");
    expect(body).not.toContain("Full Name,Phone,Email");
    await ctx.dispose();
  });
});
