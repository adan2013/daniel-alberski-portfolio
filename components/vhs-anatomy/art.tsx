import type { Locale } from "@/lib/projects";
import {
  iso,
  pathOf,
  slabOf,
  topMatrix,
  sideMatrix,
  type Projection,
  type SolidPaths,
} from "../anatomy/iso-kit";
import { VhsLive } from "./live";
import { vhsProjection } from "./model";
import "./vhs.css";

// Figure: a retired laptop becomes the working computer inside a familiar VCR.
// Laptop: bottom tray, rim, four mounts, two hinges, display shell/bezel/glass,
// camera, battery glyph, keyboard deck/well/keys, touchpad and latch.
// Salvage: motherboard, CPU socket/chip, heatsink and fins, memory/connector,
// six ICs, solder pads, mounting holes, SSD case/label/connector, I/O PCB/ports.
// VCR: four feet, floor, rear/side/front walls, mounting posts, cassette well,
// slot lips, display glass/segment digits, IR window, power/eject/transport keys,
// control board, RTC, display driver, power module, lid, vents and fasteners.
// Finish: cassette shell, reels/windows, label, grip ribs; TV foot/neck/shell,
// bezel/glass, standby lamp, desktop, taskbar and application window.
const P: Projection = vhsProjection;
const top = (x: number, y: number, z: number) => topMatrix([x, y], z, P);
const front = (x: number, y: number, z: number) =>
  sideMatrix([x, y], z, P, "left");

function Solid({
  paths,
  tone = "metal",
}: {
  paths: SolidPaths;
  tone?: string;
}) {
  return (
    <g className={`vh-solid vh-${tone}`}>
      <path className="vh-fill" d={paths.fill} />
      {paths.shades.map((d, i) =>
        d ? <path key={i} className={`vh-shade-${i}`} d={d} /> : null,
      )}
      <path className="vh-top" d={paths.top} />
      <path className="vh-seam" d={paths.crease} />
      {paths.bevel ? <path className="vh-seam" d={paths.bevel} /> : null}
      <path className="vh-edge" d={paths.outline} />
    </g>
  );
}
function Box({
  x,
  y,
  w,
  d,
  z,
  h,
  r = 1,
  tone,
}: {
  x: number;
  y: number;
  w: number;
  d: number;
  z: number;
  h: number;
  r?: number;
  tone?: string;
}) {
  return (
    <Solid paths={slabOf({ x, y, w, d, r }, z, h, P, 5, 0.5)} tone={tone} />
  );
}
function Screws({ w, h }: { w: number; h: number }) {
  return (
    <g className="vh-screws">
      {[
        [0, 0],
        [w, 0],
        [0, h],
        [w, h],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r="2.5" />
          <path className="iso-line" d="M-1.65 0H1.65" />
        </g>
      ))}
    </g>
  );
}
function Chip({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: Math.floor(h / 3) }, (_, i) => (
        <g key={i} fill="#b8bfaa">
          <rect x="-2" y={1 + i * 3} width="3" height="1.3" />
          <rect x={w - 1} y={1 + i * 3} width="3" height="1.3" />
        </g>
      ))}
      <rect
        width={w}
        height={h}
        rx="1"
        fill="#3b4942"
        stroke="#263830"
        strokeWidth=".6"
      />
      <circle cx="3" cy="3" r=".8" fill="#bdc5ad" />
    </g>
  );
}

