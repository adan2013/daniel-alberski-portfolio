import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("production serves the portfolio", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".project-card")).toHaveCount(9);
  await expect(page.locator(".graph-content")).toHaveCount(1);
  await page.goto("/projects/piguard");
  await expect(page.locator("h1")).toHaveText("PiGuard GSM");
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".project-card")).toHaveCount(9);
});
