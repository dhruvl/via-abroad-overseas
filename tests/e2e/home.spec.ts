import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("loads with the primary hero heading and CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Your Gateway to"
    );
    await expect(
      page.getByRole("link", { name: "Book Free Consultation" }).first()
    ).toBeVisible();
  });

  test("has no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/");
    await page.waitForTimeout(1000);
    expect(errors).toEqual([]);
  });

  test("primary navigation links resolve to the right pages", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop nav is only visible above the lg breakpoint");
    await page.goto("/");
    await page.getByLabel("Primary").getByRole("link", { name: "About", exact: true }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("About");
  });
});
