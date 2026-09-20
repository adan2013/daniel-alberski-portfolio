import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects } from "../lib/projects";
import { readFile } from "node:fs/promises";

test.beforeEach(async ({ page }) => {
  await page.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({
      body: "<html><title>Local video test</title></html>",
      contentType: "text/html",
    }),
  );
});

test("metadata follows the plan and each main project has both narratives", async () => {
  expect(projects.map((p) => p.slug)).toEqual([
    "gauge-generator",
    "piguard",
    "palettes",
    "vhs-htpc",
    "smart-home",
    "book-reader",
    "arduino-dashboard",
    "irl-tracker",
    "redark",
  ]);
  expect(projects.filter((p) => p.caseStudy)).toHaveLength(6);
  expect(
    projects
      .filter((p) => p.priority === "secondary")
      .every((p) => !p.caseStudy),
  ).toBe(true);
  expect(projects.map((p) => p.date)).toEqual(
    projects
      .map((p) => p.date)
      .sort()
      .reverse(),
  );
  for (const p of projects.filter((p) => p.caseStudy))
    for (const lang of ["pl", "en"])
      expect(
        (await readFile(`content/${lang}/${p.caseStudy}.md`, "utf8")).length,
      ).toBeGreaterThan(1000);
});

test("four filters preserve chronology, six case studies and three secondary cards", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".project-card")).toHaveCount(9);
  await expect(page.locator(".project-card.main .read-more")).toHaveCount(6);
  await expect(page.locator(".project-card.secondary .read-more")).toHaveCount(
    0,
  );
  for (const [id, slugs] of Object.entries({
    software: projects.map((p) => p.slug),
    hardware: ["piguard", "vhs-htpc", "book-reader", "arduino-dashboard"],
    ai: ["gauge-generator", "piguard", "palettes"],
    "3d": ["piguard", "palettes", "vhs-htpc"],
  })) {
    await page
      .locator(`.track`)
      .nth(["software", "hardware", "ai", "3d"].indexOf(id))
      .click();
    await expect(page).toHaveURL(new RegExp(`track=${id}`));
    await expect(page.locator(".project-card")).toHaveCount(slugs.length);
    expect(
      await page
        .locator(".project-card")
        .evaluateAll((els) => els.map((e) => e.id)),
    ).toEqual(slugs);
  }
  await page.locator(".all-filter").click();
  await expect(page.locator(".project-card")).toHaveCount(9);
});

test("return from case study restores filter and reading position", async ({
  page,
}) => {
  await page.goto("/?track=hardware");
  await expect(page.locator(".project-card")).toHaveCount(4);
  await page.locator("#vhs-htpc .read-more").scrollIntoViewIfNeeded();
  const y = await page.evaluate(() => scrollY);
  await page.locator("#vhs-htpc .read-more").click();
  await expect(page.locator("h1")).toHaveText("VHS HTPC");
  await page.locator(".back-link").first().click();
  await expect(page.locator(".project-card")).toHaveCount(4);
  await expect(page.locator(".track").nth(1)).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(y - 8);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(y + 8);
});

test("next case study preserves the active project filter", async ({
  page,
}) => {
  await page.goto("/?track=hardware");
  await page.locator("#piguard .read-more").click();
  await expect(page.locator(".next-project")).toHaveAttribute(
    "href",
    "/projects/vhs-htpc?track=hardware",
  );
  await page.locator(".next-project").click();
  await page.locator(".back-link").first().click();
  await expect(page).toHaveURL(/track=hardware/);
  await expect(page.locator(".project-card")).toHaveCount(4);
});

test("fixed typography and NR palette", async ({ page }) => {
  for (const route of [
    "/",
    "/en",
    "/projects/piguard",
    "/en/projects/piguard",
  ]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("body")).toHaveCSS(
      "font-family",
      /IBM Plex Sans/,
    );
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(246, 247, 250)",
    );
    await expect(page.locator("body")).toHaveCSS("color", "rgb(20, 36, 59)");
    expect(
      await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue("--accent")
          .trim(),
      ),
    ).toBe("#b32636");
    if (route === "/" || route === "/en") {
      await page.evaluate(() =>
        Promise.all([
          document.fonts.load('400 48px "Bebas Neue"', "ZAŻÓŁĆ GĘŚLĄ JAŹŃ"),
          document.fonts.load('400 18px "IBM Plex Sans"', "Zażółć gęślą jaźń"),
        ]),
      );
      await expect(page.locator(".hero-title")).toHaveCSS(
        "font-family",
        /Bebas Neue/,
      );
      expect(
        await page.evaluate(
          () =>
            document.fonts.check(
              '400 48px "Bebas Neue"',
              "ZAŻÓŁĆ GĘŚLĄ JAŹŃ",
            ) &&
            document.fonts.check(
              '400 18px "IBM Plex Sans"',
              "Zażółć gęślą jaźń",
            ),
        ),
      ).toBe(true);
    }
  }
});

