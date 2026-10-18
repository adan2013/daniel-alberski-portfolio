import type { Point3 } from "../anatomy/iso-kit";

// The home hero: an open signal unit beside a laptop. Its parts drop into the
// case, cables plug in, the laptop flashes the firmware, the unit boots and
// answers. One progress value drives the whole story; after the story the
// unit stays live (real clock, clickable controls).

// Seen from 38° up so the open case reads.
export const camera = {
  origin: [372, 258] as [number, number],
  scale: 0.98,
  azimuth: 64,
  elevation: 38,
};

/** Bench top (mat surface). */
export const Z0 = 18;

// Case: floor top at 25, walls to 68, fascia 78…86 in y, 20…70 in z.
export const box = {
  x0: -234,
  x1: -12,
  y0: -82,
  y1: 78,
  floor: 25,
  rim: 68,
  wall: 3,
  face: 86,
  faceTop: 70,
  faceBottom: 20,
};
/** Point on the fascia from its top-left corner: u right, v down. */
export const onFace = (u: number, v: number, out = 0): Point3 => [
  box.x0 - 2 + u,
  box.face + out,
  box.faceTop - v,
];
export const fascia = {
  power: { u: 10, v: 10, w: 16, h: 10 },
  lcd: { u: 38, v: 8, w: 84, h: 25 },
  buttons: [42, 61, 80, 99].map((u) => ({ u, v: 38, w: 14, h: 6 })),
  knob: { u: 156, v: 25, r: 15, skirt: 18.5, depth: 13 },
  leds: [12, 20, 28].map((v) => ({ u: 196, v })),
  usb: { u: 208, v: 36, w: 11, h: 10 },
};
// Knob: positions of the eleven ring LEDs, -135°…135° from up.
export const ringAngles = Array.from(
  { length: 11 },
  (_, i) => -135 + (270 * i) / 10,
);

export const laptop = { x0: 30, x1: 180, y0: -40, y1: 60, z0: 19, h: 8 };
export const lidTilt = (15 * Math.PI) / 180;
export const lidHeight = 92;

// Multimeter leaning back on its stand, behind the laptop's lid.
export const meter = {
  x0: 176,
  w: 56,
  backY: -124,
  h: 116,
  t: 24,
  tilt: (17 * Math.PI) / 180,
};
const mc = Math.cos(meter.tilt);
const ms = Math.sin(meter.tilt);
/** Meter body vectors: o back-bottom-left, u across, v up the face, w to front. */
export const meterBody = {
  o: [meter.x0, meter.backY, Z0] as Point3,
  u: [meter.w, 0, 0] as Point3,
  v: [0, -ms * meter.h, mc * meter.h] as Point3,
  w: [0, mc * meter.t, ms * meter.t] as Point3,
};
/** Point on the meter face: a across, b down from its top edge. */
export function onMeter(a: number, b: number, out = 0): Point3 {
  const { o, v, w } = meterBody;
  const k = (meter.h - b) / meter.h;
  const n = 1 + out / meter.t;
  return [o[0] + a, o[1] + v[1] * k + w[1] * n, o[2] + v[2] * k + w[2] * n];
}
export const meterNormal: Point3 = [0, mc, ms];
export const jacks = { com: 28, volt: 44, b: 100 };

// Binding posts on the right wall (red +12 V at the back, black ground).
export const posts = [
  { y: -45, z: 48, tone: "red" as const },
  { y: -60, z: 48, tone: "black" as const },
];
export const postOut = 10;
export const fan = { y: 4, z: 46, r: 17 };

// ——— timeline ———
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => t * t * (3 - 2 * t);
export const step = (p: number, a: number, b: number) => ease(span(p, a, b));

/** Parts fall in from their exploded height, in assembly order. */
export const drops = {
  psu: { lift: 92, from: 0.03, to: 0.12 },
  board: { lift: 104, from: 0.08, to: 0.17 },
  ram: { lift: 70, from: 0.15, to: 0.21 },
  cooler: { lift: 96, from: 0.17, to: 0.23 },
  tuner: { lift: 84, from: 0.2, to: 0.27 },
  drive: { lift: 100, from: 0.23, to: 0.3 },
  amp: { lift: 100, from: 0.26, to: 0.33 },
  harness: { lift: 60, from: 0.34, to: 0.39 },
  ribbon: { lift: 60, from: 0.37, to: 0.42 },
  sata: { lift: 50, from: 0.39, to: 0.44 },
  coax: { lift: 50, from: 0.41, to: 0.46 },
  wires: { lift: 50, from: 0.43, to: 0.48 },
};
export type DropName = keyof typeof drops;

export const phases = [0.34, 0.56, 0.8] as const;

