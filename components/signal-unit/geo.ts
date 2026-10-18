import {
  cameraOf,
  iso,
  pathOf,
  type Flat,
  type Point3,
  type Projection,
  type SolidPaths,
} from "../anatomy/iso-kit";

// Pure geometry for the signal unit, shared by the server art and the live layer:
// tilted boxes, cylinders on any axis, face matrices and cable curves.

const add = (a: Point3, b: Point3): Point3 => [
  a[0] + b[0],
  a[1] + b[1],
  a[2] + b[2],
];
const scale = (a: Point3, k: number): Point3 => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: Point3, b: Point3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Point3, b: Point3): Point3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const unit = (a: Point3): Point3 => scale(a, 1 / (Math.hypot(...a) || 1));

/** Direction from the scene toward the viewer. */
export function viewOf(P: Projection): Point3 {
  const { sinA, cosA, sinE, cosE } = cameraOf(P);
  return [cosA * cosE, sinA * cosE, sinE];
}

function hull(points: Flat[]): Flat[] {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const turn = (o: Flat, a: Flat, b: Flat) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Flat[] = [];
  for (const p of sorted) {
    while (lower.length > 1 && turn(lower.at(-2)!, lower.at(-1)!, p) <= 0)
      lower.pop();
    lower.push(p);
  }
  const upper: Flat[] = [];
  for (const p of [...sorted].reverse()) {
    while (upper.length > 1 && turn(upper.at(-2)!, upper.at(-1)!, p) <= 0)
      upper.pop();
    upper.push(p);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

/** Shade bucket of a face normal, matching the kit's side light. */
function shadeOf(n: Point3, P: Projection) {
  const { sinA, cosA } = cameraOf(P);
  const h = Math.hypot(n[0], n[1]) || 1;
  const lit = ((n[0] / h) * -sinA + (n[1] / h) * cosA + 1) / 2;
  return Math.min(3, Math.max(0, Math.floor(lit * 4)));
}

/** A box spanned by three edge vectors from one corner, at any tilt. */
export function para(
  o: Point3,
  u: Point3,
  v: Point3,
  w: Point3,
  P: Projection,
): SolidPaths {
  const view = viewOf(P);
  const at = (i: number, j: number, k: number) =>
    add(add(add(o, scale(u, i)), scale(v, j)), scale(w, k));
  const center = at(0.5, 0.5, 0.5);
  const quads: Point3[][] = [
    [at(0, 0, 0), at(1, 0, 0), at(1, 1, 0), at(0, 1, 0)],
    [at(0, 0, 1), at(1, 0, 1), at(1, 1, 1), at(0, 1, 1)],
    [at(0, 0, 0), at(1, 0, 0), at(1, 0, 1), at(0, 0, 1)],
    [at(0, 1, 0), at(1, 1, 0), at(1, 1, 1), at(0, 1, 1)],
    [at(0, 0, 0), at(0, 1, 0), at(0, 1, 1), at(0, 0, 1)],
    [at(1, 0, 0), at(1, 1, 0), at(1, 1, 1), at(1, 0, 1)],
  ];
  const shades: string[][] = [[], [], [], []];
  const tops: string[] = [];
  const visible: Point3[][] = [];
  for (const quad of quads) {
    let n = unit(
      cross(add(quad[1], scale(quad[0], -1)), add(quad[3], scale(quad[0], -1))),
    );
    const mid = scale(quad.reduce(add), 0.25);
    if (dot(n, add(mid, scale(center, -1))) < 0) n = scale(n, -1);
    if (dot(n, view) <= 1e-6) continue;
    visible.push(quad);
    const d = pathOf(
      quad.map((p) => iso(p, P)),
      true,
    );
    if (n[2] > 0.6) tops.push(d);
    else shades[shadeOf(n, P)].push(d);
  }
  // Creases: edges shared by two visible faces.
  const key = (p: Point3) => p.map((c) => c.toFixed(3)).join(",");
  const edges = new Map<string, number>();
  const ends = new Map<string, [Point3, Point3]>();
  for (const quad of visible)
    quad.forEach((p, i) => {
      const q = quad[(i + 1) % 4];
      const k = [key(p), key(q)].sort().join("|");
      edges.set(k, (edges.get(k) ?? 0) + 1);
      ends.set(k, [p, q]);
    });
  const crease = [...edges]
    .filter(([, count]) => count > 1)
    .map(([k]) => pathOf(ends.get(k)!.map((p) => iso(p, P))))
    .join("");
  const corners = quads.flat().map((p) => iso(p, P));
  const outline = pathOf(hull(corners), true);
  return {
    fill: outline,
    outline,
    crease,
    top: tops.join(""),
    shades: shades.map((s) => s.join("")),
  };
}

/** Axis-aligned box from min corner and size, any tilt-free part. */
export const block = ([x, y, z]: Point3, [w, d, h]: Point3, P: Projection) =>
  para([x, y, z], [w, 0, 0], [0, d, 0], [0, 0, h], P);

/** A cylinder whose axis runs along x, y or z, from `from` to `from + length`. */
export function rod(
  center: Point3,
  axis: "x" | "y" | "z" | Point3,
  radius: number,
  length: number,
  P: Projection,
  steps = 28,
): SolidPaths & { cap: string; capAt: number } {
  const view = viewOf(P);
  const ax: Point3 = unit(
    axis === "x"
      ? [1, 0, 0]
      : axis === "y"
        ? [0, 1, 0]
        : axis === "z"
          ? [0, 0, 1]
          : axis,
  );
  const e1: Point3 = unit(
    Math.abs(ax[2]) > 0.9 ? [1, 0, 0] : cross(cross(ax, [0, 0, 1]), ax),
  );
  const e2 = cross(ax, e1);
  const rim = (along: number) =>
    Array.from({ length: steps }, (_, i) => {
      const t = (i / steps) * Math.PI * 2;
      return add(
        add(center, scale(ax, along)),
        add(scale(e1, radius * Math.cos(t)), scale(e2, radius * Math.sin(t))),
      );
    });
  const a = rim(0);
  const b = rim(length);
  const shades: string[][] = [[], [], [], []];
  const tops: string[] = [];
  for (let i = 0; i < steps; i++) {
    const t = ((i + 0.5) / steps) * Math.PI * 2;
    const n = add(scale(e1, Math.cos(t)), scale(e2, Math.sin(t)));
    if (dot(n, view) <= 0) continue;
    const j = (i + 1) % steps;
    const d = pathOf(
      [a[i], a[j], b[j], b[i]].map((p) => iso(p, P)),
      true,
    );
    if (n[2] > 0.75) tops.push(d);
    else shades[shadeOf(n, P)].push(d);
  }
  const capAt = dot(ax, view) > 0 ? length : 0;
  const cap = pathOf(
    (capAt ? b : a).map((p) => iso(p, P)),
    true,
  );
  const outline = pathOf(hull([...a, ...b].map((p) => iso(p, P))), true);
  return {
    fill: outline,
    outline,
    crease: "",
    top: tops.join("") + cap,
    shades: shades.map((s) => s.join("")),
    cap,
    capAt,
  };
}

/** SVG matrix that maps a 2D drawing onto the plane o + a·u + b·v. */
export function planeMatrix(o: Point3, u: Point3, v: Point3, P: Projection) {
  const p0 = iso(o, P);
  const pu = iso(add(o, unit(u)), P);
  const pv = iso(add(o, unit(v)), P);
  const f = (n: number) => Math.round(n * 1000) / 1000;
  return `matrix(${f(pu[0] - p0[0])} ${f(pu[1] - p0[1])} ${f(pv[0] - p0[0])} ${f(pv[1] - p0[1])} ${f(p0[0])} ${f(p0[1])})`;
}

/** Centripetal-free Catmull–Rom through 3D waypoints, sampled evenly. */
export function curve(points: Point3[], per = 10): Point3[] {
  const out: Point3[] = [];
  const at = (i: number) => points[Math.max(0, Math.min(points.length - 1, i))];
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    for (let s = 0; s < per; s++) {
      const t = s / per;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push(
        [0, 1, 2].map(
          (c) =>
            0.5 *
            (2 * p1[c] +
              (-p0[c] + p2[c]) * t +
              (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 +
              (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3),
        ) as Point3,
      );
    }
  }
  out.push(points.at(-1)!);
  return out;
}

export const cablePath = (points: Point3[], P: Projection, per = 10) =>
  pathOf(curve(points, per).map((p) => iso(p, P)));

export { add, scale };
