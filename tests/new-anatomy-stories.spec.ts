import { expect, test } from "@playwright/test";

// Exercise complete stories through public controls, including reverse seeking.
// This catches stale SVG poses, hydration failures and inaccessible scene stops.
for (const slug of ["smart-home", "arduino-dashboard", "redark"]) {
  for (const locale of ["pl", "en"] as const) {
    test(`${slug}: ${locale} story works on mobile and desktop`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (/hydration|unique.*key|did not match/i.test(message.text()))
          errors.push(message.text());
      });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${locale === "en" ? "/en" : ""}/projects/${slug}`);
      const figure = page.locator(".case-animation [data-progress]");
      const slider = figure.getByRole("slider");
      await expect(figure).toBeVisible();
      await expect(figure.getByRole("img")).toHaveAccessibleName(/.+/);
      await slider.scrollIntoViewIfNeeded();
      const count = Number(await slider.getAttribute("max"));
      expect(count).toBeGreaterThanOrEqual(5);
      const previous = figure.getByRole("button", {
        name: locale === "pl" ? "Poprzednia scena" : "Previous scene",
      });
      const next = figure.getByRole("button", {
        name: locale === "pl" ? "Następna scena" : "Next scene",
      });
      await expect(previous).toBeDisabled();
      const labels = new Set<string>();
      for (let scene = 0; scene <= count; scene++) {
        if (scene) await next.click();
        await expect(slider).toHaveValue(String(scene));
        await expect(figure).toHaveAttribute("data-phase", String(scene));
        const label = await slider.getAttribute("aria-valuetext");
        expect(label).toBeTruthy();
        labels.add(label!);
      }
      expect(labels.size).toBe(count + 1);
      await expect(next).toBeDisabled();
      await expect(figure).toHaveAttribute("data-progress", "1.000");
      for (let scene = count - 1; scene >= 0; scene--) {
        await previous.click();
        await expect(slider).toHaveValue(String(scene));
      }
      await expect(figure).toHaveAttribute("data-progress", "0.000");
      await expect(previous).toBeDisabled();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(390);

      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await slider.scrollIntoViewIfNeeded();
      await slider.focus();
      await slider.press("End");
      await expect(figure).toHaveAttribute("data-progress", "1.000");
      await slider.press("Home");
      await expect(figure).toHaveAttribute("data-progress", "0.000");
      expect(errors).toEqual([]);
    });
  }
}

test("Arduino installs pointers after the faces and seats electronics before closing", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/arduino-dashboard");
  const figure = page.locator(".arduino-anatomy");
  const slider = figure.getByRole("slider");
  await slider.scrollIntoViewIfNeeded();
  await slider.focus();
  await slider.press("ArrowRight");
  await slider.press("ArrowRight");
  await expect(figure.locator('[data-ad="old-needles"]')).toHaveAttribute(
    "opacity",
    "0",
  );
  await expect(figure.locator('[data-ad="new-needles"]')).toHaveAttribute(
    "opacity",
    "0",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await figure.getByRole("button", { name: "Następna scena" }).click();
  const samples = await figure.evaluate(async (root) => {
    const frames: { pointers: number; seated: boolean }[] = [];
    const start = performance.now();
    await new Promise<void>((resolve) => {
      function sample() {
        frames.push({
          pointers: Number(
            root
              .querySelector('[data-ad="new-needles"]')!
              .getAttribute("opacity"),
          ),
          seated:
            root
              .querySelector('[data-ad="new-faces"]')!
              .getAttribute("data-seated") === "true",
        });
        if (performance.now() - start > 1600) resolve();
        else requestAnimationFrame(sample);
      }
      requestAnimationFrame(sample);
    });
    return frames;
  });
  expect(samples.some((frame) => !frame.seated)).toBe(true);
  expect(samples.some((frame) => frame.pointers === 1)).toBe(true);
  expect(samples.every((frame) => frame.pointers === 0 || frame.seated)).toBe(
    true,
  );

  await page.emulateMedia({ reducedMotion: "reduce" });
  await figure.getByRole("button", { name: "Następna scena" }).click();
  const electronics = figure.locator('[data-ad="electronics"]');
  const lid = figure.locator('[data-ad="lid"]');
  await expect(electronics).toHaveAttribute("data-seated", "true");
  await expect(electronics).toHaveAttribute("opacity", "1");
  await expect(lid).toHaveAttribute("opacity", "0");
  const seated = await electronics.getAttribute("transform");
  await figure.getByRole("button", { name: "Następna scena" }).click();
  await expect(lid).toHaveAttribute("data-closed", "true");
  await expect(electronics).toHaveAttribute("transform", seated!);
  await expect(
    figure.locator('[data-ad="donor"], [data-ad="wheel"]'),
  ).toHaveCount(0);
  await expect(figure.locator("[data-ad-indicator]")).toHaveCount(16);
  for (const gauge of ["speed", "rpm"]) {
    await expect(figure.locator(`[data-ad-indicator="${gauge}"]`)).toHaveCount(
      7,
    );
  }
  for (const direction of ["left", "right"]) {
    await expect(
      figure.locator(`[data-ad-indicator="turn-${direction}"]`),
    ).toHaveCount(1);
  }
  const scale = figure
    .locator('[data-ad-scale="speed"] .ad-scale-number')
    .first();
  const ink = () =>
    scale.evaluate((element) =>
      getComputedStyle(element)
        .fill.match(/[\d.]+/g)!
        .slice(0, 3)
        .map(Number),
    );
  const dim = await ink();
  const pointers = figure.locator("[data-ad-needle-body]");
  await expect(pointers).toHaveCount(4);
  const pointerInks = () =>
    pointers.evaluateAll((elements) =>
      elements.map((element) =>
        getComputedStyle(element)
          .fill.match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number),
      ),
    );
  const dimPointers = await pointerInks();
  for (const [red, green, blue] of dimPointers) {
    expect(red).toBeLessThan(110);
    expect(red - green).toBeLessThan(40);
    expect(red).toBeGreaterThan(blue);
  }
  await figure.getByRole("button", { name: "Następna scena" }).click();
  const bright = await ink();
  expect(bright.every((channel, i) => channel > dim[i])).toBe(true);
  const brightPointers = await pointerInks();
  brightPointers.forEach(([red, green], i) => {
    expect(red).toBeGreaterThan(dimPointers[i][0] + 100);
    expect(red).toBeGreaterThan(green * 1.5);
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const needle = figure.locator('[data-ad="new-needle-speed"]');
  const still = await needle.getAttribute("transform");
  await expect(needle).not.toHaveAttribute("transform", still!);
});

test("Arduino warning lamps use distinct colors and only the brake pulses", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/arduino-dashboard");
  const figure = page.locator(".arduino-anatomy");
  const slider = figure.getByRole("slider");
  await slider.scrollIntoViewIfNeeded();
  for (const lamp of ["brake", "battery", "high-beam"]) {
    await expect(figure.locator(`[data-ad-light="${lamp}"]`)).toHaveAttribute(
      "opacity",
      "0",
    );
  }
  await slider.press("End");
  await expect(figure).toHaveAttribute("data-progress", "1.000");
  const colors = await figure.locator("[data-ad-light]").evaluateAll((lights) =>
    Object.fromEntries(
      lights.map((light) => [
        light.getAttribute("data-ad-light"),
        getComputedStyle(light)
          .stroke.match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number),
      ]),
    ),
  );
  for (const lamp of ["brake", "battery"]) {
    expect(colors[lamp][0]).toBeGreaterThan(colors[lamp][1] * 1.4);
    expect(colors[lamp][0]).toBeGreaterThan(colors[lamp][2] * 1.4);
  }
  expect(colors["high-beam"][2]).toBeGreaterThan(colors["high-beam"][0] * 1.4);
  expect(colors["high-beam"][2]).toBeGreaterThan(colors["high-beam"][1]);
  const sample = (duration: number) =>
    figure.evaluate(async (root, ms) => {
      const lights = ["brake", "battery", "high-beam"].map((name) =>
        root.querySelector(`[data-ad-light="${name}"]`)!,
      );
      const frames: number[][] = [];
      const start = performance.now();
      await new Promise<void>((resolve) => {
        function record() {
          frames.push(
            lights.map((light) => Number(getComputedStyle(light).opacity)),
          );
          if (performance.now() - start >= ms) resolve();
          else requestAnimationFrame(record);
        }
        record();
      });
      return [0, 1, 2].map((index) => {
        const values = frames.map((frame) => frame[index]);
        return Math.max(...values) - Math.min(...values);
      });
    }, duration);
  expect(await sample(250)).toEqual([0, 0, 0]);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const motion = await sample(1500);
  expect(motion[0]).toBeGreaterThan(0.3);
  expect(motion[1]).toBe(0);
  expect(motion[2]).toBe(0);
});

test("Smart Home updates clients only after the device confirmation returns", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/smart-home");
  const figure = page.locator(".smart-home-anatomy");
  const next = figure.getByRole("button", { name: "Następna scena" });
  const routeEnds = () =>
    figure.locator("[data-sh-base]").evaluateAll((elements) =>
      elements.map((element) => {
        const path = element as SVGPathElement;
        const start = path.getPointAtLength(0);
        const end = path.getPointAtLength(path.getTotalLength());
        return [start.x, start.y, end.x, end.y];
      }),
    );
  const forwardEnds = await routeEnds();
  const phoneToggleFits = () =>
    figure.evaluate((root) => {
      const box = (name: string) =>
        root.querySelector(`[data-sh="${name}"]`)!.getBoundingClientRect();
      const inside = (inner: DOMRect, outer: DOMRect) =>
        inner.left >= outer.left &&
        inner.right <= outer.right &&
        inner.top >= outer.top &&
        inner.bottom <= outer.bottom;
      return (
        inside(box("phone-knob"), box("phone-toggle-track")) &&
        inside(box("phone-toggle-track"), box("phone-tile"))
      );
    });
  for (let scene = 0; scene <= 7; scene++) {
    if (scene) await next.click();
    await expect(figure).toHaveAttribute(
      "data-direction",
      scene >= 6 ? "reverse" : "forward",
    );
    await expect(figure.locator('[data-sh="return-arrows"]')).toHaveAttribute(
      "opacity",
      scene >= 6 ? "1" : "0",
    );
    await expect(figure.locator("[data-sh-return-arrow]")).toHaveCount(5);
    const ends = await routeEnds();
    ends.forEach((coordinates, index) => {
      const [x1, y1, x2, y2] = forwardEnds[index];
      const expected = scene >= 6 ? [x2, y2, x1, y1] : [x1, y1, x2, y2];
      coordinates.forEach((value, i) =>
        expect(value).toBeCloseTo(expected[i], 1),
      );
    });
    if (scene >= 6) {
      const arrowsAtEndpoints = await figure.evaluate((root) =>
        [...root.querySelectorAll<SVGPathElement>("[data-sh-base]")].every(
          (route) => {
            const arrow = root.querySelector<SVGPathElement>(
              `[data-sh-return-arrow="${route.dataset.shBase}"]`,
            )!;
            const end = route.getPointAtLength(route.getTotalLength());
            const transform = arrow.transform.baseVal.getItem(0).matrix;
            return Math.hypot(transform.e - end.x, transform.f - end.y) < 0.01;
          },
        ),
      );
      expect(arrowsAtEndpoints).toBe(true);
      for (const route of ["ack", "fanout-phone", "fanout-tablet"]) {
        await expect(
          figure.locator(`[data-sh-route="${route}"]`),
        ).toHaveAttribute("marker-end", "none");
      }
      for (const route of ["phone", "backend", "usb", "radio"]) {
        const path = figure.locator(`[data-sh-route="${route}"]`);
        await expect(path).toHaveAttribute("data-active", "false");
        await expect(path).toHaveAttribute("marker-end", "none");
      }
      await expect(figure.locator('[data-sh="wireless"]')).toHaveAttribute(
        "opacity",
        "0",
      );
    }
    await expect(figure.locator('[data-sh="wireless-return"]')).toHaveAttribute(
      "opacity",
      scene === 6 ? "1" : "0",
    );
    await expect(
      figure.locator('[data-sh="socket-connected"]'),
    ).toHaveAttribute("data-state", "on");
    await expect(figure.locator('[data-sh="socket-on"]')).toHaveAttribute(
      "data-state",
      scene >= 5 ? "on" : "off",
    );
    for (const client of ["phone", "tablet"]) {
      await expect(figure.locator(`[data-sh="${client}-text"]`)).toHaveText(
        scene === 7 ? "ON" : "OFF",
      );
    }
    if (scene > 0 && scene < 6)
      await expect(figure.locator('[data-sh="command"]')).toHaveAttribute(
        "opacity",
        "1",
      );
    if (scene === 6)
      await expect(figure.locator('[data-sh="ack"]')).toHaveAttribute(
        "opacity",
        "1",
      );
    if (scene === 0 || scene === 7) expect(await phoneToggleFits()).toBe(true);
  }
  for (const client of ["phone", "tablet"]) {
    await expect(
      figure.locator(`[data-sh="fanout-${client}"]`),
    ).toHaveAttribute("opacity", "1");
  }
  await expect(figure).toHaveAttribute("data-notification", "visible");
  await expect(
    figure.locator('[data-sh="tablet-notification"]'),
  ).toHaveAttribute("opacity", "1");
  for (const side of ["left", "right"]) {
    await expect(
      figure.locator(`[data-sh="tablet-led-${side}"]`),
    ).toHaveAttribute("opacity", "1");
  }
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const fitting = await figure.locator(".sh-packet").evaluateAll((packets) =>
      packets.every((packet) => {
        const box = packet.querySelector("rect")!.getBoundingClientRect();
        const text = packet.querySelector("text")!.getBoundingClientRect();
        return (
          text.left >= box.left &&
          text.right <= box.right &&
          text.top >= box.top &&
          text.bottom <= box.bottom
        );
      }),
    );
    expect(fitting).toBe(true);
    expect(await phoneToggleFits()).toBe(true);
  }
  await figure.getByRole("slider").press("Home");
  await expect(figure).toHaveAttribute("data-notification", "hidden");
  await expect(figure).toHaveAttribute("data-direction", "forward");
  expect(await routeEnds()).toEqual(forwardEnds);
});

test("Smart Home hides every outgoing arrow throughout the animated return", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/smart-home");
  const figure = page.locator(".smart-home-anatomy");
  const next = figure.getByRole("button", { name: "Następna scena" });
  for (let scene = 0; scene < 5; scene++) await next.click();
  await expect(figure).toHaveAttribute("data-progress", "0.700");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await next.click();
  const samples = await figure.evaluate(async (root) => {
    const frames: boolean[] = [];
    const start = performance.now();
    await new Promise<void>((resolve) => {
      function sample() {
        if (root.getAttribute("data-direction") === "reverse") {
          frames.push(
            [...root.querySelectorAll(".sh-command-link")].every((path) => {
              const style = getComputedStyle(path);
              return style.display === "none" && style.markerEnd === "none";
            }),
          );
        }
        if (performance.now() - start < 2900) requestAnimationFrame(sample);
        else resolve();
      }
      sample();
    });
    return frames;
  });
  expect(samples.length).toBeGreaterThan(10);
  expect(samples.every(Boolean)).toBe(true);
  await expect(figure).toHaveAttribute("data-progress", "0.840");
  await expect(figure.locator('[data-sh="ack"]')).toHaveAttribute(
    "opacity",
    "1",
  );
  await figure.getByRole("slider").press("Home");
  await expect(figure).toHaveAttribute("data-direction", "forward");
  await expect(figure.locator(".sh-command-link").first()).not.toHaveCSS(
    "display",
    "none",
  );
});

test("Redark transports and visibly transforms documents before importing them", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/redark");
  const figure = page.locator(".redark-anatomy");
  const next = figure.getByRole("button", { name: "Następna scena" });
  const part = (name: string) => figure.locator(`[data-rd="${name}"]`);
  await expect(part("sheet")).toHaveAttribute("transform", /^translate\(/);
  const initial = await part("sheet").getAttribute("transform");
  await next.click();
  await expect(part("sheet")).not.toHaveAttribute("transform", initial!);
  await expect(part("raw-content")).toHaveAttribute("opacity", "1");
  await next.click();
  await expect(part("error-marks")).toHaveAttribute("opacity", "1");
  await next.click();
  await expect(part("error-marks")).toHaveAttribute("opacity", "0");
  await expect(part("corrected-content")).toHaveAttribute("opacity", "1");
  await next.click();
  await expect(part("mdx-content")).toHaveAttribute("opacity", "1");
  const scanned = await part("sheet").getAttribute("transform");
  await next.click();
  await expect(part("sheet")).not.toHaveAttribute("transform", scanned!);
  await expect(part("sheet")).toHaveAttribute("opacity", "1");
  await next.click();
  await expect(part("sheet")).toHaveAttribute("opacity", "0");
  await expect(part("import-screen")).toHaveAttribute("opacity", "1");
  await next.click();
  await expect(part("website")).toHaveAttribute("opacity", "1");
  await expect(part("import-screen")).toHaveAttribute("opacity", "0");
});
