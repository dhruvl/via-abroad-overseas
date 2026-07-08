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

  test("admin API export endpoint is not publicly accessible", async ({ request }) => {
    const response = await request.get("/api/admin/export");
    expect(response.status()).not.toBe(200);
  });
});
