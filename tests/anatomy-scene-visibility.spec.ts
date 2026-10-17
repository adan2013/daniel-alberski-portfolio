import { expect, test } from "@playwright/test";

const stories = [
  {
    slug: "piguard",
    attribute: "data-pg",
    stops: [0, 0.23, 0.37, 0.58, 0.9, 1],
    parts: [
      "scene",
      "intruder",
      "sly",
      "fear",
      "sensor-led",
      "alert",
      "outgoing",
      "recipient",
      "incoming",
      "phone-arm",
      "resting-arm",
      "phone-message",
      "message",
      "smile",
      "shock",
    ],
    visible: [
      ["scene"],
      ["scene", "intruder", "sly"],
      ["scene", "intruder", "fear", "sensor-led", "alert"],
      ["scene", "intruder", "fear", "sensor-led", "alert", "outgoing"],
      ["recipient", "phone-arm", "phone-message", "smile"],
      ["recipient", "phone-arm", "phone-message", "message", "shock"],
    ],
  },
  {
    slug: "vhs-htpc",
    attribute: "data-vh",
    stops: [0, 0.36, 0.54, 0.73, 0.82, 0.94, 1],
    parts: [
      "bottom",
      "rim",
      "upper",
      "laptop-screen",
      "motherboard",
      "disk",
      "ports",
      "chassis-back",
      "chassis-front",
      "television",
      "extras",
      "rear-board",
      "lid",
      "tape",
      "clock",
      "power-led",
      "desktop",
    ],
    visible: [
      [
        "bottom",
        "rim",
        "upper",
        "laptop-screen",
        "motherboard",
        "disk",
        "ports",
      ],
      ["motherboard", "disk", "ports"],
      [
        "motherboard",
        "disk",
        "ports",
        "chassis-back",
        "chassis-front",
        "television",
      ],
      [
        "motherboard",
        "disk",
        "ports",
        "chassis-back",
        "chassis-front",
        "television",
        "extras",
        "rear-board",
      ],
      [
        "motherboard",
        "disk",
        "ports",
        "chassis-back",
        "chassis-front",
        "television",
        "extras",
        "rear-board",
        "lid",
      ],
      [
        "motherboard",
        "disk",
        "ports",
        "chassis-back",
        "chassis-front",
        "television",
        "extras",
        "rear-board",
        "lid",
      ],
      [
        "motherboard",
        "disk",
        "ports",
        "chassis-back",
        "chassis-front",
        "television",
        "extras",
        "rear-board",
        "lid",
        "clock",
        "power-led",
        "desktop",
      ],
    ],
  },
];

for (const story of stories) {
  for (const reducedMotion of ["reduce", "no-preference"] as const) {
    test(`${story.slug}: every scene has complete objects (${reducedMotion})`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion });
      await page.goto(`/projects/${story.slug}`);
      const figure = page.locator(".case-animation [data-progress]");
      await figure.scrollIntoViewIfNeeded();

      // Walk the actual arrow controls in both directions, including the final
      // rendered frame: a correct model alone cannot catch stale SVG attributes.
      const order = [
        ...story.stops.map((_, index) => index),
        ...story.stops
          .map((_, index) => index)
          .slice(0, -1)
          .reverse(),
      ];
      let previous = 0;
      for (const scene of order) {
        if (scene !== previous) {
          await figure
            .getByRole("button", {
              name: scene > previous ? "Następna scena" : "Poprzednia scena",
            })
            .click();
        }
        await expect(figure).toHaveAttribute(
          "data-progress",
          story.stops[scene].toFixed(3),
        );
        const actual = await figure.evaluate((root, { attribute, parts }) => {
          return Object.fromEntries(
            parts.map((name) => {
              const part = root.querySelector(`[${attribute}="${name}"]`)!;
              let opacity = 1;
              for (
                let node: Element | null = part;
                node && node !== root;
                node = node.parentElement
              ) {
                opacity *= Number(getComputedStyle(node).opacity);
              }
              return [name, opacity];
            }),
          );
        }, story);
        const expected = Object.fromEntries(
          story.parts.map((name) => [
            name,
            story.visible[scene].includes(name) ? 1 : 0,
          ]),
        );
        expect
          .soft(actual, `${story.slug}, scene ${scene}, from ${previous}`)
          .toEqual(expected);
        previous = scene;
      }
    });
  }
}
