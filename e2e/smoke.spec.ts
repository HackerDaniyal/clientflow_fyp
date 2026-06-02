import { test, expect } from "@playwright/test";

test("landing page renders ClientFlow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("ClientFlow CRM")).toBeVisible();
});
