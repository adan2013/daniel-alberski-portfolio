export type XY = readonly [number, number];

// The plotter camera from the former hero lab, kept so the machine matches it.
export const camera = {
  origin: [350, 335] as [number, number],
  scale: 1.13,
  azimuth: 66,
  elevation: 28,
};

// The former hero-lab plotter rebuilt as a diode laser cutter for the contact form.
// Every typed character asks for one cut; deleting one undoes the latest.
export const sheet = { x: -119, y: -77, w: 238, d: 169, z: 26 };
// The head stays clear of the four clamping blocks at the sheet corners.
export const work = { x0: -104, x1: 104, y0: -52, y1: 78 };
// The nozzle sits in front of the carriage plate, 15.4 ahead of the gantry
// line used by the plotter's pen.
export const nozzleY = 15.4;
// The 14-segment display holds seven characters.
export const displayWidth = 7;
export const park: XY = [0, 8];
// After the last cut the head returns to the machine's origin, rear left.
export const home: XY = [work.x0, work.y0];
export const burnStep = 1.6;
export const eraseRadius = 4.5;
// Units per second at normal speed; a backlog of typed characters speeds up.
export const speeds = { cut: 110, travel: 300, maxBoost: 6 };
// The cutter art is drawn 55 px above the plotter camera origin.
export const artLift = -55;

/** Screen offset of a world-space move. */
export function offset(x: number, y: number, z = 0) {
  return [
    (x * Math.sin(a) - y * Math.cos(a)) * k,
    ((x * Math.cos(a) + y * Math.sin(a)) * Math.sin(e) - z * Math.cos(e)) * k,
  ];
}

const a = (camera.azimuth * Math.PI) / 180;
const e = (camera.elevation * Math.PI) / 180;
const k = camera.scale * Math.sqrt(1.6);

/** Screen point in the art group's coordinates → the point on the sheet. */
export function onSheet(sx: number, sy: number): XY {
  const u = (sx - camera.origin[0]) / k;
  const v = ((sy - camera.origin[1]) / k + sheet.z * Math.cos(e)) / Math.sin(e);
  return [
    u * Math.sin(a) + v * Math.cos(a),
    -u * Math.cos(a) + v * Math.sin(a),
  ];
}

export const clampToWork = ([x, y]: XY): XY => [
  Math.max(work.x0, Math.min(work.x1, x)),
  Math.max(work.y0, Math.min(work.y1, y)),
];
export const insideWork = ([x, y]: XY, margin = 0) =>
  x >= work.x0 - margin &&
  x <= work.x1 + margin &&
  y >= work.y0 - margin &&
  y <= work.y1 + margin;

// A sheet nested like a real job: the parts of a small electronics case with
// finger joints, plus the brackets, handle, clips, gear and knob that finish
// it. Each part cuts its holes first and its outline last, as a laser does.
type Contour = XY[];
type Part = { holes: Contour[]; outline: Contour };

const circle = (cx: number, cy: number, r: number): Contour => {
  const count = Math.max(18, Math.round(r * 5));
  return Array.from({ length: count }, (_, i): XY => {
    const t = (i / count) * Math.PI * 2;
    return [cx + Math.cos(t) * r, cy + Math.sin(t) * r];
  });
};
const roundedRect = (
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): Contour => {
  const points: XY[] = [];
  const corners: [number, number, number][] = [
    [x + w - r, y + r, -Math.PI / 2],
    [x + w - r, y + h - r, 0],
    [x + r, y + h - r, Math.PI / 2],
    [x + r, y + r, Math.PI],
  ];
  for (const [cx, cy, from] of corners)
    for (let i = 0; i <= 6; i++) {
      const t = from + (i / 6) * (Math.PI / 2);
      points.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]);
    }
  return points;
};
const slot = (x: number, y: number, w: number, h: number) =>
  roundedRect(x, y, w, h, Math.min(w, h) / 2);