const laptopBottom = (
  <g key="bottom">
    <Box x={-142} y={-87} w={284} d={177} z={0} h={7} r={7} />
    <g transform={top(-137, -82, 7)}>
      <rect
        width="274"
        height="167"
        rx="5"
        fill="#bbc3b8"
        stroke="#7b897d"
        strokeWidth=".8"
      />
      <rect
        x="7"
        y="7"
        width="260"
        height="153"
        rx="3"
        fill="none"
        stroke="#929f91"
        strokeWidth=".7"
      />
      <g transform="translate(9 9)">
        <Screws w={256} h={149} />
      </g>
      <rect
        x="95"
        y="128"
        width="84"
        height="22"
        rx="2"
        fill="#a0ad9f"
        stroke="#738575"
        strokeWidth=".8"
      />
    </g>
    <Box x={-142} y={-87} w={284} d={3} z={7} h={15} r={1} />
    <Box x={-142} y={-84} w={3} d={171} z={7} h={15} r={1} />
  </g>
);
const laptopRim = (
  <g key="laptop-rim">
    <Box x={139} y={-84} w={3} d={171} z={7} h={15} r={1} />
    <Box x={-142} y={87} w={284} d={3} z={7} h={15} r={1} />
  </g>
);

const laptopUpper = (
  <g key="upper">
    <Box x={-142} y={-88} w={284} d={6} z={24} h={154} r={4} tone="dark" />
    <g transform={front(-142, -81.9, 178)}>
      <rect x="5" y="5" width="274" height="143" rx="3" className="vh-bezel" />
      <rect x="13" y="14" width="258" height="121" rx="2" fill="#263630" />
      <g data-vh="laptop-screen">
        <rect x="13" y="14" width="258" height="121" rx="2" fill="#d3ddcd" />
        <g
          transform="translate(104 53)"
          fill="none"
          stroke="#af4c40"
          strokeWidth="4"
          strokeLinejoin="round"
        >
          <path d="M31 0H3Q0 0 0 4V40Q0 44 4 44H70Q74 44 74 40V4Q74 0 70 0H44" />
          <path d="M78 14H83V30H78M37-8 28 14 43 24 34 52" />
        </g>
      </g>
      <circle
        cx="142"
        cy="8"
        r="1.5"
        fill="#17251e"
        stroke="#72816e"
        strokeWidth=".7"
      />
      <rect x="134" y="141" width="16" height="1.7" rx=".8" fill="#79887a" />
    </g>
    <Box x={-142} y={-87} w={284} d={177} z={22} h={5} r={7} />
    {[-115, 94].map((x) => (
      <Box key={x} x={x} y={-84} w={21} d={8} z={27} h={5} r={2} tone="dark" />
    ))}
    <g transform={top(-126, -64, 27)}>
      <rect
        width="252"
        height="87"
        rx="4"
        fill="#859486"
        stroke="#627564"
        strokeWidth=".8"
      />
      {Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 15 }, (_, col) =>
          row === 4 && col >= 4 && col <= 9 ? null : (
            <rect
              key={`${row}-${col}`}
              x={4 + col * 16.3}
              y={4 + row * 16}
              width="13.5"
              height="12.5"
              rx="1.5"
              fill="#dce0d5"
              stroke="#647864"
              strokeWidth=".55"
            />
          ),
        ),
      )}
      <rect
        x="69.2"
        y="68"
        width="95"
        height="12.5"
        rx="1.5"
        fill="#dce0d5"
        stroke="#647864"
        strokeWidth=".55"
      />
      <rect
        x="82"
        y="104"
        width="88"
        height="39"
        rx="3"
        fill="#d1d7cb"
        stroke="#8d9d8b"
        strokeWidth=".8"
      />
      <path
        className="iso-line"
        d="M82 133H170"
        fill="none"
        stroke="#8d9d8b"
        strokeWidth=".7"
      />
      <rect x="228" y="109" width="14" height="7" rx="1" fill="#a2b297" />
    </g>
  </g>
);

