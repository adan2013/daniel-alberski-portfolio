import type { Locale } from "@/lib/projects";
import {
  cameraOf,
  cylinder,
  iso,
  pathOf,
  slabOf,
  type SolidPaths,
} from "../anatomy/iso-kit";
import {
  mountedDial,
  scaleAngle,
  scaleCopy,
  scaleProjection,
  scaleWorld,
  WEIGHT_KG,
} from "./model";
import { ScaleAnatomyLive } from "./live";
import "./scale-anatomy.css";

const P = scaleProjection;
const W = scaleWorld;
const project = (x: number, y: number, z: number) => iso([x, y, z], P);
const face = (points: [number, number, number][]) =>
  pathOf(
    points.map(([x, y, z]) => project(x, y, z)),
    true,
  );

function roundedWallPoints(
  y: number,
  left: number,
  right: number,
  bottom: number,
  top: number,
  radius: number,
  steps = 8,
) {
  const corners: [number, number, number, number][] = [
    [right - radius, top - radius, 90, 0],
    [right - radius, bottom + radius, 0, -90],
    [left + radius, bottom + radius, -90, -180],
    [left + radius, top - radius, 180, 90],
  ];
  const points: [number, number, number][] = [];
  for (const [cx, cz, start, end] of corners) {
    for (let step = 0; step <= steps; step++) {
      const angle = ((start + ((end - start) * step) / steps) * Math.PI) / 180;
      points.push([
        cx + radius * Math.cos(angle),
        y,
        cz + radius * Math.sin(angle),
      ]);
    }
  }
  return points;
}

const roundedWall = (...args: Parameters<typeof roundedWallPoints>) =>
  face(roundedWallPoints(...args));

const housingBounds = { left: -115, right: 115, radius: 20 };
const housingWall = (y: number) =>
  roundedWall(
    y,
    housingBounds.left,
    housingBounds.right,
    W.bottom,
    W.top,
    housingBounds.radius,
  );

function housingSurface() {
  const { left, right, radius } = housingBounds;
  const camera = cameraOf(P);
  // The silhouette meets the rounded profile where its normal is perpendicular
  // to the view direction. The rear edge and both shoulders share these points.
  const tangent =
    Math.atan2(camera.sinE, camera.cosA * camera.cosE) + Math.PI / 2;
  const profile: [number, number][] = [];
  const corner = (cx: number, cz: number, start: number, end: number) => {
    const steps = Math.ceil((Math.abs(end - start) * 180) / Math.PI / 3);
    for (let step = 0; step <= steps; step++) {
      const a = start + ((end - start) * step) / steps;
      profile.push([cx + radius * Math.cos(a), cz + radius * Math.sin(a)]);
    }
  };
  corner(left + radius, W.top - radius, tangent, Math.PI / 2);
  corner(right - radius, W.top - radius, Math.PI / 2, 0);
  corner(right - radius, W.bottom + radius, 0, tangent - Math.PI);

  const front = profile.map(([x, z]) => project(x, W.front, z));
  const back = profile.map(([x, z]) => project(x, W.back, z));
  const side = [146, 158, 150];
  const top = [217, 222, 214];
  const bottom = [112, 126, 117];
  return {
    fill: pathOf([...front, ...back.toReversed()], true),
    outline: [
      pathOf(back),
      pathOf([back[0], front[0]]),
      pathOf([back.at(-1)!, front.at(-1)!]),
    ].join(""),
    strips: profile.slice(0, -1).map(([x, z], i) => {
      const [nextX, nextZ] = profile[i + 1];
      const normalZ = (nextX - x) / Math.hypot(nextX - x, nextZ - z);
      const target = normalZ >= 0 ? top : bottom;
      const fill = `rgb(${side
        .map((channel, j) =>
          Math.round(channel + (target[j] - channel) * Math.abs(normalZ)),
        )
        .join(" ")})`;
      return {
        d: pathOf([front[i], front[i + 1], back[i + 1], back[i]], true),
        fill,
      };
    }),
  };
}
const housing = housingSurface();

function Solid({ paths }: { paths: SolidPaths }) {
  return (
    <g className="scale-solid">
      <path className="scale-fill" d={paths.fill} />
      {paths.shades.map((d, i) =>
        d ? <path key={i} className={`scale-shade-${i}`} d={d} /> : null,
      )}
      <path className="scale-top" d={paths.top} />
      <path className="scale-edge" d={paths.outline} />
      <path className="iso-line scale-seam" d={paths.crease} />
      {paths.bevel ? (
        <path className="iso-line scale-seam" d={paths.bevel} />
      ) : null}
    </g>
  );
}

function Screw({ x, y, r = 3 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className="scale-screw">
      <circle r={r} />
      <path d={`M${-r * 0.5} ${r * 0.5}L${r * 0.5} ${-r * 0.5}`} />
    </g>
  );
}