for (const width of [360, 768, 1440])
  test(`responsive layout, fonts and accessibility at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const axe = await new AxeBuilder({ page })
      .exclude("nextjs-portal")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(axe.violations).toEqual([]);
    expect(
      await page
        .locator(".hero-title")
        .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    ).toBe(true);
    for (const p of projects.filter((p) => p.caseStudy)) {
      await page.goto(`/projects/${p.slug}`);
      await expect(page.locator("h1")).toHaveText(p.name);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });

test("scene stops for reduced motion and content works without JavaScript", async ({
  browser,
}) => {
  const reduced = await browser.newContext({ reducedMotion: "reduce" });
  const page = await reduced.newPage();
  await page.goto("/");
  const before = await page
    .locator(".module-grid")
    .evaluate((el) => getComputedStyle(el).transform);
  await page.locator("#about").scrollIntoViewIfNeeded();
  expect(
    await page
      .locator(".module-grid")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe(before);
  await reduced.close();
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await nojs.newPage();
  await staticPage.goto("/");
  await expect(staticPage.locator(".project-card")).toHaveCount(9);
  await expect(
    staticPage
      .locator("#about")
      .getByText(/Najwięcej doświadczenia mam we frontendzie/),
  ).toBeVisible();
  await staticPage.locator("#gauge-generator .read-more").click();
  await expect(staticPage.locator("h1")).toHaveText("Gauge Generator 2.0");
  await nojs.close();
});

test("contact validates and handles success and errors without sending a message", async ({
  page,
}) => {
  await page.route("https://formsubmit.co/**", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: '{"success":false}',
    }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Wyślij wiadomość" }).click();
  expect(
    await page
      .locator("#name")
      .evaluate((el: HTMLInputElement) => el.validity.valueMissing),
  ).toBe(true);
  await page.getByLabel("Imię", { exact: true }).fill("Test");
  await page.getByLabel("E-mail", { exact: true }).fill("test@example.com");
  await page
    .getByLabel("Wiadomość", { exact: true })
    .fill("Local test, intercepted.");
  await page.getByRole("button", { name: "Wyślij wiadomość" }).click();
  await expect(page.locator(".form-status[role=alert]")).toContainText(
    "Nie udało się",
  );
  await page.route("https://formsubmit.co/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"success":"true"}',
    }),
  );
  await page.getByRole("button", { name: "Wyślij wiadomość" }).click();
  await expect(page.locator(".form-status")).toContainText(
    "Wiadomość została wysłana",
  );
});

test("English routes have English document language and complete articles", async ({
  page,
}) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".project-card")).toHaveCount(9);
  await expect(page.locator("#palettes h3")).toHaveText(
    "Eyeshadow palettes · OpenSCAD",
  );
  for (const p of projects.filter((p) => p.caseStudy)) {
    await page.goto(`/en/projects/${p.slug}`);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    expect(await page.locator(".case-body h2").count()).toBeGreaterThanOrEqual(
      4,
    );
  }
});

test("scene progresses through three states; video player loads without activation", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".geometry")).toHaveAttribute("data-phase", "flat");
  const redModules = () =>
    page
      .locator(".face-front")
      .evaluateAll(
        (faces) =>
          faces.filter(
            (face) =>
              getComputedStyle(face).backgroundColor === "rgb(179, 38, 54)",
          ).length,
      );
  await expect.poll(redModules).toBe(1);
  await page.locator(".track").nth(1).click();
  await expect(page.locator(".geometry")).toHaveAttribute(
    "data-track",
    "hardware",
  );
  await expect.poll(redModules).toBe(1);
  const introHeight = await page
    .locator(".intro")
    .evaluate((el) => el.getBoundingClientRect().height);
  await page.evaluate(
    (y) => scrollTo({ top: y, behavior: "instant" }),
    introHeight * 0.35,
  );
  await expect(page.locator(".geometry")).toHaveAttribute("data-phase", "fold");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await expect(page.locator(".geometry")).toHaveAttribute(
    "data-phase",
    "space",
  );
  for (const prefix of ["", "/en"]) {
    const request = page.waitForRequest(
      "https://www.youtube-nocookie.com/embed/KW6sZINNi9Y",
    );
    await page.goto(`${prefix}/projects/arduino-dashboard`);
    await request;
    const player = page.locator(".video iframe");
    await expect(page.locator(".video button")).toHaveCount(0);
    await expect(player).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/KW6sZINNi9Y",
    );
    await expect(player).toHaveAttribute("loading", "eager");
    await expect(player).toHaveAttribute(
      "title",
      prefix
        ? "DIY Arduino Dashboard — The gauges in action during a simulator drive."
        : "DIY Arduino Dashboard — Zegary w działaniu podczas jazdy w symulatorze.",
    );
    for (const width of [360, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const bounds = await player.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.width / bounds!.height).toBeCloseTo(16 / 9, 2);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
});
