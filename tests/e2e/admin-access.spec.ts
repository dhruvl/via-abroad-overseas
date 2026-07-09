import { test, expect } from "@playwright/test";

test.describe("Admin access control", () => {
  test("unauthenticated visitors never see dashboard content at /admin", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByText("Dashboard Overview")).not.toBeVisible();
    // Either redirected to the login form, or (in environments where
    // Supabase isn't configured yet) shown a clear configuration notice —
    // either way, no enquiry data is ever exposed.
    const loginVisible = await page.getByRole("heading", { name: "Admin Sign In" }).isVisible().catch(() => false);
    const notConfiguredVisible = await page
      .getByText("Admin System Not Yet Configured")
      .isVisible()
      .catch(() => false);
    expect(loginVisible || notConfiguredVisible).toBe(true);
  });

  test("unauthenticated visitors never see enquiry data at /admin/enquiries", async ({ page }) => {
    await page.goto("/admin/enquiries");
    await expect(page.getByText("Total total records", { exact: false })).not.toBeVisible();
  });

  test("admin API export endpoint never serves data to an unauthenticated caller", async ({
    request,
  }) => {
    // Do NOT follow redirects: requireAdmin() redirects unauthenticated
    // callers to /admin/login (a 3xx), and following it would land on a
    // harmless 200 login page and mask the real behavior. We assert on the
    // export endpoint's own response instead.
    const response = await request.get("/api/admin/export", { maxRedirects: 0 });

    // Acceptable outcomes, all of which deny access:
    //   3xx  → redirected to the login page (Supabase configured, no session)
    //   401/403 → explicit auth failure
    //   500  → requireAdmin could not construct a session client (e.g. Supabase
    //           env not configured in this environment) — still no data served
    // The one thing that must NEVER happen is a 200 CSV of enquiry data.
    const status = response.status();
    expect(status).not.toBe(200);
    expect([301, 302, 303, 307, 308, 401, 403, 500]).toContain(status);

    // Defense in depth: whatever the status, the body must not be an
    // enquiry CSV export.
    const body = await response.text().catch(() => "");
    expect(body).not.toContain("Full Name,Phone,Email");
    expect(body.toLowerCase()).not.toContain("text/csv");
  });
});