const motherboard = (
  <g key="motherboard">
    <Box x={-122} y={-66} w={158} d={121} z={12} h={3} r={3} tone="pcb" />
    <g transform={top(-122, -66, 15)}>
      <g transform="translate(5 5)">
        <Screws w={148} h={111} />
      </g>
      <rect
        x="21"
        y="29"
        width="49"
        height="44"
        rx="2"
        fill="#c4cebc"
        stroke="#81967d"
      />
      <rect
        x="28"
        y="35"
        width="34"
        height="31"
        rx="1"
        fill="#728876"
        stroke="#3f5947"
      />
      <Chip x={85} y={15} w={22} h={28} />
      <Chip x={85} y={55} w={28} h={25} />
      {[15, 40, 65, 90].map((y) => (
        <Chip key={y} x={125} y={y} w={14} h={13} />
      ))}
      <rect
        x="20"
        y="91"
        width="88"
        height="16"
        rx="1"
        fill="#405849"
        stroke="#bac6b0"
        strokeWidth=".7"
      />
      {[25, 46, 67, 88].map((x) => (
        <rect key={x} x={x} y="94" width="15" height="10" fill="#263b30" />
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <rect
          key={i}
          x={23 + i * 5}
          y="109"
          width="2"
          height="4"
          fill="#beaf7c"
        />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i} transform={`translate(${15 + i * 8} 15)`}>
          <rect
            width="5"
            height="6"
            rx=".6"
            fill="#b6c8a3"
            stroke="#5d7858"
            strokeWidth=".5"
          />
        </g>
      ))}
    </g>
    <Box x={-100} y={-37} w={48} d={43} z={15} h={8} tone="metal" />
    <g transform={top(-100, -37, 23)}>
      {Array.from({ length: 11 }, (_, i) => (
        <rect
          key={i}
          x={2 + i * 4}
          y="0"
          width="1.5"
          height="43"
          fill="#718578"
        />
      ))}
    </g>
  </g>
);
const disk = (
  <g key="disk">
    <Box x={57} y={-62} w={68} d={85} z={12} h={7} r={3} />
    <g transform={top(57, -62, 19)}>
      <g transform="translate(5 5)">
        <Screws w={58} h={75} />
      </g>
      <rect
        x="12"
        y="16"
        width="44"
        height="45"
        rx="2"
        fill="#e3e6db"
        stroke="#a4af9a"
        strokeWidth=".6"
      />
      <text x="34" y="36" className="vh-label" textAnchor="middle" fontSize="9">
        SSD
      </text>
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          x={19 + i * 3.5}
          y="44"
          width={i % 2 ? 1 : 2}
          height="8"
          fill="#83917c"
        />
      ))}
      <rect x="20" y="80" width="28" height="5" fill="#34483c" />
    </g>
  </g>
);
const ports = (
  <g key="ports">
    <Box x={57} y={39} w={68} d={30} z={12} h={3} r={2} tone="pcb" />
    {[62, 83, 104].map((x) => (
      <g key={x}>
        <Box x={x} y={47} w={16} d={21} z={15} h={8} />
        <g transform={front(x, 68, 22)}>
          <rect x="2" y="1" width="12" height="4.5" rx=".6" fill="#304236" />
          <rect x="4" y="3" width="8" height="1" fill="#afbda1" />
        </g>
      </g>
    ))}
  </g>
);

// Through-cut openings in the rear panel; the inner jambs retain its 4-unit depth.
const rearOpenings = [
  [
    [20, 10],
    [38, 10],
    [38, 19],
    [20, 19],
  ],
  [
    [50, 10],
    [68, 10],
    [68, 19],
    [50, 19],
  ],
  [
    [84, 10],
    [108, 10],
    [108, 16],
    [104, 20],
    [88, 20],
    [84, 16],
  ],
  [
    [122, 10],
    [140, 10],
    [140, 24],
    [122, 24],
  ],
].map((profile) => ({
  // Lower openings align with the boards, leaving 3 units above the floor.
  near: profile.map(([x, y]) => iso([x - 174, -91, 17 - y - 23], P)),
  far: profile.map(([x, y]) => iso([x - 174, -95, 17 - y - 23], P)),
}));