const polar = (radius: number, degrees: number) => {
  const angle = (degrees * Math.PI) / 180;
  return [Math.sin(angle) * radius, -Math.cos(angle) * radius];
};
function arc(radius: number, start: number, end: number) {
  const a = polar(radius, start);
  const b = polar(radius, end);
  return `M${a[0]} ${a[1]}A${radius} ${radius} 0 ${end - start > 180 ? 1 : 0} 1 ${b[0]} ${b[1]}`;
}

const base = (
  <g key="base">
    <ellipse className="scale-shadow" cx="310" cy="483" rx="188" ry="30" />
    {[
      [-120, -68],
      [-120, 68],
      [134, -62],
      [120, 68],
    ].map(([x, y]) => (
      <g key={`${x}-${y}`}>
        <Solid paths={cylinder(x, y, 10, -13, 7, P, 32, 1)} />
        <Solid paths={cylinder(x, y, 8, -6, 6, P, 32, 0.6)} />
      </g>
    ))}
    <Solid
      paths={slabOf(
        { x: -145, y: -85, w: 290, d: 170, r: 18 },
        0,
        14,
        P,
        12,
        1.5,
      )}
    />
    <Solid
      paths={slabOf(
        { x: -137, y: -77, w: 274, d: 154, r: 15 },
        14,
        6,
        P,
        12,
        1,
      )}
    />
  </g>
);

const outerFront = housingWall(W.front);
const cavityFrontPoints = roundedWallPoints(
  W.front,
  -100,
  100,
  36,
  222,
  13,
  32,
);
const cavityBackPoints = roundedWallPoints(-31, -87, 87, 42, 216, 12, 32);
const frontOpening = face(cavityFrontPoints);
const cavityBack = face(cavityBackPoints);
const cavityWalls = cavityFrontPoints.flatMap(([x, y, z], i) => {
  const next = (i + 1) % cavityFrontPoints.length;
  const [nextX, , nextZ] = cavityFrontPoints[next];
  const [backX, backY, backZ] = cavityBackPoints[i];
  const dx = nextX - x;
  const dz = nextZ - z;
  const normalX = -dz * (backY - y);
  const normalY = dz * (backX - x) - dx * (backZ - z);
  const normalZ = dx * (backY - y);
  const camera = cameraOf(P);
  const facing =
    normalX * camera.cosA * camera.cosE +
    normalY * camera.sinA * camera.cosE +
    normalZ * camera.sinE;
  if (facing <= 0) return [];
  const side = [135, 148, 139];
  const target = normalZ >= 0 ? [89, 103, 97] : [170, 180, 172];
  const blend = Math.abs(normalZ) / Math.hypot(normalX, normalZ);
  return [
    {
      d: face([
        cavityFrontPoints[i],
        cavityFrontPoints[next],
        cavityBackPoints[next],
        cavityBackPoints[i],
      ]),
      fill: `rgb(${side.map((channel, j) => Math.round(channel + (target[j] - channel) * blend)).join(" ")})`,
    },
  ];
});

const mechanism = (
  <g key="mechanism">
    <path className="scale-housing-well" d={frontOpening} />
    <path className="scale-housing-well" d={cavityBack} />
    {cavityWalls.map(({ d, fill }, i) => (
      <path key={i} d={d} fill={fill} />
    ))}
    <path className="scale-housing-well-seam" d={cavityBack} />
    {[-45, 45].map((x) => (
      <g key={x}>
        <path
          className="scale-metal-side"
          d={face([
            [x - 3, -26, 61],
            [x + 4, -26, 61],
            [x + 4, -26, 194],
            [x - 3, -26, 194],
          ])}
        />
        {[67, 184].map((z) => {
          const [cx, cy] = project(x, -24, z);
          return (
            <g key={z}>
              <circle className="scale-metal" cx={cx} cy={cy} r="5" />
              <Screw x={cx} y={cy} r={2} />
            </g>
          );
        })}
      </g>
    ))}
    <path
      className="scale-metal"
      d={face([
        [-49, -21, 119],
        [49, -21, 119],
        [49, -21, 127],
        [-49, -21, 127],
      ])}
    />
    {(() => {
      const [cx, cy] = project(0, -18, 123);
      return (
        <g>
          <circle className="scale-metal-side" cx={cx} cy={cy} r="16" />
          <circle className="scale-metal" cx={cx} cy={cy} r="10" />
          <circle className="scale-hub" cx={cx} cy={cy} r="4" />
        </g>
      );
    })()}
    <path
      className="scale-metal"
      d={face([
        [-5, -23, 201],
        [5, -23, 201],
        [5, -23, 217],
        [-5, -23, 217],
      ])}
    />
    {Array.from({ length: 10 }, (_, i) => {
      const [cx, cy] = project(0, -20, 159 + i * 4);
      return (
        <ellipse
          key={i}
          className="scale-spring"
          cx={cx}
          cy={cy}
          rx="10"
          ry="3"
        />
      );
    })}
    <path
      className="scale-metal"
      d={face([
        [-14, -18, 157],
        [14, -18, 157],
        [14, -18, 163],
        [-14, -18, 163],
      ])}
    />
    <g data-housing-surface>
      <path className="scale-housing-surface" d={housing.fill} />
      {housing.strips.map(({ d, fill }, i) => (
        <path key={i} d={d} fill={fill} />
      ))}
      <path className="scale-edge" d={housing.outline} />
    </g>
    <path
      className="scale-housing-front-structure"
      d={`${outerFront}${frontOpening}`}
      fillRule="evenodd"
    />
    <path className="scale-housing-front-seam" d={frontOpening} />
  </g>
);

