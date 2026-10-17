import { expect, test } from "@playwright/test";

for (const [slug, scenes, firstStop] of [
  ["gauge-generator", 9, 0.12],
  ["piguard", 6, 0.23],
  ["vhs-htpc", 7, 0.36],
] as const) {
  test(`${slug}: anatomy starts after the header and uses scene controls`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/projects/${slug}`);

    const story = page.locator(".case-story");
    const animation = story.locator(".case-animation");
    const article = story.locator(".case-body");
    await expect(animation).toBeVisible();
    await expect(article.locator(".case-cover")).toHaveCount(1);
    const positions = await page.evaluate(() => {
      const items = [
        ".case-head",
        ".case-animation",
        ".case-body > p",
        ".case-cover",
        ".case-cover + p",
      ];
      return items.map(
        (selector) =>
          document.querySelector(selector)!.getBoundingClientRect().top +
          scrollY,
      );
    });
    expect(positions[0]).toBeLessThan(positions[1]);
    expect(positions[1]).toBeLessThan(positions[2]);
    expect(positions[2]).toBeLessThan(positions[3]);
    expect(positions[3]).toBeLessThan(positions[4]);
    await expect(page.locator(".case-mobile-switch")).toHaveCount(0);

    const slider = animation.getByRole("slider");
    const previous = animation.getByRole("button", {
      name: "Poprzednia scena",
    });
    const next = animation.getByRole("button", { name: "Następna scena" });
    await expect(slider).toHaveAttribute("max", String(scenes - 1));
    await expect(slider).toHaveAttribute("step", "1");
    await expect(previous).toBeDisabled();
    await expect(animation.locator("[data-readout]")).toHaveCount(0);

    await next.click();
    await expect(slider).toHaveValue("1");
    await expect(previous).toBeEnabled();
    const figure = animation.locator("[data-progress]");
    await expect(figure).toHaveAttribute("data-progress", firstStop.toFixed(3));
    const progress = await figure.getAttribute("data-progress");
    await article.scrollIntoViewIfNeeded();
    await expect(figure).toHaveAttribute("data-progress", progress!);

    await slider.focus();
    await slider.press("End");
    await expect(next).toBeDisabled();
  });
}

test("slider seeks quickly while arrows play the full scene transition", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/projects/gauge-generator");
  const figure = page.locator(".scale-anatomy");
  const slider = figure.getByRole("slider");
  await slider.scrollIntoViewIfNeeded();
  await slider.focus();
  await slider.press("End");
  await expect(slider).toHaveValue("8");
  await expect(figure).toHaveAttribute("data-progress", "1.000", {
    timeout: 700,
  });

  await figure.getByRole("button", { name: "Poprzednia scena" }).click();
  await expect(slider).toHaveValue("7");
  await page.waitForTimeout(300);
  const progress = Number(await figure.getAttribute("data-progress"));
  expect(progress).toBeGreaterThan(0.9);
  expect(progress).toBeLessThan(1);
  await expect(figure).toHaveAttribute("data-progress", "0.900");
});

test("dial layers build before the scale and weight appear", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/gauge-generator");
  const figure = page.locator(".scale-anatomy");
  const slider = figure.getByRole("slider");
  const layer = (index: number) =>
    figure.locator(`[data-dial-layer="${index}"]`);

  await expect(layer(0)).toHaveAttribute("opacity", "0");
  await expect(figure.locator("svg > g").first()).toHaveAttribute(
    "opacity",
    "0",
  );
  await slider.focus();

  for (const [scene, visibleLayer, hiddenLayer] of [
    [1, 0, 1],
    [2, 1, 3],
    [3, 3, 4],
    [4, 4, 2],
    [5, 2, -1],
  ] as const) {
    await slider.press("ArrowRight");
    await expect(slider).toHaveValue(String(scene));
    await expect(layer(visibleLayer)).toHaveAttribute("opacity", "1");
    if (hiddenLayer >= 0)
      await expect(layer(hiddenLayer)).toHaveAttribute("opacity", "0");
  }

  await slider.press("ArrowRight");
  await expect(figure.locator("svg > g").first()).toHaveAttribute(
    "opacity",
    "1",
  );
  await expect(figure.locator(".case-figure-controls")).toHaveCSS(
    "--scene-percent",
    "75%",
  );
  const weight = figure.locator(".scale-weight").locator("..");
  await expect(weight).toHaveAttribute("opacity", "0");
  await slider.press("End");
  await expect(weight).toHaveAttribute("opacity", "1");
  await expect(layer(2)).toHaveAttribute("transform", "rotate(60)");
});

test("scale housing opens as two rigid halves before the dial is installed", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/gauge-generator");
  const figure = page.locator(".scale-anatomy");
  const slider = figure.getByRole("slider");
  await slider.focus();
  for (let scene = 0; scene < 6; scene++) {
    await slider.press("ArrowRight");
  }

  await expect(figure.locator('[data-shell-half="left"]')).toHaveAttribute(
    "transform",
    "translate(-34 0)",
  );
  await expect(figure.locator('[data-shell-half="right"]')).toHaveAttribute(
    "transform",
    "translate(34 0)",
  );
  await expect(figure.locator("[data-shell-cut]")).toHaveCount(1);
  await expect(figure.locator("[data-shell-cut]").first()).toHaveAttribute(
    "opacity",
    "1",
  );

  await slider.press("ArrowRight");
  await expect(figure.locator("[data-shell-half]").first()).toHaveAttribute(
    "transform",
    "translate(0 0)",
  );
  await expect(figure.locator("[data-shell-half]").last()).toHaveAttribute(
    "transform",
    "translate(0 0)",
  );
  await expect(figure.locator("[data-shell-cut]").first()).toHaveAttribute(
    "opacity",
    "0",
  );
});

test("the tray descends with the weight while the piston stays fixed", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/gauge-generator");
  const figure = page.locator(".scale-anatomy");
  const slider = figure.getByRole("slider");
  const tray = figure.locator("[data-scale-tray]");
  const piston = figure.locator("[data-scale-piston]");
  await slider.focus();
  for (let scene = 0; scene < 7; scene++) await slider.press("ArrowRight");
  const pistonBefore = await piston.boundingBox();
  const unloaded = Number(
    (await tray.getAttribute("transform"))?.match(
      /translate\(0 ([\d.-]+)\)/,
    )?.[1],
  );
  await slider.press("ArrowRight");
  const loaded = Number(
    (await tray.getAttribute("transform"))?.match(
      /translate\(0 ([\d.-]+)\)/,
    )?.[1],
  );
  expect(loaded).toBeGreaterThan(unloaded);
  const pistonAfter = await piston.boundingBox();
  expect(pistonAfter!.y).toBeCloseTo(pistonBefore!.y, 3);
  expect(pistonAfter!.height).toBeCloseTo(pistonBefore!.height, 3);
  await expect(figure.locator(".scale-weight").locator("..")).toHaveAttribute(
    "transform",
    `translate(0 ${loaded})`,
  );
});

test("the loaded tray and needle oscillate briefly and settle at two kilograms", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/gauge-generator");
  const figure = page.locator(".scale-anatomy");
  const slider = figure.getByRole("slider");
  await slider.focus();
  await slider.press("End");
  await slider.press("ArrowLeft");
  await expect(figure).toHaveAttribute("data-progress", "0.900");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await figure.getByRole("button", { name: "Następna scena" }).click();

  const frames = await figure.evaluate(async (root) => {
    const needle = root.querySelector<SVGGElement>('[data-dial-layer="2"]')!;
    const tray = root.querySelector<SVGGElement>("[data-scale-tray]")!;
    const piston = root.querySelector<SVGGElement>("[data-scale-piston]")!;
    const weight = root.querySelector<SVGGElement>("g:has(> .scale-weight)")!;
    const frames: {
      angle: number;
      tray: number;
      weight: number;
      piston: number;
    }[] = [];
    const start = performance.now();
    await new Promise<void>((resolve) => {
      function sample(now: number) {
        if (root.dataset.progress === "1.000") {
          frames.push({
            angle: Number(
              needle.getAttribute("transform")!.match(/rotate\(([^)]+)\)/)![1],
            ),
            tray: tray.transform.baseVal.consolidate()!.matrix.f,
            weight: weight.transform.baseVal.consolidate()!.matrix.f,
            piston: piston.getBoundingClientRect().y,
          });
        }
        if (now - start < 3100) requestAnimationFrame(sample);
        else resolve();
      }
      requestAnimationFrame(sample);
    });
    return frames;
  });
  expect(Math.max(...frames.map((frame) => frame.angle))).toBeGreaterThan(61);
  expect(Math.min(...frames.map((frame) => frame.angle))).toBeLessThan(59);
  expect(Math.max(...frames.map((frame) => frame.tray))).toBeGreaterThan(11);
  expect(Math.min(...frames.map((frame) => frame.tray))).toBeLessThan(9.5);
  for (const frame of frames) {
    expect(frame.weight).toBeCloseTo(frame.tray, 1);
    expect(frame.piston).toBeCloseTo(frames[0].piston, 3);
  }
  for (const frame of frames.slice(-10)) {
    expect(frame.angle).toBe(60);
    expect(frame.tray).toBe(10);
  }
});

test("desktop anatomy stays below the header while the page scrolls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/projects/gauge-generator");
  const header = page.locator(".case-head");
  const animation = page.locator(".case-animation");
  const article = page.locator(".case-body");
  const initial = await Promise.all(
    [header, animation, article].map((element) => element.boundingBox()),
  );
  expect(initial[0]!.y + initial[0]!.height).toBeLessThan(initial[1]!.y);
  expect(initial[1]!.y + initial[1]!.height).toBeLessThan(initial[2]!.y);
  await page.evaluate(() => window.scrollBy(0, 500));
  const afterScroll = await animation.boundingBox();
  expect(afterScroll!.y).toBeLessThan(initial[1]!.y - 450);
  await expect(animation.locator("[data-progress]")).toHaveAttribute(
    "data-progress",
    "0.000",
  );
});
