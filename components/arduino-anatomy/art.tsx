import type { Locale } from "@/lib/projects";
import {
  slabOf,
  iso,
  pathOf,
  sideMatrix,
  topMatrix,
  type SolidPaths,
} from "../anatomy/iso-kit";
import { ArduinoLive } from "./live";
import { arduinoProjection as P, arduinoNeedleInk } from "./model";
import "./arduino.css";

const front = (x: number, y: number, z: number) =>
  sideMatrix([x, y], z, P, "left");
const top = (x: number, y: number, z: number) => topMatrix([x, y], z, P);
function Solid({
  paths,
  tone = "metal",
}: {
  paths: SolidPaths;
  tone?: string;
}) {
  return (
    <g className={`ad-solid ad-${tone}`}>
      <path className="ad-fill" d={paths.fill} />
      {paths.shades.map((d, i) =>
        d ? <path key={i} className={`ad-shade-${i}`} d={d} /> : null,
      )}
      <path className="ad-top" d={paths.top} />
      <path className="ad-seam" d={paths.crease} />
      <path className="ad-seam" d={paths.bevel} />
      <path className="ad-edge" d={paths.outline} />
    </g>
  );
}
function Box({
  x,
  y,
  z,
  w,
  d,
  h,
  r = 2,
  tone,
}: {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  r?: number;
  tone?: string;
}) {
  return (
    <Solid paths={slabOf({ x, y, w, d, r }, z, h, P, 5, 0.65)} tone={tone} />
  );
}
function Screw({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className="ad-screw">
      <circle r="2" />
      <path d="M-1.3 0H1.3" />
    </g>
  );
}
const instrumentDrop = 20;
const gauges = [
  { x: -91, z: 107 - instrumentDrop, r: 62, id: "speed" },
  { x: 91, z: 107 - instrumentDrop, r: 62, id: "rpm" },
  { x: -28, z: 164 - instrumentDrop, r: 23, id: "fuel" },
  { x: 28, z: 164 - instrumentDrop, r: 23, id: "air" },
] as const;
function Face({
  r,
  max,
  label,
  small = false,
}: {
  r: number;
  max: number;
  label: string;
  small?: boolean;
}) {
  if (small)
    return (
      <g>
        <path
          d="M-24-4Q-24-29 0-29Q24-29 24-4L17 7H-17Z"
          fill="#3f4e40"
          stroke="#203a2b"
          strokeWidth="1.1"
        />
        <path
          d="M-22-5Q-22-27 0-27Q22-27 22-5"
          fill="none"
          stroke="#7d8c73"
          strokeWidth=".6"
        />
        {Array.from({ length: 9 }, (_, i) => {
          const a = ((-155 + (i * 130) / 8) * Math.PI) / 180;
          return (
            <path
              key={i}
              d={`M${Math.cos(a) * 25} ${Math.sin(a) * 25}L${Math.cos(a) * (i % 4 ? 21 : 18)} ${Math.sin(a) * (i % 4 ? 21 : 18)}`}
              stroke="#d5ddc8"
              strokeWidth={i % 4 ? 0.6 : 1.1}
            />
          );
        })}
        <text y="-10" textAnchor="middle" fontSize="4.5" fill="#c5cfb9">
          {label}
        </text>
        <circle r="2.5" fill="#c5cfb7" />
      </g>
    );
  const divisions = max === 30 ? 6 : max === 260 ? 13 : 7;
  const steps = small ? 8 : divisions * 4;
  return (
    <g>
      <circle r={r} fill="#3f4e40" stroke="#203a2b" strokeWidth="1.1" />
      <circle r={r - 2} fill="none" stroke="#7d8c73" strokeWidth=".6" />
      {Array.from({ length: steps + 1 }, (_, i) => {
        const angle = ((-225 + (i * 270) / steps) * Math.PI) / 180;
        const major = i % 4 === 0;
        const outer = r - 2.2,
          inner = r - (major ? 9 : 5);
        return (
          <path
            key={i}
            d={`M${Math.cos(angle) * outer} ${Math.sin(angle) * outer}L${Math.cos(angle) * inner} ${Math.sin(angle) * inner}`}
            stroke="#d5ddc8"
            strokeWidth={major ? 1.1 : 0.6}
          />
        );
      })}
      {!small &&
        Array.from({ length: divisions + 1 }, (_, i) => {
          const angle = ((-225 + (i * 270) / divisions) * Math.PI) / 180;
          return (
            <text
              key={i}
              x={Math.cos(angle) * (r - 16)}
              y={Math.sin(angle) * (r - 16) + 2.8}
              textAnchor="middle"
              className="ad-scale-number"
              fill="#d9dfcf"
              fontSize={divisions > 10 ? 6 : 8}
            >
              {Math.round((max * i) / divisions)}
            </text>
          );
        })}
      <text
        y={small ? -6 : 38}
        textAnchor="middle"
        fontSize={small ? 4.3 : 4.5}
        fill="#c5cfb9"
      >
        {label}
      </text>
      <circle r="3" fill="#c5cfb7" stroke="#24372c" strokeWidth="1" />
    </g>
  );
}
const shellContour = [
  [-160, 48],
  [-160, 115],
  ...Array.from({ length: 17 }, (_, i): [number, number] => {
    const a = ((180 - (i * 90) / 16) * Math.PI) / 180;
    return [-91 + 69 * Math.cos(a), 115 + 69 * Math.sin(a)];
  }),
  [-68, 184],
  [-60, 198],
  [60, 198],
  [68, 184],
  ...Array.from({ length: 17 }, (_, i): [number, number] => {
    const a = ((90 - (i * 90) / 16) * Math.PI) / 180;
    return [91 + 69 * Math.cos(a), 115 + 69 * Math.sin(a)];
  }),
  [160, 48],
  [152, 42],
  [-152, 42],
].map(([x, z]): [number, number] => [x, z - instrumentDrop]);
const shell = (
  <g key="shell">
    <path
      d={pathOf(
        shellContour.map(([x, z]) => iso([x, -3, z], P)),
        true,
      )}
      fill="#435342"
      stroke="#2b422e"
      strokeWidth=".75"
    />
    {shellContour.map(([x, z], i) => {
      const [nx, nz] = shellContour[(i + 1) % shellContour.length];
      return (
        <path
          key={i}
          d={pathOf(
            [
              [x, -3, z],
              [nx, -3, nz],
              [nx, 32, nz],
              [x, 32, z],
            ].map(([px, py, pz]) => iso([px, py, pz], P)),
            true,
          )}
          fill={nz > z ? "#5d6d55" : "#7b886f"}
          stroke="#50634a"
          strokeWidth=".45"
        />
      );
    })}
    <path
      d={pathOf(
        shellContour.map(([x, z]) => iso([x, 32, z], P)),
        true,
      )}
      fill="#52634f"
      stroke="#2b422e"
      strokeWidth="1"
    />
    <g transform={front(0, 32, 190 - instrumentDrop)}>
      <text x="0" y="95" textAnchor="middle" fill="#bdc8b4" fontSize="6">
        GOLF IV
      </text>
      <rect
        x="-19"
        y="106"
        width="38"
        height="15"
        rx="1"
        fill="#2f4736"
        stroke="#8a9d7c"
      />
      <path d="M-11 114H11" stroke="#90a47f" />
    </g>
  </g>
);
const motors = (
  <g key="motors">
    <g data-ad="carrier" data-ad-pcb="donor">
      <path
        d={pathOf(
          shellContour.map(([x, z]) =>
            iso([x * 0.9, -2, 100 + (z - 100) * 0.9], P),
          ),
          true,
        )}
        fill="#587a53"
        stroke="#3f6340"
        strokeWidth=".8"
      />
      {shellContour.map(([x, z], i) => {
        const [nx, nz] = shellContour[(i + 1) % shellContour.length];
        return (
          <path
            key={i}
            d={pathOf(
              [
                [x * 0.9, -2, 100 + (z - 100) * 0.9],
                [nx * 0.9, -2, 100 + (nz - 100) * 0.9],
                [nx * 0.9, 2, 100 + (nz - 100) * 0.9],
                [x * 0.9, 2, 100 + (z - 100) * 0.9],
              ].map(([px, py, pz]) => iso([px, py, pz], P)),
              true,
            )}
            fill="#92a381"
            stroke="#496947"
            strokeWidth=".4"
          />
        );
      })}
      <path
        d={pathOf(
          shellContour.map(([x, z]) =>
            iso([x * 0.9, 2, 100 + (z - 100) * 0.9], P),
          ),
          true,
        )}
        fill="#829a70"
        stroke="#4c7047"
        strokeWidth=".8"
      />
      <g transform={front(0, 2, 120 - instrumentDrop)}>
        {[-1, 1].flatMap((side) =>
          Array.from({ length: 5 }, (_, i) => {
            const y = 9 + i * 4;
            const targetY = 2 + i * 5;
            const x = side * (68 + i * 3);
            return (
              <g key={`${side}-${i}`}>
                <path
                  d={`M${side * 23} ${y}H${side * (35 + i * 4)}L${side * (45 + i * 4)} ${targetY}H${x}`}
                  fill="none"
                  stroke="#b7bd87"
                  strokeWidth="1.2"
                />
                <circle
                  cx={x}
                  cy={targetY}
                  r="1.8"
                  fill="#d0cda4"
                  stroke="#5d7850"
                  strokeWidth=".5"
                />
                <rect
                  x={side * 23 - 1}
                  y={y - 1}
                  width="2"
                  height="2"
                  fill="#d0cda4"
                />
              </g>
            );
          }),
        )}
        {[-1, 1].flatMap((side) =>
          [0, 1, 2].map((i) => (
            <g key={`${side}-upper-${i}`}>
              <path
                d={`M${side * (8 + i * 5)} 4V${-15 - i * 4}L${side * (28 + i * 3)} ${-33 - i * 4}V-45`}
                fill="none"
                stroke="#b7bd87"
                strokeWidth="1"
              />
              <circle
                cx={side * (28 + i * 3)}
                cy="-45"
                r="1.5"
                fill="#d0cda4"
              />
            </g>
          )),
        )}
        <rect
          x="-22"
          y="4"
          width="44"
          height="27"
          rx="2"
          fill="#3b4c3b"
          stroke="#263e2b"
        />
        {Array.from({ length: 10 }, (_, i) => (
          <g key={i} fill="#c7cbb0">
            <rect x={-19 + i * 4} y="1" width="2" height="4" />
            <rect x={-19 + i * 4} y="30" width="2" height="4" />
          </g>
        ))}
        <circle cx="-17" cy="9" r="1.2" fill="#9db28c" />
        {[-52, 44].flatMap((x) =>
          [37, 48].map((y) => (
            <g key={`${x}-${y}`}>
              <rect
                x={x}
                y={y}
                width="10"
                height="4"
                rx="1"
                fill="#b0bb99"
                stroke="#647e58"
                strokeWidth=".5"
              />
              <rect x={x + 2} y={y} width="6" height="4" fill="#52694b" />
            </g>
          )),
        )}
        <path
          d="M-46 52V61H-18M50 52V61H18"
          fill="none"
          stroke="#b7bd87"
          strokeWidth="1.2"
        />
        <rect
          x="-19"
          y="56"
          width="38"
          height="9"
          rx="1"
          fill="#3d563b"
          stroke="#315130"
        />
        {Array.from({ length: 10 }, (_, i) => (
          <rect
            key={i}
            x={-16 + i * 3.4}
            y="58"
            width="1.4"
            height="5"
            fill="#c6c7a0"
          />
        ))}
        {[-128, 128].flatMap((x) =>
          [-9, 62].map((y) => <Screw key={`${x}-${y}`} x={x} y={y} />),
        )}
      </g>
    </g>
    {gauges.map(({ x, z, r, id }) => (
      <g key={id} data-ad={`motor-${id}`}>
        <Box
          x={x - (r < 30 ? 5 : r * 0.38)}
          y={2}
          z={z - (r < 30 ? 5 : r * 0.38)}
          w={r < 30 ? 10 : r * 0.76}
          d={r < 30 ? 8 : 19}
          h={r < 30 ? 10 : r * 0.76}
          r={4}
        />
        <g transform={front(x, r < 30 ? 11 : 22, z)}>
          <rect
            x={-r * 0.43}
            y="-4"
            width={r * 0.86}
            height="8"
            rx="2"
            fill="#9eac98"
            stroke="#667f62"
          />
          <Screw x={-r * 0.35} y={0} />
          <Screw x={r * 0.35} y={0} />
          <circle r={r * 0.36} fill="#c7d0c1" stroke="#5a7357" />
          <circle r={r * 0.23} fill="#8e9f85" stroke="#617b58" />
          <circle r="3" fill="#354e36" />
          <path
            d={`M${-r * 0.2} ${-r * 0.12}H${r * 0.2}M${-r * 0.2} ${r * 0.12}H${r * 0.2}`}
            stroke="#667c60"
            strokeWidth=".7"
          />
        </g>
      </g>
    ))}
  </g>
);
const oldFaces = (
  <g key="old-faces">
    {gauges.map(({ x, z, r, id }, i) => (
      <g key={id} transform={front(x, 34, z)}>
        <Face
          r={r}
          max={i === 0 ? 70 : 260}
          label={
            i === 0 ? "rpm ×100" : i === 1 ? "km/h" : i === 2 ? "FUEL" : "°C"
          }
          small={i > 1}
        />
      </g>
    ))}
  </g>
);
const newFaces = (
  <g key="new-faces">
    {gauges.map(({ x, z, r, id }, i) => (
      <g
        key={id}
        data-ad-scale={i < 2 ? id : undefined}
        transform={front(x, 40, z)}
      >
        <Face
          r={r}
          max={i === 0 ? 140 : 30}
          label={
            i === 0 ? "km/h" : i === 1 ? "rpm ×100" : i === 2 ? "FUEL" : "AIR"
          }
          small={i > 1}
        />
      </g>
    ))}
  </g>
);
const indicatorAngles = [-210, -175, -125, -90, -55, -5, 30];
// Clockwise arc order: lower left, middle left, upper left, top,
// upper right, middle right, lower right. Matched to the lit reference photo.
const indicatorGlyphs: Record<string, { name: string; d: string }[]> = {
  speed: [
    { name: "engine", d: "M-4-2H-1V-3H2V-2H4V3H-4V1H-5V-1H-4ZM-1-4H2" },
    {
      name: "glow-plugs",
      d: "M-5 2H-3C-1 2-1-3-3-3S-5 2-1 2 1-3-1-3-1 2 2 2 4-3 2-3 2 2 5 2",
    },
    {
      name: "dipped-beam",
      d: "M0-3Q-4-3-4 0Q-4 3 0 3ZM2-2 5-3M2 0 5-1M2 2 5 1M2 4 5 3",
    },
    { name: "high-beam", d: "M0-3Q-4-3-4 0Q-4 3 0 3ZM2-3H5M2-1H5M2 1H5M2 3H5" },
    { name: "fuel", d: "M-3-3H1V3H-3ZM-2-2H0V0H-2ZM1-2H3L4-1V2Q4 3 3 2V0H2" },
    { name: "axle-lock", d: "M-4-3V3M4-3V3M-4 0H4M-1-2H1V2H-1ZM-6-1V1M6-1V1" },
    {
      name: "differential-lock",
      d: "M-4-3V3M4-3V3M-4 0H4M-1.5-1.5 1.5 1.5M1.5-1.5-1.5 1.5",
    },
  ],
  rpm: [
    {
      name: "cruise-control",
      d: "M-4 2A4 4 0 0 1 4 2M-3 2H3M0 1 2-2M-3-1-2.5-.5M0-2V-1",
    },
    {
      name: "engine-brake",
      d: "M-4-3V3M4-3V3M-3-2H3M-3 0H3M-3 2H3M-5-4-6 0-5 4M5-4 6 0 5 4",
    },
    {
      name: "brake-warning",
      d: "M0-3A3 3 0 1 0 0 3A3 3 0 1 0 0-3M-5-2V2M5-2V2M0-1.5V.5M0 1.7V1.9",
    },
    {
      name: "parking-brake",
      d: "M0-4A4 4 0 1 0 0 4A4 4 0 1 0 0-4M-1.2 2V-2H.5Q2-2 2-.5Q2 1 .5 1H-1.2M-6-2V2M6-2V2",
    },
    { name: "battery", d: "M-4-2H3V3H-4ZM-2-3V-2M1-3V-2M-2 0V2M-3 1H-1M1 1H2" },
    {
      name: "oil-pressure",
      d: "M-4-1H1V-3H3V1L1 3H-4ZM-5-2-4-1M4 2Q6 4 4 4Q2 4 4 2",
    },
    {
      name: "abs",
      d: "M0-5A5 5 0 1 0 0 5A5 5 0 1 0 0-5M-3.5 1.5V-1.5H-1.7V1.5M-3.5 0H-1.7M-.8 1.5V-1.5H.2Q1.2-1.5 1.2-.7Q1.2 0 .2 0H-.8M.2 0Q1.2 0 1.2 .8Q1.2 1.5 .2 1.5H-.8M3.7-1.5H2.2V0H3.7V1.5H2.2",
    },
  ],
};
const dialIndicators = (
  <g key="dial-indicators">
    {gauges.slice(0, 2).map(({ x, z, id }) => (
      <g key={id} transform={front(x, 40.2, z)}>
        {indicatorAngles.map((angle, i) => {
          const a = (angle * Math.PI) / 180;
          return (
            <g
              key={i}
              data-ad-indicator={id}
              data-indicator-name={indicatorGlyphs[id][i].name}
              transform={`translate(${Math.cos(a) * 27} ${Math.sin(a) * 27})`}
            >
              <path
                d={indicatorGlyphs[id][i].d}
                fill="none"
                stroke="#667a5f"
                strokeWidth={
                  indicatorGlyphs[id][i].name === "abs" ? 0.55 : 0.85
                }
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>
          );
        })}
        <g data-ad={`indicators-${id}`}>
          {(id === "speed" ? [2, 3, 4] : [2, 4]).map((i) => {
            const a = (indicatorAngles[i] * Math.PI) / 180;
            const name = indicatorGlyphs[id][i].name;
            const light = name === "brake-warning" ? "brake" : name;
            const signal = ["brake", "battery", "high-beam"].includes(light);
            return (
              <path
                key={i}
                data-ad={`light-${light}`}
                data-ad-light={signal ? light : undefined}
                opacity="0"
                transform={`translate(${Math.cos(a) * 27} ${Math.sin(a) * 27})`}
                d={indicatorGlyphs[id][i].d}
                fill="none"
                stroke={
                  light === "high-beam"
                    ? "#62a3ff"
                    : signal
                      ? "#ef675b"
                      : "#d4d5a3"
                }
                strokeWidth=".9"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      </g>
    ))}
    {[-1, 1].map((side) => (
      <g
        key={side}
        data-ad-indicator={side < 0 ? "turn-left" : "turn-right"}
        transform={front(side * 65, 40.2, 180 - instrumentDrop)}
      >
        <g transform={side < 0 ? undefined : "scale(-1 1)"}>
          <path
            d="M-7 0 0-5V-2H7V2H0V5Z"
            fill="#71816a"
            stroke="#344b36"
            strokeWidth=".6"
          />
          <path
            data-ad={side < 0 ? "turn-left-light" : "turn-right-light"}
            opacity="0"
            d="M-7 0 0-5V-2H7V2H0V5Z"
            fill="#d6dfa6"
          />
        </g>
      </g>
    ))}
  </g>
);
const unpoweredNeedleInk = arduinoNeedleInk(0);
const makeNeedles = (kind: "old" | "new") => (
  <g key={`${kind}-needles`}>
    {gauges.map(({ x, z, r, id }) => (
      <g key={id} transform={front(x, kind === "old" ? 35 : 41, z)}>
        <g
          data-ad={`${kind}-needle-${id}`}
          transform={r < 30 ? "rotate(-65)" : "rotate(-135)"}
        >
          <path
            data-ad-needle-body={kind === "new" ? id : undefined}
            data-ad={kind === "new" ? `new-needle-body-${id}` : undefined}
            d={`M-2 8-1.5 ${-r + 9} 0 ${-r + 4} 1.5 ${-r + 9} 2 8Z`}
            fill={unpoweredNeedleInk.body}
            stroke={unpoweredNeedleInk.edge}
            strokeWidth=".55"
          />
          <path
            data-ad={kind === "new" ? `new-needle-highlight-${id}` : undefined}
            d={`M0 6V${-r + 9}`}
            stroke={unpoweredNeedleInk.highlight}
            strokeWidth=".6"
          />
        </g>
        <circle r="5" fill="#344737" stroke="#8c9d80" strokeWidth="1.2" />
      </g>
    ))}
  </g>
);
const housingBack = (
  <g key="housing-back">
    {[-152, 136].flatMap((x) =>
      [-56, 24].map((y) => (
        <Box
          key={`${x}-${y}`}
          x={x}
          y={y}
          z={-8}
          w={16}
          d={14}
          h={8}
          tone="dark"
        />
      )),
    )}
    <g data-ad="lower-base" data-top-z="7">
      <Box x={-166} y={-65} z={0} w={332} d={102} h={7} tone="wood" />
    </g>
    <Box x={-166} y={-65} z={7} w={332} d={6} h={189} tone="wood" />
    <Box x={-166} y={-59} z={7} w={7} d={91} h={189} tone="wood" />
    <g data-ad="floor-mounts" data-mount-base-z="7" data-mount-top-z="13">
      {[-119, -43, 36, 109].flatMap((x) =>
        [-46, -10].map((y) => (
          <Box key={`${x}-${y}`} x={x} y={y} z={7} w={4} d={4} h={6} r={1} />
        )),
      )}
    </g>
    <Box x={159} y={-59} z={7} w={7} d={91} h={189} tone="wood" />
  </g>
);
const electronics = (
  <g key="electronics">
    <Box x={-125} y={-52} z={202} w={88} d={48} h={3} tone="pcb" />
    <Box x={-90} y={-40} z={205} w={29} d={21} h={3} tone="dark" />
    <Box x={-126} y={-41} z={205} w={17} d={15} h={10} />
    <Box x={-125} y={-18} z={205} w={12} d={11} h={9} tone="dark" />
    <Box x={-105} y={-49} z={205} w={61} d={4} h={5} tone="dark" />
    <Box x={-105} y={-10} z={205} w={61} d={4} h={5} tone="dark" />
    <g transform={top(-105, -48, 210)}>
      {Array.from({ length: 14 }, (_, i) => (
        <g key={i} fill="#c3ccb6">
          <rect x={i * 4.2} width="1.6" height="2" />
          <rect x={i * 4.2} y="39" width="1.6" height="2" />
        </g>
      ))}
    </g>
    <Box x={-54} y={-32} z={205} w={8} d={8} h={4} />
    <Box x={30} y={-52} z={202} w={85} d={48} h={3} tone="pcb" />
    <Box x={48} y={-39} z={205} w={44} d={19} h={4} tone="dark" />
    <g transform={top(31, -51, 206)}>
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} fill="#c8d0b9">
          <circle cx={i * 10 + 6} cy="4" r="1.3" />
          <circle cx={i * 10 + 6} cy="40" r="1.3" />
        </g>
      ))}
    </g>
    <g transform={front(-37, -8, 214)}>
      {[0, 2, 4, 6].map((v, i) => (
        <path
          key={v}
          d={`M0 8C12 8 12 ${v} 22 ${v}H45Q67 ${v} 67 8`}
          fill="none"
          stroke={i % 2 ? "#667d58" : "#a2ac8c"}
          strokeWidth="1.4"
        />
      ))}
      <rect x="-3" y="5" width="6" height="6" rx="1" fill="#3e543c" />
      <rect x="64" y="5" width="6" height="6" rx="1" fill="#3e543c" />
    </g>
  </g>
);
const housingFront = (
  <g key="housing-front">
    <Box x={-166} y={31} z={7} w={332} d={6} h={5} tone="wood" />
    <Box x={-166} y={31} z={191} w={332} d={6} h={5} tone="wood" />
    <Box x={-166} y={31} z={12} w={5} d={6} h={179} tone="wood" />
    <Box x={161} y={31} z={12} w={5} d={6} h={179} tone="wood" />
    <g transform={front(-166, 38, 196)}>
      <path
        data-ad="fascia-openings"
        fillRule="evenodd"
        d="M0 0H332V189H0Z M13 109a62 62 0 1 0 124 0a62 62 0 1 0-124 0 M195 109a62 62 0 1 0 124 0a62 62 0 1 0-124 0 M114 48Q114 23 138 23Q162 23 162 48L155 59H121Z M170 48Q170 23 194 23Q218 23 218 48L211 59H177Z M147 80H185V139H147Z"
        fill="#65755b"
        stroke="#435e42"
        strokeWidth=".65"
      />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${i + 1} 189V${i + 1}H331`}
          fill="none"
          stroke={i % 2 ? "#a7ad8e" : "#7f8e70"}
          strokeWidth=".6"
        />
      ))}
      {[9, 323].flatMap((x) =>
        [9, 180].map((y) => <Screw key={`${x}-${y}`} x={x} y={y} />),
      )}
      <g transform="translate(0 -16)" data-ad="lcd-position">
        <rect
          x="145"
          y="94"
          width="42"
          height="63"
          rx="3"
          fill="#283e31"
          stroke="#acb89f"
        />
        <rect x="149" y="98" width="34" height="55" rx="1" fill="#1c3027" />
        <g data-ad="lcd" opacity="0">
          <rect x="149" y="98" width="34" height="55" fill="#c2d1b6" />
          <text
            x="166"
            y="113"
            fontSize="5.5"
            textAnchor="middle"
            fill="#3d5639"
          >
            ETS2
          </text>
          <text
            data-ad="lcd-speed"
            x="166"
            y="130"
            textAnchor="middle"
            fontSize="10"
            fill="#304f35"
          >
            80
          </text>
          <text x="166" y="141" textAnchor="middle" fontSize="4" fill="#435f3e">
            km/h · D12
          </text>
          <path d="M153 147H179" stroke="#6e885e" />
        </g>
      </g>
    </g>
  </g>
);
const lid = (
  <g key="lid">
    <Box x={-166} y={-65} z={196} w={332} d={102} h={7} tone="wood" />
    <g transform={top(-154, -53, 203)}>
      {[0, 296].flatMap((x) =>
        [0, 76].map((y) => <Screw key={`${x}-${y}`} x={x} y={y} />),
      )}
    </g>
  </g>
);
const monitor = (
  <g key="monitor">
    <Box x={44} y={-111} z={182} w={49} d={28} h={5} tone="dark" />
    <Box x={63} y={-105} z={187} w={11} d={10} h={8} />
    <Box
      x={-21.5}
      y={-110}
      z={195}
      w={183}
      d={10}
      h={119.56}
      r={4}
      tone="dark"
    />
    <g transform={front(-15.4, -99, 308.46)}>
      <g transform="scale(1.22)">
        <rect width="140" height="88" rx="1" fill="#b7c5ad" stroke="#819174" />
        <path
          d="M0 43 21 31 45 41 65 27 92 42 117 29 140 40V88H0Z"
          fill="#91a082"
        />
        <path d="M64 43H78L117 88H23Z" fill="#687b60" />
        <path d="M70 49H72L74 58H69ZM68 65H76L81 80H63Z" fill="#d6dcc8" />
        <path d="M1 81Q70 60 139 81V87H1Z" fill="#40583e" />
        <rect x="8" y="7" width="52" height="16" rx="2" fill="#e0e4d5" />
        <text x="34" y="17" textAnchor="middle" fontSize="5" fill="#476343">
          ETS2 · C#/WPF
        </text>
        <rect x="101" y="8" width="29" height="12" rx="2" fill="#d5dfca" />
        <text
          data-ad="pc-speed"
          x="115"
          y="16"
          textAnchor="middle"
          fontSize="5.5"
          fill="#365739"
        >
          80
        </text>
      </g>
    </g>
  </g>
);
export function ArduinoAnatomy({ locale }: { locale: Locale }) {
  return (
    <ArduinoLive
      locale={locale}
      shell={shell}
      motors={motors}
      oldFaces={oldFaces}
      newFaces={newFaces}
      oldNeedles={makeNeedles("old")}
      newNeedles={makeNeedles("new")}
      dialIndicators={dialIndicators}
      housingBack={housingBack}
      electronics={electronics}
      housingFront={housingFront}
      lid={lid}
      monitor={monitor}
    />
  );
}