export function assemblyPose(p: number) {
  const fall = Object.fromEntries(
    Object.entries(drops).map(([name, d]) => [
      name,
      // Cables fade in just before they fall; parts are always in view.
      {
        z: d.lift * (1 - step(p, d.from, d.to)),
        o: span(p, d.from - 0.03, d.from + 0.01),
      },
    ]),
  ) as Record<DropName, { z: number; o: number }>;
  const flash = span(p, 0.62, 0.78);
  return {
    fall,
    leads: step(p, 0.47, 0.53),
    usb: step(p, 0.5, 0.56),
    power: p >= 0.585,
    volts: 12.04 * step(p, 0.585, 0.6),
    flash,
    streaming: p > 0.62 && p < 0.78,
    boot: span(p, 0.8, 0.86),
    ring: step(p, 0.82, 0.88),
    knob: step(p, 0.83, 0.88),
    ack: span(p, 0.88, 0.95),
    confirmed: p >= 0.95,
    live: p >= 0.97,
  };
}
export type AssemblyPose = ReturnType<typeof assemblyPose>;

// ——— cables that move ———
/** USB-B plug at the fascia: inserted (t = 1) or resting on the mat. */
export const usbPort = onFace(
  fascia.usb.u + fascia.usb.w / 2,
  fascia.usb.v + fascia.usb.h / 2,
);
export function usbPlugAt(t: number): Point3 {
  // Lift first, then slide in.
  const lift = ease(span(t, 0, 0.45));
  const push = ease(span(t, 0.35, 1));
  return [
    usbPort[0] + 8 * (1 - push),
    usbPort[1] + 24 * (1 - push),
    usbPort[2] - 8.5 * (1 - lift),
  ];
}
export const usbPlugLength = 14;
export const laptopPlug: Point3 = [laptop.x0 - 13, 2, 23];
/** Waypoints of the laptop cable, from the device plug's tail. */
export function usbCable(t: number): Point3[] {
  const plug = usbPlugAt(t);
  const tail: Point3 = [plug[0], plug[1] + usbPlugLength, plug[2]];
  const r = 20.4;
  return [
    tail,
    [tail[0], tail[1] + 6, tail[2] - 1],
    [tail[0] + 4, tail[1] + 15, r + 1.5],
    [tail[0] + 14, tail[1] + 21, r],
    [6, 112, r],
    [-1, 82, r],
    [0, 40, r],
    [6, 12, r],
    [laptopPlug[0] - 9, laptopPlug[1] - 1, r + 0.6],
    [laptopPlug[0] - 2, laptopPlug[1], laptopPlug[2]],
  ];
}

/** Banana plug tip: in the post (t = 1) or lying on the mat. */
export function leadPlugAt(i: number, t: number): Point3 {
  const post = posts[i];
  const lift = ease(span(t, 0, 0.5));
  const push = ease(span(t, 0.4, 1));
  return [
    box.x1 + postOut + 1 + 12 * (1 - push),
    post.y - 10 * (1 - push) - 6 * i * (1 - push),
    post.z - 26.5 * (1 - lift),
  ];
}
export const leadPlugLength = 13;
export function leadCable(i: number, t: number): Point3[] {
  const tip = leadPlugAt(i, t);
  const tail: Point3 = [tip[0] + leadPlugLength, tip[1], tip[2]];
  const jack = onMeter(i === 0 ? jacks.volt : jacks.com, jacks.b, 13);
  const r = Z0 + 1.6;
  // Red runs in front of black; both fall forward off the meter, then left.
  const lane = i === 0 ? -76 : -84;
  return [
    tail,
    [tail[0] + 6, tail[1], tail[2] - 1.5],
    [tail[0] + 10, tail[1] - 2, Math.max(r, tail[2] - 18)],
    [tail[0] + 14, lane + 8, r],
    [60, lane, r],
    [jack[0] - 26, lane, r],
    [jack[0] - 10, lane - 1.5, r],
    [jack[0] - 2, lane - 6, r + 3],
    [jack[0], jack[1] + 5, jack[2] - 6],
    jack,
  ];
}

// ——— static cables inside the case (drawn at their seated place) ———
export const harness: Point3[][] = [0, 1, 2, 3].map((i) => {
  const dy = i * 2.6;
  return [
    [-98, -46 + dy, 36],
    [-102, -46 + dy, 44],
    [-110, -45 + dy, 47],
    [-117, -44 + dy, 41],
    [-117, -44 + dy, 37],
  ];
});
export const coax: Point3[] = [
  [-174, -2, 40],
  [-174, -9, 46],
  [-172, -18, 45],
  [-170, -22, 36],
];
export const sata: Point3[] = [
  [-128, -13, 30],
  [-128, -17, 32],
  [-131, -21, 34.5],
  [-134, -24.5, 34.5],
];
export const wires: Point3[][] = [0, 1].map((i) => [
  [-24 - i * 3, -27, 39],
  [-22 - i * 3, -32, 46],
  [-18 - i * 2, (-32 + posts[1 - i].y) / 2, 50],
  [-15, posts[1 - i].y, posts[1 - i].z],
]);
// The ribbon runs flat across the floor into a low header on the back of
// the front-panel board, so it never folds back on itself.
export const ribbon: Point3[] = [
  [-212, -19, 37],
  [-212, -12, 33],
  [-212, -2, 26],
  [-212, 40, 26],
  [-212, 56, 26.3],
  [-212, 62, 28],
  [-212, 66, 31.5],
];