// Both front halves use this one profile, reflected in world space before
// projection so their shape and thickness match without reversing perspective.
function FrontHalf({ side }: { side: "left" | "right" }) {
  const mirror = side === "left" ? 1 : -1;
  const { left, radius } = housingBounds;
  const arc = (
    cx: number,
    cz: number,
    r: number,
    start: number,
    end: number,
    steps: number,
  ): [number, number][] =>
    Array.from({ length: steps + 1 }, (_, i) => {
      const angle = start + ((end - start) * i) / steps;
      return [mirror * (cx + r * Math.cos(angle)), cz + r * Math.sin(angle)];
    });
  const outside: [number, number][] = [
    [0, W.top],
    ...arc(left + radius, W.top - radius, radius, Math.PI / 2, Math.PI, 12),
    ...arc(
      left + radius,
      W.bottom + radius,
      radius,
      Math.PI,
      Math.PI * 1.5,
      12,
    ),
    [0, W.bottom],
  ];
  const opening = arc(0, W.dial, 75, -Math.PI / 2, -Math.PI * 1.5, 48);
  const profile = [...outside, ...opening];
  const front = profile.map(([x, z]) => project(x, W.panel, z));
  const back = profile.map(([x, z]) => project(x, W.front, z));
  const camera = cameraOf(P);
  const depth: string[] = [];
  const rearEdges: string[] = [];
  const cuts: string[] = [];
  profile.forEach(([x, z], i) => {
    const next = (i + 1) % profile.length;
    const [nextX, nextZ] = profile[next];
    const normalX = mirror * (nextZ - z);
    const normalZ = -mirror * (nextX - x);
    const visible = normalX * camera.cosA * camera.cosE + normalZ * camera.sinE;
    if (visible <= 1e-8) return;
    const d = pathOf([front[i], front[next], back[next], back[i]], true);
    if (Math.abs(x) < 1e-8 && Math.abs(nextX) < 1e-8) {
      cuts.push(d);
    } else {
      depth.push(d);
      rearEdges.push(pathOf([back[i], back[next]]));
    }
  });
  return (
    <g data-shell-half={side}>
      <path className="scale-housing-panel-depth" d={depth.join("")} />
      <path className="scale-housing-seam" d={rearEdges.join("")} />
      <path className="scale-housing-lip" d={pathOf(front, true)} />
      <path
        className="scale-housing-edge"
        d={pathOf(front.slice(0, outside.length))}
      />
      <path
        className="scale-housing-seam"
        d={pathOf(front.slice(outside.length))}
      />
      {cuts.length > 0 ? (
        <g data-shell-cut opacity="0" className="scale-housing-cut-face">
          <path d={cuts.join("")} />
        </g>
      ) : null}
    </g>
  );
}

const shell = (
  <g>
    <FrontHalf side="left" />
    <FrontHalf side="right" />
  </g>
);

const piston = (
  <g key="piston">
    <Solid
      paths={slabOf({ x: -17, y: -17, w: 34, d: 34, r: 4 }, 238, 7, P, 6, 0.8)}
    />
    <Solid
      paths={slabOf({ x: -11, y: -11, w: 22, d: 22, r: 3 }, 245, 49, P, 6, 0.7)}
    />
  </g>
);

const tray = (
  <g key="tray">
    <Solid
      paths={slabOf(
        { x: -143, y: -82, w: 286, d: 164, r: 17 },
        294,
        13,
        P,
        12,
        1.3,
      )}
    />
    <Solid
      paths={slabOf(
        { x: -133, y: -72, w: 266, d: 144, r: 13 },
        307,
        2,
        P,
        12,
        0.8,
      )}
    />
  </g>
);

