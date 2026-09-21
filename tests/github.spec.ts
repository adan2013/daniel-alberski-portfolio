import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const api = "https://github-contributions-api.jogruber.de/v4/adan2013?*";
// Fixture data is only served by Playwright, never by the portfolio.
const contributions = Array.from({ length: 365 }, (_, index) => ({
  date: new Date(Date.UTC(2025, 8, 19 + index)).toISOString().slice(0, 10),
  count: index % 7 === 0 ? 5 : 0,
  level: index % 7 === 0 ? 4 : 0,
}));

for (const locale of ["pl", "en"]) {
  for (const width of [360, 768, 1440]) {
    test(`GitHub widget: ${locale}, ${width}px, NR palette and accessibility`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.route(api, (route) =>
        route.fulfill({ json: { total: { lastYear: 265 }, contributions } }),
      );
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(locale === "pl" ? "/" : "/en", {
        waitUntil: "domcontentloaded",
      });
      const graph = page.locator(".graph-content");
      await expect(graph).toContainText(
        locale === "pl"
          ? "Kontrybucje w ostatnim roku: 265"
          : "Contributions in the last year: 265",
      );
      await expect(graph.locator("rect[data-date]")).toHaveCount(365);
      await expect(
        graph.locator("rect[data-date]").first(),
      ).toHaveAccessibleName(
        locale === "pl"
          ? "19 września 2025 — kontrybucje: 5"
          : "19 September 2025 — contributions: 5",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const cell = graph.locator('rect[data-level="4"]').first();
      await expect(cell).toHaveCSS("fill", "rgb(179, 38, 54)");
      if (width === 360) {
        const scroll = graph.getByRole("region");
        await scroll.focus();
        await page.keyboard.press("ArrowRight");
        await expect
          .poll(() => scroll.evaluate((el) => el.scrollLeft))
          .toBeGreaterThan(0);
      }
      expect(
        (await new AxeBuilder({ page }).include(".github-section").analyze())
          .violations,
      ).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}

test("GitHub widget shows localized errors and retains the profile link", async ({
  page,
}) => {
  await page.route(api, (route) =>
    route.fulfill({ status: 503, json: { error: "Unavailable" } }),
  );
  for (const locale of ["pl", "en"]) {
    await page.goto(locale === "pl" ? "/" : "/en");
    const section = page.locator(".github-section");
    await expect(section).toContainText(
      locale === "pl"
        ? "Graf jest chwilowo niedostępny."
        : "The graph is temporarily unavailable.",
    );
    await expect(section.locator("rect[data-date]")).toHaveCount(0);
    await expect(section.getByRole("link")).toHaveAttribute(
      "href",
      "https://github.com/adan2013",
    );
  }
});

test("GitHub profile and explanation remain available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const locale of ["pl", "en"]) {
    await page.goto(locale === "pl" ? "/" : "/en");
    const section = page.locator(".github-section");
    const fallback = section.locator(".github-fallback");
    await expect(fallback).toBeVisible();
    expect(await fallback.textContent()).toContain(
      locale === "pl"
        ? "Moje repozytoria i aktualną aktywność"
        : "Visit my GitHub profile",
    );
    await expect(section.getByRole("link")).toBeVisible();
  }
  await context.close();
});