/** Finger joints notched into each edge; an odd count keeps the corners. */
function fingerPanel(
  x: number,
  y: number,
  w: number,
  h: number,
  across = 5,
  down = 3,
  depth = 3,
): Contour {
  const corners: XY[] = [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];
  const inward: XY[] = [
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 0],
  ];
  const points: XY[] = [];
  corners.forEach((from, side) => {
    const to = corners[(side + 1) % 4];
    const count = side % 2 ? down : across;
    const [nx, ny] = inward[side];
    const at = (i: number): XY => [
      from[0] + ((to[0] - from[0]) * i) / count,
      from[1] + ((to[1] - from[1]) * i) / count,
    ];
    for (let i = 0; i < count; i++) {
      const [sx, sy] = at(i);
      points.push([sx, sy]);
      if (i % 2) {
        const [ex, ey] = at(i + 1);
        points.push([sx + nx * depth, sy + ny * depth]);
        points.push([ex + nx * depth, ey + ny * depth]);
        points.push([ex, ey]);
      }
    }
  });
  return points;
}
const screws = (x: number, y: number, w: number, h: number, inset = 6) =>
  [
    [x + inset, y + inset],
    [x + w - inset, y + inset],
    [x + w - inset, y + h - inset],
    [x + inset, y + h - inset],
  ].map(([cx, cy]) => circle(cx, cy, 1.3));

function bracket(x: number, y: number, size: number, arm: number): Part {
  return {
    holes: [
      circle(x + arm / 2, y + size - arm / 2 - 2, 1.5),
      circle(x + size - arm / 2 - 2, y + arm / 2, 1.5),
    ],
    outline: [
      [x, y],
      [x + size, y],
      [x + size, y + arm],
      [x + arm, y + arm],
      [x + arm, y + size],
      [x, y + size],
    ],
  };
}
function clip(cx: number, top: number): Part {
  const outer = 5,
    inner = 2.4,
    cy = top + 6;
  const arc = (r: number, from: number, to: number): XY[] =>
    Array.from({ length: 13 }, (_, i) => {
      const t = from + ((to - from) * i) / 12;
      return [cx + Math.cos(t) * r, cy + Math.sin(t) * r];
    });
  return {
    holes: [],
    outline: [
      [cx - outer, top],
      ...arc(outer, Math.PI, 0),
      [cx + outer, top],
      [cx + inner, top],
      ...arc(inner, 0, Math.PI),
      [cx - inner, top],
    ],
  };
}
function gear(
  cx: number,
  cy: number,
  teeth: number,
  root: number,
  tip: number,
) {
  const points: XY[] = [];
  for (let i = 0; i < teeth; i++) {
    const t = (i / teeth) * Math.PI * 2,
      step = (Math.PI * 2) / teeth;
    for (const [share, r] of [
      [0, root],
      [0.2, tip],
      [0.5, tip],
      [0.7, root],
    ] as const)
      points.push([
        cx + Math.cos(t + step * share) * r,
        cy + Math.sin(t + step * share) * r,
      ]);
  }
  return { holes: [circle(cx, cy, 2.2)], outline: points } satisfies Part;
}
function knob(cx: number, cy: number, r: number): Part {
  return {
    holes: [circle(cx, cy, 1.8)],
    outline: Array.from({ length: 72 }, (_, i) => {
      const t = (i / 72) * Math.PI * 2;
      const radius = r - 0.9 + 0.9 * Math.cos(t * 12);
      return [cx + Math.cos(t) * radius, cy + Math.sin(t) * radius];
    }),
  };
}

function smiley(cx: number, cy: number, r: number): Part {
  const smile: XY[] = [];
  for (const [radius, from, to] of [
    [r * 0.52, 0.2, 0.8],
    [r * 0.36, 0.8, 0.2],
  ] as const)
    for (let i = 0; i <= 14; i++) {
      const t = Math.PI * (from + ((to - from) * i) / 14);
      smile.push([cx + Math.cos(t) * radius, cy + 0.5 + Math.sin(t) * radius]);
    }
  return {
    holes: [
      circle(cx - r * 0.35, cy - r * 0.35, r * 0.15),
      circle(cx + r * 0.35, cy - r * 0.35, r * 0.15),
      smile,
    ],
    outline: circle(cx, cy, r),
  };
}