const weightLabel = project(0, 25, 338);
const weight = (
  <g key="weight" className="scale-weight">
    <Solid paths={cylinder(0, 0, 31, 309, 4, P, 64, 1)} />
    <Solid paths={cylinder(0, 0, 27, 313, 36, P, 64, 2)} />
    <Solid paths={cylinder(0, 0, 25, 349, 3, P, 64, 1)} />
    <Solid paths={cylinder(0, 0, 9, 352, 7, P, 48, 1)} />
    <Solid paths={cylinder(0, 0, 17, 359, 7, P, 64, 2)} />
    <text
      className="scale-weight-label"
      x={weightLabel[0]}
      y={weightLabel[1]}
      textAnchor="middle"
    >
      {WEIGHT_KG} kg
    </text>
  </g>
);

const dial = (
  <g key="dial">
    <circle className="scale-metal-side" cx="5" cy="2" r="126" />
    <circle className="scale-bezel" r="126" />
    <circle className="scale-rim" r="120" />
    <circle className="scale-paper" r="114" />
    <circle className="scale-dial-rule" r="108" />
    <g data-dial-layer="0" opacity="0">
      {Array.from({ length: 101 }, (_, i) => {
        const a = polar(108, scaleAngle(i / 10)),
          b = polar(
            i % 10 === 0 ? 94 : i % 5 === 0 ? 99 : 103,
            scaleAngle(i / 10),
          );
        return (
          <path
            key={i}
            className={
              i % 10 === 0 ? "iso-line scale-tick-major" : "iso-line scale-tick"
            }
            d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`}
          />
        );
      })}
    </g>
    <g data-dial-layer="1" className="scale-numerals" opacity="0">
      {Array.from({ length: 11 }, (_, i) => {
        const p = polar(81, scaleAngle(i));
        return (
          <text
            key={i}
            x={p[0]}
            y={p[1]}
            dominantBaseline="central"
            textAnchor="middle"
          >
            {i}
          </text>
        );
      })}
    </g>
    <g data-dial-layer="3" opacity="0">
      <path
        className="scale-warning"
        d={arc(100, scaleAngle(8), scaleAngle(10))}
      />
    </g>
    <g data-dial-layer="4" className="scale-dial-label" opacity="0">
      <text y="42" textAnchor="middle">
        kg
      </text>
      <text y="52" textAnchor="middle" className="scale-capacity">
        MAX 10 · MIN 0.1
      </text>
    </g>
    <g
      data-dial-layer="5"
      transform="translate(0 62)"
      className="scale-calibration"
      opacity="0"
    >
      <circle r="7" />
      <path d="M-3 0L-1 2L3 -3" />
    </g>
    <g data-dial-layer="2" transform="rotate(0)" opacity="0">
      <path
        className="scale-needle-shadow"
        d="M-3 24L-1 -98L6 24Z"
        transform="translate(2 3)"
      />
      <path className="scale-needle" d="M-4 25L0 -101L4 25Z" />
      <circle className="scale-counterweight" cy="21" r="7" />
    </g>
    <circle className="scale-hub" r="9" />
    <circle className="scale-metal" r="4" />
    <Screw x={-96} y={53} r={2} />
    <Screw x={96} y={53} r={2} />
  </g>
);

// Anchor points sit on the actual final projected artwork, in ascending row order.
const anchors = [
  [280, mountedDial.y - 108],
  [320, mountedDial.y - 82],
  [280, mountedDial.y - 101],
  [180, mountedDial.y + 50],
  [280, mountedDial.y + 52],
  [280, mountedDial.y + 62],
];
export function ScaleAnatomy({ locale }: { locale: Locale }) {
  const copy = scaleCopy[locale];
  const layers = (
    <g key="layers">
      <text className="scale-layer-heading" x="438" y="160">
        {copy.layersTitle}
      </text>
      {copy.layers.map((label, i) => {
        const y = 185 + i * 43,
          [x0, y0] = anchors[i];
        return (
          <g key={label} data-layer-row={i} opacity="0">
            <path
              className="iso-line scale-connector"
              d={`M${x0} ${y0}H${370 + i * 7}V${y}H433`}
            />
            <circle className="scale-terminal" cx={x0} cy={y0} r="3" />
            <circle className="scale-terminal" cx="433" cy={y} r="2" />
            <rect
              className="scale-layer-row"
              x="433"
              y={y - 16}
              width="180"
              height="32"
              rx="4"
            />
            <text className="scale-layer-index" x="443" y={y + 4}>
              {String(i + 1).padStart(2, "0")}
            </text>
            <text className="scale-layer-label" x="466" y={y + 4}>
              {label}
            </text>
          </g>
        );
      })}
    </g>
  );
  return (
    <ScaleAnatomyLive
      locale={locale}
      base={base}
      mechanism={mechanism}
      shell={shell}
      piston={piston}
      tray={tray}
      weight={weight}
      dial={dial}
      layers={layers}
    />
  );
}