const chassisBack = (
  <g key="chassis-back">
    {[
      [-144, -72],
      [144, -72],
      [-144, 74],
      [144, 74],
    ].map(([x, y], i) => (
      <Box
        key={i}
        x={x - 8}
        y={y - 8}
        w={16}
        d={16}
        z={-47}
        h={9}
        r={3}
        tone="dark"
      />
    ))}
    <Box x={-174} y={-95} w={348} d={190} z={-38} h={5} r={4} />
    <g transform={top(-164, -85, -33)}>
      <rect
        width="328"
        height="170"
        rx="2"
        fill="#a8b3a6"
        stroke="#738974"
        strokeWidth=".8"
      />
      <g transform="translate(7 7)">
        <Screws w={314} h={156} />
      </g>
    </g>
    <g mask="url(#vh-rear-cutouts)">
      <Box x={-174} y={-95} w={348} d={4} z={-33} h={50} tone="dark" />
    </g>
    {rearOpenings.map(({ near, far }, i) => (
      <g key={i}>
        <g clipPath={`url(#vh-rear-port-${i})`}>
          {near.map((point, j) => {
            const next = (j + 1) % near.length;
            return (
              <path
                key={j}
                d={pathOf([point, near[next], far[next], far[j]], true)}
                fill={j === 0 ? "#2b3e2e" : "#87957d"}
              />
            );
          })}
          <path
            d={pathOf(far, true)}
            fill="none"
            stroke="#283d2c"
            strokeWidth=".65"
          />
        </g>
        <path
          d={pathOf(near, true)}
          fill="none"
          stroke="#95a18b"
          strokeWidth=".65"
        />
      </g>
    ))}
    <Box x={-174} y={-91} w={4} d={182} z={-33} h={50} tone="dark" />
    {[
      [-140, -68],
      [-5, -68],
      [-140, 40],
      [-5, 40],
    ].map(([x, y], i) => (
      <Box key={i} x={x} y={y} w={6} d={6} z={-33} h={9} r={1} />
    ))}
    {/* The settled SSD is x=51…119, y=-45…40, with its underside at z=-21. */}
    {[53, 111].flatMap((x) =>
      [-43, 32].map((y) => (
        <Box key={`${x}-${y}`} x={x} y={y} w={6} d={6} z={-33} h={12} r={1} />
      )),
    )}
  </g>
);
const chassisFront = (
  <g key="chassis-front">
    <Box x={170} y={-91} w={4} d={182} z={-33} h={50} tone="dark" />
    <Box x={-174} y={91} w={348} d={5} z={-33} h={50} r={2} tone="dark" />
    <g transform={front(-174, 96.1, 17)}>
      <rect
        x="4"
        y="3"
        width="340"
        height="44"
        rx="1"
        fill="#404f46"
        stroke="#7d8c7a"
        strokeWidth=".5"
      />
      <rect
        x="14"
        y="12"
        width="24"
        height="22"
        rx="2"
        fill="#283a31"
        stroke="#879582"
        strokeWidth=".6"
      />
      <path
        d="M24 17V24M21 19a6 6 0 1 0 8 0"
        fill="none"
        stroke="#d1d9c6"
        strokeWidth="1"
      />
      <circle
        data-vh="power-led"
        cx="26"
        cy="39"
        r="1.5"
        fill="#e33d36"
        opacity="0"
      />
      <rect
        x="48"
        y="9"
        width="174"
        height="23"
        rx="1.5"
        fill="#14251d"
        stroke="#8d9d86"
        strokeWidth=".8"
      />
      <rect x="50" y="11" width="170" height="3" rx=".7" fill="#637362" />
      <rect x="50" y="28" width="170" height="2" rx=".7" fill="#7d8b74" />
      <rect
        x="238"
        y="8"
        width="80"
        height="23"
        rx="2"
        fill="#172b23"
        stroke="#6a7c64"
        strokeWidth=".8"
      />
      <g clipPath="url(#vh-clock-clip)">
        <text
          className="vh-clock"
          x="278"
          y="27"
          textAnchor="middle"
          fill="#6c816b"
          opacity=".19"
        >
          88:88
        </text>
        <text
          data-vh="clock"
          className="vh-clock"
          x="278"
          y="27"
          textAnchor="middle"
          fill="#d9edbd"
          opacity="0"
        >
          <tspan data-vh="clock-hours">20</tspan>
          <tspan data-vh="clock-colon">:</tspan>
          <tspan data-vh="clock-minutes">15</tspan>
        </text>
      </g>
      <rect x="324" y="13" width="11" height="11" rx="2" fill="#17281f" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${242 + i * 15} 37)`}>
          <rect
            width="11"
            height="5"
            rx="1"
            fill="#87917f"
            stroke="#1e3427"
            strokeWidth=".65"
          />
        </g>
      ))}
      <rect x="205" y="37" width="16" height="5" rx="1" fill="#82907c" />
      <text
        x="52"
        y="43"
        className="vh-label vh-brand"
        fontSize="5.8"
        letterSpacing="1.3"
        fill="#c6cfbb"
      >
        VHS · Hi-Fi
      </text>
    </g>
  </g>
);

const rearBoard = (
  <g key="rear-board">
    {/* Spacers bridge the rear wall's inner face to the upright PCB. */}
    {[24, 116].flatMap((x) =>
      [-21, 0].map((z) => (
        <Box key={`${x}-${z}`} x={x} y={-91} w={4} d={3} z={z} h={4} />
      )),
    )}
    <Box x={20} y={-88} w={104} d={3} z={-24} h={31} r={1} tone="pcb" />
    <g transform={front(20, -85, 7)}>
      <Chip x={6} y={7} w={24} h={17} />
      <Chip x={38} y={7} w={20} h={17} />
      <rect
        x="68"
        y="5"
        width="28"
        height="21"
        rx="2"
        fill="#a2b19b"
        stroke="#4d6a53"
      />
      <g transform="translate(6 5)">
        <Screws w={92} h={21} />
      </g>
    </g>
  </g>
);
const extras = (
  <g key="extras">
    <Box x={-124} y={-87} w={96} d={16} z={-24} h={3} r={2} tone="pcb" />
    <Box x={-117} y={-85} w={27} d={12} z={-21} h={9} r={1} />
    <Box x={-80} y={-85} w={22} d={12} z={-21} h={7} r={1} tone="dark" />
    <Box x={-49} y={-85} w={14} d={12} z={-21} h={5} r={1} />
    <Box x={-130} y={58} w={106} d={29} z={-24} h={3} r={2} tone="pcb" />
    <g transform={top(-130, 58, -21)}>
      <Chip x={8} y={7} w={28} h={18} />
      <Chip x={47} y={8} w={16} h={16} />
      <Chip x={78} y={8} w={18} h={16} />
      <rect x="8" y="27" width="88" height="3" fill="#b2b58b" />
    </g>
  </g>
);
const lid = (
  <g key="lid">
    <Box x={-174} y={-95} w={348} d={191} z={17} h={4} r={3} tone="dark" />
    <g transform={top(-174, -95, 21)}>
      <rect
        x="4"
        y="4"
        width="340"
        height="183"
        rx="2"
        fill="none"
        stroke="#889582"
        strokeWidth=".5"
      />
      {[14, 315].map((x) => (
        <g key={x}>
          {Array.from({ length: 15 }, (_, i) => (
            <rect
              key={i}
              x={x}
              y={23 + i * 8}
              width="18"
              height="2.5"
              rx="1"
              fill="#1e3227"
              stroke="#6c7d66"
              strokeWidth=".35"
            />
          ))}
        </g>
      ))}
      <g transform="translate(9 9)">
        <Screws w={330} h={173} />
      </g>
    </g>
  </g>
);

// A real slot clips the tape at its front plane; it never fades through the fascia.
const tape = (
  <g key="tape">
    <Box x={-123} y={105} w={165} d={91} z={-10} h={12} r={3} tone="dark" />
    <g transform={top(-123, 105, 2)}>
      <rect
        x="5"
        y="4"
        width="155"
        height="83"
        rx="3"
        fill="none"
        stroke="#85917d"
        strokeWidth=".6"
      />
      <rect
        x="12"
        y="11"
        width="141"
        height="38"
        rx="2"
        fill="#a9b5a0"
        stroke="#253b2b"
      />
      {[39, 126].map((x) => (
        <g key={x}>
          <circle cx={x} cy="30" r="16" fill="#485c4a" stroke="#24392b" />
          <circle cx={x} cy="30" r="8" fill="#d0d5bd" stroke="#8a997c" />
          <circle cx={x} cy="30" r="3" fill="#65775d" />
        </g>
      ))}
      <rect x="60" y="13" width="44" height="33" rx="1" fill="#435741" />
      <rect
        x="25"
        y="57"
        width="116"
        height="23"
        rx="1"
        fill="#e5e5d6"
        stroke="#9da789"
        strokeWidth=".7"
      />
      <text
        x="83"
        y="73"
        textAnchor="middle"
        className="vh-label"
        fontSize="14"
        letterSpacing="1"
      >
        WINDOWS
      </text>
      {[9, 148].map((x) => (
        <g key={x}>
          {Array.from({ length: 5 }, (_, i) => (
            <rect
              key={i}
              x={x}
              y={57 + i * 5}
              width="9"
              height="1.3"
              fill="#8b967c"
            />
          ))}
        </g>
      ))}
    </g>
  </g>
);

const televisionBaseZ = 3;
function TelevisionFoot({ x, direction }: { x: number; direction: number }) {
  // A short, splayed blade joins the lower bezel to a narrow fore/aft foot.
  const profile = [
    [x - 3, -174, televisionBaseZ],
    [x + 3, -174, televisionBaseZ],
    [x + direction * 8 + 3, -165, -13],
    [x + direction * 8 - 3, -165, -13],
  ];
  const back = profile.map(([px, py, pz]) => iso([px, py - 7, pz], P));
  const face = profile.map(([px, py, pz]) => iso([px, py, pz], P));
  const outer = direction > 0 ? [1, 2] : [0, 3];
  return (
    <g stroke="#2b422e" strokeWidth=".75" strokeLinejoin="round">
      <Box
        x={x + direction * 8 - 5}
        y={-188}
        w={10}
        d={31}
        z={-18}
        h={5}
        r={2}
        tone="dark"
      />
      <path
        d={pathOf(
          [back[outer[0]], back[outer[1]], face[outer[1]], face[outer[0]]],
          true,
        )}
        fill="#334833"
      />
      <path d={pathOf(face, true)} fill="#53654d" />
      <path
        d={pathOf([back[0], back[1], face[1], face[0]], true)}
        fill="#64715f"
      />
    </g>
  );
}

const television = (
  <g key="television">
    <TelevisionFoot x={-87} direction={-1} />
    <TelevisionFoot x={111} direction={1} />
    <Box
      x={-123}
      y={-179}
      w={270}
      d={10}
      z={televisionBaseZ}
      h={161}
      r={4}
      tone="dark"
    />
    <g transform={front(-123, -168.9, televisionBaseZ + 161)}>
      <rect
        x="6"
        y="6"
        width="258"
        height="147"
        rx="3"
        fill="#25372e"
        stroke="#85927e"
        strokeWidth=".6"
      />
      <g clipPath="url(#vh-tv-clip)" data-vh="desktop" opacity="0">
        <rect x="10" y="10" width="250" height="136" fill="#8ba995" />
        <path d="M10 108Q80 43 160 89T260 50V146H10Z" fill="#a4bba3" />
        <g transform="translate(174 39)" fill="#d7e4cd" opacity=".7">
          <path d="M0 8 25 4V29H0ZM30 3 62-2V29H30ZM0 34H25V59L0 55ZM30 34H62V65L30 60Z" />
        </g>
        {[20, 44, 68].map((y) => (
          <g key={y}>
            <rect
              x="18"
              y={y}
              width="11"
              height="12"
              rx="1"
              fill="#dce4cd"
              stroke="#708e72"
              strokeWidth=".6"
            />
            <rect x="15" y={y + 15} width="17" height="2" fill="#dae3cb" />
          </g>
        ))}
        <rect
          x="58"
          y="34"
          width="101"
          height="76"
          rx="2"
          fill="#e5e8db"
          stroke="#63816c"
          strokeWidth=".6"
        />
        <path d="M59 44H158" stroke="#a0b29b" strokeWidth=".6" />
        <rect x="65" y="51" width="24" height="51" fill="#c2cfb8" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect
              x={96 + i * 18}
              y="54"
              width="12"
              height="9"
              rx="1"
              fill="#b2b78d"
            />
            <rect x={96 + i * 18} y="69" width="12" height="2" fill="#a3b49b" />
          </g>
        ))}
        <rect x="10" y="133" width="250" height="13" fill="#435f50" />
        <g transform="translate(17 137)" fill="#d8e4cc">
          <path d="M0 0H3V3H0ZM4 0H7V3H4ZM0 4H3V7H0ZM4 4H7V7H4Z" />
        </g>
        <rect x="32" y="136" width="59" height="7" rx="1" fill="#bdceb8" />
        {[101, 115, 129].map((x) => (
          <rect
            key={x}
            x={x}
            y="136"
            width="7"
            height="7"
            rx="1"
            fill="#abbfa3"
          />
        ))}
      </g>
      <circle cx="251" cy="156" r="1" fill="#aabd99" />
    </g>
  </g>
);

// The slot's clear opening is z=-11…3; the tape occupies z=-10…2.
const tapeEdgeA = iso([-1000, 96.1, 2], P);
const tapeEdgeB = iso([1000, 96.1, 2], P);
const definitions = (
  <defs key="definitions">
    <mask
      id="vh-rear-cutouts"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="640"
      height="560"
    >
      <rect width="640" height="560" fill="white" />
      {rearOpenings.map(({ near }, i) => (
        <path key={i} d={pathOf(near, true)} fill="black" />
      ))}
    </mask>
    {rearOpenings.map(({ near }, i) => (
      <clipPath key={i} id={`vh-rear-port-${i}`}>
        <path d={pathOf(near, true)} />
      </clipPath>
    ))}
    <radialGradient id="vh-shadow">
      <stop stopColor="#425c40" stopOpacity=".19" />
      <stop offset="1" stopColor="#425c40" stopOpacity="0" />
    </radialGradient>
    <clipPath id="vh-clock-clip">
      <rect x="240" y="10" width="76" height="19" rx="1" />
    </clipPath>
    <clipPath id="vh-tv-clip">
      <rect x="10" y="10" width="250" height="136" rx="2" />
    </clipPath>
    <clipPath id="vh-tape-outside">
      <path
        d={pathOf(
          [tapeEdgeA, tapeEdgeB, [tapeEdgeB[0], 1200], [tapeEdgeA[0], 1200]],
          true,
        )}
      />
    </clipPath>
  </defs>
);

export function VhsAnatomy({ locale }: { locale: Locale }) {
  return (
    <VhsLive
      locale={locale}
      definitions={definitions}
      laptopBottom={laptopBottom}
      laptopRim={laptopRim}
      laptopUpper={laptopUpper}
      motherboard={motherboard}
      disk={disk}
      ports={ports}
      chassisBack={chassisBack}
      chassisFront={chassisFront}
      extras={extras}
      rearBoard={rearBoard}
      lid={lid}
      tape={tape}
      television={television}
    />
  );
}