const parts: Part[] = [
  // Front panel: display window, two buttons and four screws.
  {
    holes: [
      roundedRect(-92, -42, 34, 13, 2),
      circle(-52, -36, 2.4),
      circle(-52, -25, 2.4),
      ...screws(-103, -50, 64, 40),
    ],
    outline: fingerPanel(-103, -50, 64, 40),
  },
  // Back panel: connector, cable gland and vents.
  {
    holes: [
      roundedRect(-27, -41, 12, 7, 1),
      circle(17, -37, 4.5),
      slot(-27, -27, 30, 3),
      slot(-27, -21, 30, 3),
    ],
    outline: fingerPanel(-35, -50, 64, 40),
  },
  // Lid with a vent grille.
  {
    holes: [0, 1, 2, 3].map((i) => slot(42 + i * 12, -40, 5, 20)),
    outline: fingerPanel(33, -50, 64, 40),
  },
  // Side panels: vents on one, a fan opening on the other.
  {
    holes: [0, 1, 2].map((i) => slot(-94, 7 + i * 8, 26, 3.4)),
    outline: fingerPanel(-103, -2, 44, 38, 5, 5),
  },
  {
    holes: [circle(-33, 17, 9), circle(-45, 5, 1.3), circle(-21, 29, 1.3)],
    outline: fingerPanel(-55, -2, 44, 38, 5, 5),
  },
  // Base with four feet.
  { holes: screws(-7, -2, 64, 38, 7), outline: fingerPanel(-7, -2, 64, 38) },
  bracket(63, -2, 24, 8),
  bracket(63, 26, 24, 8),
  // Carry handle with a grip slot.
  {
    holes: [slot(-92, 47, 48, 6), circle(-98, 50, 1.3), circle(-38, 50, 1.3)],
    outline: slot(-103, 44, 70, 12),
  },
  clip(-94, 63),
  clip(-80, 63),
  clip(-66, 63),
  gear(-12, 60, 14, 11, 14),
  knob(18, 60, 11),
  gear(46, 63, 10, 8, 10.5),
  // The easter egg, cut last in the front-right corner.
  smiley(92, 66, 10),
];

export interface Cut {
  points: XY[];
  /** Cumulative length at each point; the last entry is the full kerf. */
  at: number[];
  length: number;
  /** A hole drops out; an outline frees the part. */
  hole: boolean;
}

function cutOf(contour: Contour, hole: boolean): Cut {
  const points = [...contour, contour[0]];
  const at = [0];
  for (let i = 1; i < points.length; i++)
    at.push(
      at[i - 1] +
        Math.hypot(
          points[i][0] - points[i - 1][0],
          points[i][1] - points[i - 1][1],
        ),
    );
  return { points, at, length: at.at(-1)!, hole };
}

/** The cutting order: one contour per typed character. */
export const plan: readonly Cut[] = parts.flatMap((part) => [
  ...part.holes.map((hole) => cutOf(hole, true)),
  cutOf(part.outline, false),
]);
export const maxCuts = plan.length;

export function pointAt(cut: Cut, share: number): XY {
  const target = Math.max(0, Math.min(1, share)) * cut.length;
  let i = 1;
  while (i < cut.at.length - 1 && cut.at[i] < target) i++;
  const span = cut.at[i] - cut.at[i - 1] || 1;
  const t = (target - cut.at[i - 1]) / span;
  const [x0, y0] = cut.points[i - 1],
    [x1, y1] = cut.points[i];
  return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
}

export const laserCopy = {
  pl: { subtitle: "Laser / formularz" },
  en: { subtitle: "Laser / contact form" },
};
export type LaserMode =
  | "ready"
  | "track"
  | "travel"
  | "cut"
  | "undo"
  | "burn"
  | "erase"
  | "homing"
  | "done"
  | "sent";

// The machine's panel speaks English in every locale.
const messages: Record<LaserMode, string> = {
  ready: "READY",
  track: "MANUAL",
  travel: "WORKING",
  cut: "WORKING",
  undo: "WORKING",
  burn: "BURNING",
  erase: "ERASING",
  homing: "WORKING",
  done: "DONE",
  sent: "SENT",
};

/** Fixed-width panel text; "!" is the segment font's blank cell. */
export function displayText(mode: LaserMode, moving: boolean) {
  const text = mode === "track" && !moving ? "READY" : messages[mode];
  return text.slice(0, displayWidth).padEnd(displayWidth, "!");
}
