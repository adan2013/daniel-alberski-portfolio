import type { ReactNode } from "react";
import "./signal-unit.css";
import {
  cylinder,
  iso,
  pathOf,
  sideMatrix,
  slabOf,
  topMatrix,
  translateAlong,
  type Point3,
  type SolidPaths,
} from "../anatomy/iso-kit";
import { add, block, cablePath, para, planeMatrix, rod, scale } from "./geo";
import {
  camera as P,
  Z0,
  box,
  coax,
  fan,
  fascia,
  harness,
  jacks,
  laptop,
  laptopPlug,
  leadCable,
  leadPlugAt,
  leadPlugLength,
  lidHeight,
  lidTilt,
  meter,
  meterBody,
  meterNormal,
  onMeter,
  postOut,
  posts,
  ribbon,
  ringAngles,
  sata,
  usbCable,
  usbPlugAt,
  usbPlugLength,
  wires,
  drops,
  type DropName,
} from "./model";

// The home hero figure, parts list (≈150 parts):
// Bench: plinth, four feet, ESD mat with border, grid and ground stud, plate.
// Case: four feet, floor with vents, back/left/right walls with rim holes,
// fascia with power rocker, LED, LCD (bezel, glass, ghost segments), four
// keys, knob (skirt, knurled body, cap, pointer), eleven-LED ring with scale,
// three status LEDs, USB-B port, four screws; right wall with fan (blades,
// guard rings, spokes, screws), two binding posts, vent slots.
// Inside: SBC (standoffs, PCB, cooler with fins and fan, two DIMM slots and
// modules, chipset with sink, coin cell, caps, I/O block, LAN jack, IDC
// header, power header, SATA port, RF socket, crystal); open-frame PSU (bulk
// and small caps, transformer, heatsink with two TO-220s, terminal block,
// fuse, output header); TV tuner (can, antenna socket through the wall,
// chips); 2.5" drive with label; audio amp (finned sink, three TO-220s,
// two caps, relay, trimmer, header); front-panel board.
// Cables: PSU harness, ribbon, SATA, coax, post wires, USB to the laptop,
// two meter leads with banana plugs.
// Laptop: base, feet, keyboard (84 keys), touchpad, hinge, side ports, tilted
// lid with bezel, camera and live screen. Multimeter on its stand: holster,
// face, LCD, keys, selector with scale, three jacks, two lead plugs.

/** A kit solid in four tones by facing, with outline and seams. */
function Solid({ shape, tone = "" }: { shape: SolidPaths; tone?: string }) {
  return (
    <g className={`su-solid ${tone}`}>
      <path className="su-fill" d={shape.fill} />
      {shape.shades.map((d, i) =>
        d ? <path key={i} className={`su-shade-${i}`} d={d} /> : null,
      )}
      <path className="su-top" d={shape.top} />
      <path className="su-edge" d={shape.outline} />
      <path className="su-seam" d={shape.crease + (shape.bevel ?? "")} />
    </g>
  );
}

const top = (x: number, y: number, z: number) => topMatrix([x, y], z, P);
const front = (x: number, y: number, z: number) =>
  sideMatrix([x, y], z, P, "left");
const right = (x: number, y: number, z: number) =>
  sideMatrix([x, y], z, P, "right");

function B({ at, size, tone }: { at: Point3; size: Point3; tone?: string }) {
  return <Solid shape={block(at, size, P)} tone={tone} />;
}
function RB({
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
    <Solid
      tone={tone}
      shape={slabOf({ x, y, w, d, r }, z, h, P, 6, Math.min(0.6, h / 4))}
    />
  );
}
function Cyl({
  x,
  y,
  z,
  r,
  h,
  tone,
  steps = 28,
}: {
  x: number;
  y: number;
  z: number;
  r: number;
  h: number;
  tone?: string;
  steps?: number;
}) {
  return <Solid shape={cylinder(x, y, r, z, h, P, steps)} tone={tone} />;
}
function Rod({
  at,
  axis,
  r,
  len,
  tone,
  steps,
}: {
  at: Point3;
  axis: "x" | "y" | "z" | Point3;
  r: number;
  len: number;
  tone?: string;
  steps?: number;
}) {
  return <Solid shape={rod(at, axis, r, len, P, steps)} tone={tone} />;
}
function Drop({ name, children }: { name: DropName; children: ReactNode }) {
  // Authored in the exploded pose (progress 0); the live layer lowers it.
  return (
    <g
      data-su-drop={name}
      transform={translateAlong(P, [0, 0, drops[name].lift])}
    >
      {children}
    </g>
  );
}
/** A cable drawn as a round body: rim, body and a soft highlight. */
function Cable({ d, tone, live }: { d: string; tone: string; live?: string }) {
  const data = live ? { "data-su-cable": live } : {};
  return (
    <g className={`su-cable ${tone}`}>
      <path className="su-c-rim" d={d} {...data} />
      <path className="su-c-body" d={d} {...data} />
      <path
        className="su-c-hi"
        d={d}
        transform="translate(-0.35 -0.55)"
        {...data}
      />
    </g>
  );
}
function Screw({ r = 1.6 }: { r?: number }) {
  return (
    <g className="su-screw">
      <circle r={r} />
      <path d={`M${-r * 0.7} ${r * 0.7}L${r * 0.7} ${-r * 0.7}`} />
    </g>
  );
}
function Pins({
  x,
  y,
  cols,
  rows,
  gap = 2,
}: {
  x: number;
  y: number;
  cols: number;
  rows: number;
  gap?: number;
}) {
  return (
    <g className="su-pin">
      {Array.from({ length: cols * rows }, (_, i) => (
        <circle
          key={i}
          cx={x + (i % cols) * gap}
          cy={y + Math.floor(i / cols) * gap}
          r="0.45"
        />
      ))}
    </g>
  );
}

// ——— bench ———
function Bench() {
  const shadow = iso([-10, -6, Z0], P);
  return (
    <g>
      <ellipse
        className="su-shadow"
        cx={shadow[0]}
        cy={shadow[1] + 30}
        rx="300"
        ry="70"
      />
      {[-246, 222].flatMap((x) =>
        [-136, 112].map((y) => (
          <RB
            key={`${x}${y}`}
            x={x}
            y={y}
            z={-6}
            w={18}
            d={18}
            h={10}
            r={3}
            tone="su-dark"
          />
        )),
      )}
      <RB x={-258} y={-146} z={4} w={496} d={274} h={12} r={8} />
      <RB x={-250} y={-138} z={16} w={480} d={258} h={2} r={6} tone="su-mat" />
      <g transform={top(-250, -138, Z0)}>
        <rect
          className="su-mat-rule"
          x="5"
          y="5"
          width="470"
          height="248"
          rx="3"
        />
        {Array.from({ length: 22 }, (_, i) => (
          <path
            key={`v${i}`}
            className="su-mat-grid"
            d={`M${25 + i * 20} 5V253`}
          />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <path
            key={`h${i}`}
            className="su-mat-grid"
            d={`M5 ${17 + i * 20}H475`}
          />
        ))}
      </g>
      <Cyl x={220} y={114} z={Z0} r={3.6} h={1.6} tone="su-metal" />
      <Cyl x={220} y={114} z={Z0 + 1.6} r={1.6} h={1.4} tone="su-metal" />
      <g transform={front(-238, 128, 13)}>
        <rect className="su-label-plate" width="76" height="7" rx="1" />
        <text className="su-engraved" x="4" y="5">
          DA / SIGNAL UNIT 04
        </text>
        <g transform="translate(70 3.5)">
          <Screw r={1.1} />
        </g>
      </g>
    </g>
  );
}

// ——— multimeter ———
function Meter() {
  const { o, u, v, w } = meterBody;
  const faceO = add(add(o, w), v);
  const down = scale(v, -1);
  const plug = (a: number, tone: string) => {
    const base = onMeter(a, jacks.b, 0);
    return (
      <g key={a}>
        <Rod at={base} axis={meterNormal} r={3.1} len={3} tone="su-metal" />
        <Rod
          at={add(base, scale(meterNormal, 3))}
          axis={meterNormal}
          r={2.7}
          len={10}
          tone={tone}
        />
      </g>
    );
  };
  // Wire stand: from the back face down to the mat behind.
  const stand = (x: number) => {
    const from = add(add(o, [x - o[0], 0, 0]), scale(v, 0.16));
    const to: Point3 = [x, -140, Z0 + 1];
    const dir: Point3 = [0, to[1] - from[1], to[2] - from[2]];
    return (
      <Rod
        key={x}
        at={from}
        axis={dir}
        r={1}
        len={Math.hypot(dir[1], dir[2])}
        tone="su-metal"
        steps={10}
      />
    );
  };
  return (
    <g>
      {stand(meter.x0 + 5)}
      <Solid tone="su-holster" shape={para(o, u, v, w, P)} />
      {stand(meter.x0 + meter.w - 5)}
      <g transform={planeMatrix(faceO, u, down, P)}>
        <rect
          className="su-meter-face"
          x="4"
          y="4"
          width={meter.w - 8}
          height={meter.h - 8}
          rx="3"
        />
        <rect
          className="su-meter-lcd-bezel"
          x="7"
          y="9"
          width="42"
          height="27"
          rx="2"
        />
        <rect
          className="su-meter-lcd"
          x="9"
          y="11"
          width="38"
          height="23"
          rx="1"
        />
        <g clipPath="url(#su-meter-clip)">
          <text className="su-meter-ghost" x="45" y="29.5">
            88.88
          </text>
          <text className="su-meter-digits" x="45" y="29.5" data-su-meter>
            0.00
          </text>
        </g>
        <text className="su-meter-unit" x="11" y="16" data-su-meter-mode>
          V⎓
        </text>
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            className="su-meter-key"
            x={8 + i * 10.6}
            y="40"
            width="8.4"
            height="4.4"
            rx="1"
          />
        ))}
        <g data-su-click="meter" className="su-hit">
          <circle className="su-meter-dial-ring" cx="28" cy="67" r="21" />
          {Array.from({ length: 8 }, (_, i) => {
            const t = ((-150 + i * 42.8) * Math.PI) / 180;
            return (
              <path
                key={i}
                className="su-meter-tick"
                d={`M${28 + Math.sin(t) * 18} ${67 - Math.cos(t) * 18}L${28 + Math.sin(t) * 21} ${67 - Math.cos(t) * 21}`}
              />
            );
          })}
          <circle className="su-meter-dial" cx="28" cy="67" r="15" />
          <g data-su-meter-knob transform="rotate(-64.4 28 67)">
            <rect
              className="su-meter-grip"
              x="25"
              y="52.5"
              width="6"
              height="29"
              rx="3"
            />
            <path className="su-meter-pointer" d="M28 54.5V59" />
          </g>
          <circle className="su-hit-pad" cx="28" cy="67" r="22" />
        </g>
        {[12, 28, 44].map((a) => (
          <g key={a}>
            <circle
              className={a === 44 ? "su-jack-red" : "su-jack"}
              cx={a}
              cy={jacks.b}
              r="4.6"
            />
            <circle className="su-jack-hole" cx={a} cy={jacks.b} r="1.8" />
          </g>
        ))}
        <text className="su-meter-label" x="12" y="109">
          A
        </text>
        <text className="su-meter-label" x="28" y="109">
          COM
        </text>
        <text className="su-meter-label" x="44" y="109">
          VΩ
        </text>
      </g>
      {plug(jacks.com, "su-lead-black")}
      {plug(jacks.volt, "su-key-accent")}
    </g>
  );
}

// ——— case: back half ———
const standoffs: Point3[] = [
  [-222, -72, 4],
  [-110, -72, 4],
  [-222, -24, 4],
  [-110, -24, 4],
  [-96, -72, 4],
  [-22, -72, 4],
  [-96, -26, 4],
  [-22, -26, 4],
  [-192, -6, 2],
  [-150, -6, 2],
  [-192, 18, 2],
  [-150, 18, 2],
  [-92, -6, 2],
  [-24, -6, 2],
  [-92, 18, 2],
  [-24, 18, 2],
];
function CaseBack() {
  const { x0, x1, y0, y1, floor, rim, wall } = box;
  return (
    <g>
      {[x0 + 12, x1 - 12].flatMap((x) =>
        [y0 + 12, y1 - 10].map((y) => (
          <Cyl key={`${x}${y}`} x={x} y={y} z={Z0} r={5} h={4} tone="su-dark" />
        )),
      )}
      <B
        at={[x0, y0, Z0 + 4]}
        size={[x1 - x0, y1 - y0, floor - Z0 - 4]}
        tone="su-floor"
      />
      <g transform={top(x0, y0, floor)}>
        <rect
          className="su-floor-rule"
          x="6"
          y="6"
          width={x1 - x0 - 12}
          height={y1 - y0 - 12}
          rx="2"
        />
        {Array.from({ length: 9 }, (_, i) => (
          <rect
            key={i}
            className="su-slot"
            x={120 + i * 9}
            y="98"
            width="4"
            height="22"
            rx="2"
          />
        ))}
      </g>
      {/* Standoffs wait on the floor for the boards. */}
      {standoffs.map(([x, y, h]) => (
        <g key={`${x}${y}`}>
          <Cyl x={x} y={y} z={floor} r={2.4} h={h} tone="su-metal" steps={6} />
          <g transform={top(x, y, floor + h)}>
            <circle className="su-rim-hole" r="0.8" />
          </g>
        </g>
      ))}
      <B at={[x0, y0, floor]} size={[x1 - x0, wall, rim - floor]} />
      <B
        at={[x0, y0 + wall, floor]}
        size={[wall, y1 - y0 - wall, rim - floor]}
      />
      {/* Lid screw holes along the rim. */}
      <g transform={top(x0, y0, rim)}>
        {[20, 111, 202].map((x) => (
          <circle key={x} className="su-rim-hole" cx={x} cy="1.5" r="0.9" />
        ))}
      </g>
      <g transform={top(x0, y0, rim)}>
        {[30, 80, 130].map((y) => (
          <circle key={y} className="su-rim-hole" cx="1.5" cy={y} r="0.9" />
        ))}
      </g>
    </g>
  );
}

// ——— parts inside ———
function Board() {
  return (
    <g>
      <B at={[-226, -77, 29]} size={[120, 57, 2]} tone="su-pcb" />
      <g transform={top(-226, -77, 31)}>
        <rect className="su-silk" x="3" y="3" width="114" height="51" rx="1" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            className="su-trace"
            d={`M${44 + i * 3} 30V${44 - i}H${84 - i * 2}`}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            className="su-trace"
            d={`M${10 + i * 3} 30V${46 + i * 2}H${30}`}
          />
        ))}
        {[
          [4, 5],
          [116, 5],
          [4, 53],
          [116, 53],
        ].map(([x, y]) => (
          <g key={`${x}${y}`} transform={`translate(${x} ${y})`}>
            <Screw r={1.4} />
          </g>
        ))}
        <Pins x={6} y={52} cols={10} rows={2} gap={2} />
      </g>
      {/* Rear I/O through the back wall: USB pair and LAN jack. */}
      <B at={[-222, -80, 31]} size={[14, 12, 13]} tone="su-metal" />
      <B at={[-204, -80, 31]} size={[15, 14, 12]} tone="su-metal" />
      <g transform={top(-204, -80, 43)}>
        <rect
          className="su-dark-inlay"
          x="3"
          y="9"
          width="9"
          height="3"
          rx="0.5"
        />
      </g>
      {/* Chipset with a small sink, coin cell, caps, crystal. */}
      <B at={[-140, -66, 31]} size={[12, 12, 2]} tone="su-dark" />
      <B at={[-139, -65, 33]} size={[10, 10, 4]} tone="su-metal" />
      <g transform={top(-139, -65, 37)}>
        {[2, 4, 6, 8].map((x) => (
          <path key={x} className="su-fin" d={`M${x} 0.6V9.4`} />
        ))}
      </g>
      <Cyl x={-120} y={-66} z={31} r={5.5} h={2} tone="su-metal" />
      <g transform={top(-120, -66, 33)}>
        <path className="su-fin" d="M-1.6 0H1.6M0 -1.6V1.6" />
      </g>
      {[
        [-212, -58],
        [-212, -48],
        [-186, -34],
        [-176, -34],
      ].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <Cyl x={x} y={y} z={31} r={2.6} h={7} tone="su-cap" steps={16} />
          <g transform={top(x, y, 38)}>
            <path className="su-cap-vent" d="M-1.4 0H1.4M0 -1.4V1.4" />
          </g>
        </g>
      ))}
      <RB x={-150} y={-40} z={31} w={7} d={3} h={2.4} r={1.4} tone="su-metal" />
      {[
        [-150, -52],
        [-150, -30],
        [-160, -34],
      ].map(([x, y]) => (
        <B key={`${x}${y}`} at={[x, y, 31]} size={[6, 5, 1.2]} tone="su-dark" />
      ))}
      {/* DIMM slots with latches. */}
      {[-165, -157].map((x) => (
        <g key={x}>
          <B at={[x, -72, 31]} size={[4, 42, 4]} tone="su-dark" />
          <B at={[x - 0.5, -74, 31]} size={[5, 2.5, 6]} tone="su-metal" />
          <B at={[x - 0.5, -30.5, 31]} size={[5, 2.5, 6]} tone="su-metal" />
        </g>
      ))}
      {/* IDC header for the ribbon, power header, SATA, RF socket. */}
      <B at={[-224, -27, 31]} size={[24, 7, 6]} tone="su-dark" />
      <g transform={top(-224, -27, 37)}>
        <rect
          className="su-dark-inlay"
          x="1.5"
          y="1.5"
          width="21"
          height="4"
          rx="0.4"
        />
        <Pins x={3} y={2.5} cols={10} rows={2} gap={2} />
      </g>
      <B at={[-124, -50, 31]} size={[12, 13, 6]} tone="su-paper" />
      <g transform={top(-124, -50, 37)}>
        <Pins x={3} y={2.8} cols={4} rows={2} gap={2.4} />
      </g>
      <B at={[-138, -27, 31]} size={[9, 5, 3]} tone="su-dark" />
      <Cyl x={-170} y={-22} z={31} r={1.8} h={3} tone="su-metal" steps={12} />
    </g>
  );
}
function Ram() {
  return (
    <g>
      {[-164, -156].map((x) => (
        <g key={x}>
          <B at={[x, -70, 35]} size={[2, 38, 17]} tone="su-pcb" />
          <g transform={right(x + 2, -32, 52)}>
            {[3, 12, 21, 30].map((u) => (
              <rect
                key={u}
                className="su-chip"
                x={u}
                y="3"
                width="6.5"
                height="9"
                rx="0.4"
              />
            ))}
            <path className="su-gold" d="M1 15.6H37" />
          </g>
        </g>
      ))}
    </g>
  );
}
function Cooler() {
  return (
    <g>
      <B at={[-198, -68, 31]} size={[28, 26, 3]} tone="su-metal" />
      <B at={[-198, -68, 34]} size={[28, 26, 13]} tone="su-metal" />
      <g transform={front(-198, -42, 47)}>
        {Array.from({ length: 11 }, (_, i) => (
          <path key={i} className="su-fin" d={`M${2 + i * 2.4} 0.6V12.4`} />
        ))}
      </g>
      <g transform={right(-170, -42, 47)}>
        {Array.from({ length: 5 }, (_, i) => (
          <path key={i} className="su-fin" d={`M0.6 ${2 + i * 2.2}H25.4`} />
        ))}
      </g>
      <B at={[-196, -66, 47]} size={[24, 22, 5]} tone="su-dark" />
      <g transform={top(-184, -55, 52)}>
        <circle className="su-fan-hole" r="9.5" />
        <g data-su-spin="cpu">
          {Array.from({ length: 7 }, (_, i) => (
            <path
              key={i}
              className="su-blade"
              transform={`rotate(${i * 51.4})`}
              d="M0 -2.6C3 -4 6 -6 7.6 -3.4 6 -1 3 -0.8 2.4 -0.8Z"
            />
          ))}
        </g>
        <circle className="su-hub" r="2.8" />
        {[
          [-10, -9],
          [10, -9],
          [-10, 9],
          [10, 9],
        ].map(([x, y]) => (
          <circle
            key={`${x}${y}`}
            className="su-rim-hole"
            cx={x}
            cy={y}
            r="0.8"
          />
        ))}
      </g>
    </g>
  );
}
function Psu() {
  return (
    <g>
      <B at={[-100, -77, 29]} size={[82, 55, 2]} tone="su-pcb" />
      <g transform={top(-100, -77, 31)}>
        <rect className="su-silk" x="3" y="3" width="76" height="49" rx="1" />
        <path className="su-silk-danger" d="M3 28H40V52" />
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            className="su-trace"
            d={`M${46 + i * 3} 38V${48}H${70}`}
          />
        ))}
      </g>
      <Rod
        at={[-96, -70, 34]}
        axis="x"
        r={2}
        len={10}
        tone="su-metal"
        steps={14}
      />
      <Rod
        at={[-93, -70, 34]}
        axis="x"
        r={2.2}
        len={4}
        tone="su-glass"
        steps={14}
      />
      <B at={[-77, -71, 31]} size={[22, 16, 16]} tone="su-paper" />
      <g transform={front(-77, -55, 45)}>
        <path className="su-tape" d="M0.6 3H21.4M0.6 7H21.4" />
      </g>
      <B at={[-79, -66, 31]} size={[26, 6, 19]} tone="su-dark" />
      <B at={[-48, -73, 31]} size={[22, 4, 25]} tone="su-metal" />
      <g transform={top(-48, -73, 56)}>
        {[3, 7, 11, 15, 19].map((x) => (
          <path key={x} className="su-fin" d={`M${x} 0.6V3.4`} />
        ))}
      </g>
      {[-46, -36].map((x) => (
        <g key={x}>
          <B at={[x, -69, 36]} size={[8, 3, 11]} tone="su-dark" />
          <g transform={front(x, -66, 47)}>
            <circle className="su-rim-hole" cx="4" cy="2.5" r="1" />
          </g>
          <g transform={front(x, -66, 36)}>
            <path className="su-leg" d="M2 0V5M4 0V5M6 0V5" />
          </g>
        </g>
      ))}
      <Cyl x={-86} y={-38} z={31} r={8} h={27} tone="su-cap" />
      <g transform={top(-86, -38, 58)}>
        <circle className="su-cap-top" r="7.2" />
        <path className="su-cap-vent" d="M-4 0H4M0 -4V4" />
      </g>
      <Cyl x={-68} y={-36} z={31} r={4.5} h={14} tone="su-cap" steps={20} />
      <g transform={top(-68, -36, 45)}>
        <path className="su-cap-vent" d="M-2.2 0H2.2M0 -2.2V2.2" />
      </g>
      <B at={[-100, -48, 31]} size={[5, 14, 5]} tone="su-paper" />
      <B at={[-36, -34, 31]} size={[16, 10, 8]} tone="su-terminal" />
      <g transform={top(-36, -34, 39)}>
        {[3, 8, 13].map((x) => (
          <g key={x} transform={`translate(${x} 4)`}>
            <Screw r={1.7} />
          </g>
        ))}
      </g>
    </g>
  );
}
function Tuner() {
  return (
    <g>
      <B at={[-196, -10, 27]} size={[50, 32, 2]} tone="su-pcb" />
      <Rod
        at={[-197, 4, 34]}
        axis="x"
        r={2.4}
        len={5}
        tone="su-metal"
        steps={16}
      />
      <B at={[-192, -6, 29]} size={[32, 20, 11]} tone="su-metal" />
      <g transform={top(-192, -6, 40)}>
        <rect
          className="su-can-seam"
          x="1.2"
          y="1.2"
          width="29.6"
          height="17.6"
          rx="0.6"
        />
        {Array.from({ length: 24 }, (_, i) => (
          <circle
            key={i}
            className="su-perf"
            cx={5 + (i % 8) * 3.2}
            cy={6 + Math.floor(i / 8) * 4}
            r="0.55"
          />
        ))}
      </g>
      <g transform={front(-192, 14, 40)}>
        <path className="su-can-seam" d="M0.6 3H31.4" />
      </g>
      <B at={[-158, -4, 29]} size={[7, 7, 1.6]} tone="su-dark" />
      <B at={[-158, 8, 29]} size={[9, 6, 1.6]} tone="su-dark" />
      <RB x={-190} y={16} z={29} w={7} d={3} h={2.4} r={1.4} tone="su-metal" />
    </g>
  );
}
function Drive() {
  return (
    <g>
      <RB
        x={-141}
        y={-12}
        z={box.floor}
        w={38}
        d={34}
        h={8}
        r={1.5}
        tone="su-metal"
      />
      <g transform={top(-141, -12, 33)}>
        <rect className="su-label" x="4" y="5" width="30" height="20" rx="1" />
        <rect
          className="su-label-band"
          x="4"
          y="5"
          width="30"
          height="5"
          rx="1"
        />
        {[13, 16, 19, 22].map((y) => (
          <path
            key={y}
            className="su-label-line"
            data-free=""
            d={`M7 ${y}H${y === 22 ? 20 : 31}`}
          />
        ))}
        {[
          [2, 2],
          [36, 2],
          [2, 32],
          [36, 32],
        ].map(([x, y]) => (
          <circle
            key={`${x}${y}`}
            className="su-rim-hole"
            cx={x}
            cy={y}
            r="0.8"
          />
        ))}
      </g>
      <B at={[-133, -14, 27]} size={[10, 2, 5]} tone="su-dark" />
    </g>
  );
}
function Amp() {
  return (
    <g>
      <B at={[-96, -10, 27]} size={[76, 32, 2]} tone="su-pcb" />
      <g transform={top(-96, -10, 29)}>
        <rect className="su-silk" x="2" y="2" width="72" height="28" rx="1" />
      </g>
      {Array.from({ length: 6 }, (_, i) => (
        <B
          key={i}
          at={[-91 + i * 5.2, -9, 29]}
          size={[1.4, 6, 25]}
          tone="su-metal"
        />
      ))}
      <B at={[-91, -3, 29]} size={[27.4, 3, 25]} tone="su-metal" />
      {[-88, -79, -70].map((x) => (
        <g key={x}>
          <B at={[x, 0, 34]} size={[7, 2.6, 10]} tone="su-dark" />
          <g transform={front(x, 2.6, 44)}>
            <circle className="su-rim-hole" cx="3.5" cy="2.4" r="0.9" />
            <path className="su-leg" d="M2 10V14.4M3.5 10V14.4M5 10V14.4" />
          </g>
        </g>
      ))}
      {[-52, -38].map((x) => (
        <g key={x}>
          <Cyl x={x} y={2} z={29} r={5.5} h={17} tone="su-cap" />
          <g transform={top(x, 2, 46)}>
            <circle className="su-cap-top" r="4.9" />
            <path className="su-cap-vent" d="M-2.8 0H2.8M0 -2.8V2.8" />
          </g>
        </g>
      ))}
      <B at={[-60, 11, 29]} size={[14, 9, 10]} tone="su-dark" />
      <g transform={top(-60, 11, 39)}>
        <rect
          className="su-dark-inlay"
          x="2"
          y="2"
          width="10"
          height="5"
          rx="0.5"
        />
      </g>
      <Cyl x={-30} y={13} z={29} r={3} h={3} tone="su-paper" steps={16} />
      <g transform={top(-30, 13, 32)}>
        <path className="su-fin" d="M-2 0H2" />
      </g>
      <B at={[-38, 18, 29]} size={[10, 3, 4]} tone="su-paper" />
      <B at={[-90, 12, 29]} size={[8, 6, 1.6]} tone="su-dark" />
      <B at={[-76, 13, 29]} size={[8, 6, 1.6]} tone="su-dark" />
    </g>
  );
}
function FrontBoard() {
  return (
    <g>
      <B at={[-228, 72, 28]} size={[212, 3, 38]} tone="su-pcb" />
      <B at={[-223, 66, 28]} size={[22, 6, 7]} tone="su-dark" />
      <B at={[-96, 68, 52]} size={[10, 4, 12]} tone="su-metal" />
    </g>
  );
}
function Ribbon() {
  // A flat 20-way ribbon: one band with conductor lines and a red edge.
  const left = ribbon.map(([x, y, z]) => iso([x - 10, y, z], P));
  const rightE = ribbon.map(([x, y, z]) => iso([x + 10, y, z], P));
  const band = pathOf([...left, ...[...rightE].reverse()], true);
  const line = (dx: number) =>
    pathOf(ribbon.map(([x, y, z]) => iso([x + dx, y, z], P)));
  return (
    <g>
      <path className="su-ribbon" d={band} />
      {[-6, -2, 2, 6].map((dx) => (
        <path key={dx} className="su-ribbon-line" d={line(dx)} />
      ))}
      <path className="su-ribbon-red" d={line(-9)} />
      <B at={[-223, -27, 37]} size={[22, 5, 3]} tone="su-dark" />
    </g>
  );
}

// ——— right wall and fascia ———
function RightWall() {
  const { x1, y0, y1, floor, rim, wall } = box;
  return (
    <g>
      <B
        at={[x1 - wall, y0 + wall, floor]}
        size={[wall, y1 - y0 - wall, rim - floor]}
      />
      <g transform={top(x1 - wall, y0, rim)}>
        {[30, 80, 130].map((y) => (
          <circle key={y} className="su-rim-hole" cx="1.5" cy={y} r="0.9" />
        ))}
      </g>
      <g transform={right(x1, y1, rim)}>
        {Array.from({ length: 6 }, (_, i) => (
          <rect
            key={i}
            className="su-slot"
            x={10 + i * 6}
            y="8"
            width="2.6"
            height="22"
            rx="1.3"
          />
        ))}
        <g transform={`translate(${y1 - fan.y} ${rim - fan.z})`}>
          <circle className="su-fan-hole" r={fan.r} />
          <g data-su-spin="case">
            {Array.from({ length: 7 }, (_, i) => (
              <path
                key={i}
                className="su-blade"
                transform={`rotate(${i * 51.4})`}
                d="M0 -4.4C5 -7 11 -11 14.6 -6.2 11 -1.8 5 -1.4 4 -1.4Z"
              />
            ))}
            <circle className="su-hub" r="4.6" />
          </g>
          {[6, 11, 16].map((r) => (
            <circle key={r} className="su-guard" r={r} />
          ))}
          <path
            className="su-guard"
            d={`M-${fan.r} 0H${fan.r}M0 -${fan.r}V${fan.r}`}
          />
          {[
            [-15, -15],
            [15, -15],
            [-15, 15],
            [15, 15],
          ].map(([x, y]) => (
            <g key={`${x}${y}`} transform={`translate(${x} ${y})`}>
              <Screw r={1.3} />
            </g>
          ))}
        </g>
        {posts.map((post) => (
          <text
            key={post.y}
            className="su-wall-label"
            x={y1 - post.y}
            y={rim - post.z + 9}
          >
            {post.tone === "red" ? "+12V" : "GND"}
          </text>
        ))}
      </g>
      {posts.map((post) => (
        <g key={post.y}>
          <Rod
            at={[x1, post.y, post.z]}
            axis="x"
            r={4.4}
            len={2.5}
            tone="su-metal"
            steps={6}
          />
          <Rod
            at={[x1 + 2.5, post.y, post.z]}
            axis="x"
            r={3.6}
            len={postOut - 2.5}
            tone={post.tone === "red" ? "su-key-accent" : "su-lead-black"}
          />
        </g>
      ))}
    </g>
  );
}
function Fascia() {
  const { x0, x1, y1, face, faceTop, faceBottom } = box;
  const { power, lcd, buttons, knob, leds, usb } = fascia;
  const knobAt = (out: number): Point3 => [
    x0 - 2 + knob.u,
    face + out,
    faceTop - knob.v,
  ];
  return (
    <g>
      <RB
        x={x0 - 2}
        y={y1}
        z={faceBottom}
        w={x1 - x0 + 4}
        d={face - y1}
        h={faceTop - faceBottom}
        r={2}
        tone="su-dark"
      />
      <g transform={front(x0 - 2, face, faceTop)}>
        <rect
          className="su-face-rule"
          x="3"
          y="3"
          width={x1 - x0 - 2}
          height={faceTop - faceBottom - 6}
          rx="1.5"
        />
        {[
          [6, 6],
          [x1 - x0 - 2, 6],
          [6, 44],
          [x1 - x0 - 2, 44],
        ].map(([u, v]) => (
          <g key={`${u}${v}`} transform={`translate(${u} ${v})`}>
            <Screw r={1.5} />
          </g>
        ))}
        {/* Power rocker. */}
        <g data-su-click="power" className="su-hit">
          <rect
            className="su-rocker-frame"
            x={power.u - 1.5}
            y={power.v - 1.5}
            width={power.w + 3}
            height={power.h + 3}
            rx="1.5"
          />
          <rect
            className="su-rocker"
            x={power.u}
            y={power.v}
            width={power.w}
            height={power.h}
            rx="1"
            data-su-rocker
          />
          <path
            className="su-rocker-mark"
            d={`M${power.u + 4} ${power.v + 3}V${power.v + 7}`}
          />
          <circle
            className="su-rocker-mark"
            cx={power.u + power.w - 4}
            cy={power.v + 5}
            r="1.8"
          />
          <rect
            className="su-hit-pad"
            x={power.u - 4}
            y={power.v - 4}
            width={power.w + 8}
            height={power.h + 8}
          />
        </g>
        <circle
          className="su-led"
          cx={power.u + power.w / 2}
          cy={power.v + power.h + 7}
          r="1.4"
          data-su-led="power"
        />
        <text
          className="su-face-label"
          x={power.u + power.w / 2}
          y={power.v + power.h + 14}
        >
          POWER
        </text>
        {/* LCD: bezel, glass, faint unlit segments and the live text. */}
        <rect
          className="su-lcd-bezel"
          x={lcd.u}
          y={lcd.v}
          width={lcd.w}
          height={lcd.h}
          rx="1.5"
        />
        <rect
          className="su-lcd"
          x={lcd.u + 3}
          y={lcd.v + 3}
          width={lcd.w - 6}
          height={lcd.h - 6}
          rx="0.8"
          data-su-lcd-glass
        />
        <g clipPath="url(#su-lcd-clip)">
          {lcdCells.map((x, i) => (
            <g key={i}>
              <text className="su-lcd-ghost" x={x} y={lcd.v + 18.5}>
                ~
              </text>
              <text
                className="su-lcd-text"
                x={x}
                y={lcd.v + 18.5}
                data-su-lcd-cell={i}
              >
                !
              </text>
            </g>
          ))}
          {lcdCells.slice(0, -1).map((x, i) => (
            <g key={i} className="su-lcd-mark" data-su-lcd-mark={i}>
              <circle
                cx={x + lcdPitch / 2}
                cy={lcd.v + 11.6}
                r="0.55"
                data-colon=""
              />
              <circle cx={x + lcdPitch / 2} cy={lcd.v + 16.2} r="0.55" />
            </g>
          ))}
          <text
            className="su-lcd-small"
            x={lcd.u + 5}
            y={lcd.v + 8.2}
            data-su-lcd-tag
          >
            {" "}
          </text>
        </g>
        {buttons.map((b, i) => (
          <g key={i} data-su-click={`button-${i}`} className="su-hit">
            <rect
              className="su-key-well"
              x={b.u - 1}
              y={b.v - 1}
              width={b.w + 2}
              height={b.h + 2}
              rx="1.5"
            />
            <g data-su-button={i}>
              <rect
                className="su-key"
                x={b.u}
                y={b.v}
                width={b.w}
                height={b.h}
                rx="1"
              />
              <path
                className="su-key-hi"
                d={`M${b.u + 1.5} ${b.v + 1}H${b.u + b.w - 1.5}`}
              />
            </g>
            <text
              className="su-face-label"
              x={b.u + b.w / 2}
              y={b.v + b.h + 5.4}
            >
              {["TIME", "VOLT", "SIG", "DIAG"][i]}
            </text>
            <rect
              className="su-hit-pad"
              x={b.u - 2}
              y={b.v - 3}
              width={b.w + 4}
              height={b.h + 10}
            />
          </g>
        ))}
        {/* Scale and LED ring around the knob. */}
        {ringAngles.map((a, i) => {
          const t = (a * Math.PI) / 180;
          const r = knob.skirt + 3.6;
          return (
            <g key={i}>
              <path
                className={i % 5 === 0 ? "su-scale-major" : "su-scale"}
                d={`M${knob.u + Math.sin(t) * (r + 2.4)} ${knob.v - Math.cos(t) * (r + 2.4)}L${knob.u + Math.sin(t) * (r + (i % 5 === 0 ? 5.2 : 4))} ${knob.v - Math.cos(t) * (r + (i % 5 === 0 ? 5.2 : 4))}`}
              />
              <circle
                className="su-ring-led"
                cx={knob.u + Math.sin(t) * r}
                cy={knob.v - Math.cos(t) * r}
                r="1.05"
                data-su-ring={i}
              />
            </g>
          );
        })}
        {leds.map((led, i) => (
          <g key={i}>
            <circle
              className="su-led"
              cx={led.u}
              cy={led.v}
              r="1.4"
              data-su-led={["run", "data", "link"][i]}
            />
            <text
              className="su-face-label su-left"
              x={led.u + 3.4}
              y={led.v + 1.5}
            >
              {["RUN", "DATA", "LINK"][i]}
            </text>
          </g>
        ))}
        {/* USB-B: shell, opening and the tongue. */}
        <rect
          className="su-usb-shell"
          x={usb.u - 1}
          y={usb.v - 1}
          width={usb.w + 2}
          height={usb.h + 2}
          rx="1"
        />
        <path
          className="su-usb-hole"
          d={`M${usb.u + 1} ${usb.v + 2.6}L${usb.u + 2.6} ${usb.v + 1}H${usb.u + usb.w - 2.6}L${usb.u + usb.w - 1} ${usb.v + 2.6}V${usb.v + usb.h - 1}H${usb.u + 1}Z`}
        />
        <rect
          className="su-usb-tongue"
          x={usb.u + 3}
          y={usb.v + 3.6}
          width={usb.w - 6}
          height={usb.h - 6.2}
          rx="0.5"
        />
        <text
          className="su-face-label"
          x={usb.u + usb.w / 2}
          y={usb.v + usb.h + 3.6}
        >
          USB
        </text>
        <text className="su-face-brand" x={power.u - 2} y="46">
          DA-04
        </text>
      </g>
      {/* The knob stands out of the fascia: skirt, knurled body, cap. */}
      <g data-su-click="knob" className="su-hit">
        <Rod
          at={knobAt(0)}
          axis="y"
          r={knob.skirt}
          len={2.4}
          tone="su-metal"
          steps={40}
        />
        <Rod
          at={knobAt(2.4)}
          axis="y"
          r={knob.r}
          len={knob.depth - 2.4}
          tone="su-knob"
          steps={40}
        />
        <g className="su-knurl">
          {Array.from({ length: 36 }, (_, i) => {
            const t = (i / 36) * Math.PI * 2;
            const n: Point3 = [Math.cos(t), 0, Math.sin(t)];
            if (n[0] * 0.44 + n[2] * 0.79 < 0.12) return null;
            const a = add(knobAt(4), scale(n, knob.r));
            const b = add(knobAt(knob.depth - 1), scale(n, knob.r));
            return <path key={i} d={pathOf([iso(a, P), iso(b, P)])} />;
          })}
        </g>
        <g
          transform={front(
            x0 - 2 + knob.u,
            face + knob.depth,
            faceTop - knob.v,
          )}
        >
          <circle className="su-knob-cap" r={knob.r - 2.2} />
          <circle className="su-knob-dish" r={knob.r - 6} />
          <g data-su-knob transform="rotate(-135)">
            <path
              className="su-knob-pointer"
              d={`M0 ${-(knob.r - 3.2)}V${-(knob.r - 8)}`}
            />
          </g>
        </g>
      </g>
    </g>
  );
}

// ——— moving cables and plugs ———
function LiveCables() {
  const usbD = cablePath(usbCable(0), P, 8);
  const leadD = [0, 1].map((i) => cablePath(leadCable(i, 0), P, 8));
  const usbAt = usbPlugAt(1);
  return (
    <g>
      {[1, 0].map((i) => (
        <g key={i}>
          <Cable
            d={leadD[i]}
            tone={i === 0 ? "su-c-red" : "su-c-black"}
            live={`lead-${i}`}
          />
          {/* Banana plug drawn seated; the live layer moves it. */}
          <g data-su-plug={`lead-${i}`}>
            <Rod
              at={leadPlugAt(i, 1)}
              axis="x"
              r={2.8}
              len={leadPlugLength}
              tone={i === 0 ? "su-key-accent" : "su-lead-black"}
              steps={18}
            />
            <Rod
              at={add(leadPlugAt(i, 1), [leadPlugLength - 3, 0, 0])}
              axis="x"
              r={3.3}
              len={3}
              tone={i === 0 ? "su-key-accent" : "su-lead-black"}
              steps={18}
            />
          </g>
        </g>
      ))}
      <Cable d={usbD} tone="su-c-usb" live="usb" />
      <circle
        className="su-signal su-packet"
        r="2.4"
        opacity="0"
        data-su-packet="0"
      />
      <circle
        className="su-signal su-packet"
        r="2.4"
        opacity="0"
        data-su-packet="1"
      />
      <circle
        className="su-signal su-packet"
        r="2.4"
        opacity="0"
        data-su-packet="2"
      />
      <circle
        className="su-signal su-packet su-ack"
        r="3"
        opacity="0"
        data-su-packet="ack"
      />
      <g data-su-plug="usb">
        <B
          at={[usbAt[0] - 4, usbAt[1], usbAt[2] - 3.5]}
          size={[8, 3, 7]}
          tone="su-metal"
        />
        <B
          at={[usbAt[0] - 5, usbAt[1] + 3, usbAt[2] - 4.5]}
          size={[10, usbPlugLength - 3, 9]}
          tone="su-plug"
        />
        <g transform={top(usbAt[0] - 5, usbAt[1] + 3, usbAt[2] + 4.5)}>
          {[3, 5, 7, 9].map((y) => (
            <path key={y} className="su-grip" d={`M1.6 ${y}H8.4`} />
          ))}
        </g>
      </g>
    </g>
  );
}

// ——— laptop ———
function Laptop() {
  const { x0, x1, y0, y1, z0, h } = laptop;
  const zt = z0 + h;
  const c = Math.cos(lidTilt);
  const s = Math.sin(lidTilt);
  const lidO: Point3 = [x0 + 2, y0, zt - 1];
  const lidU: Point3 = [x1 - x0 - 4, 0, 0];
  const lidV: Point3 = [0, -s * lidHeight, c * lidHeight];
  const lidW: Point3 = [0, c * 5, s * 5];
  const screenO = add(add(lidO, lidW), lidV);
  const keys: ReactNode[] = [];
  for (let row = 0; row < 6; row++)
    for (let col = 0; col < 15; col++) {
      if (row === 5 && col > 5 && col < 10) continue;
      if (row === 3 && col === 14) continue;
      const enter = row === 3 && col === 13;
      const space = row === 5 && col === 5;
      const width = enter ? 16 : space ? 41.8 : 7.4;
      keys.push(
        <g key={`${row}-${col}`} data-su-enter={enter ? "" : undefined}>
          <rect
            className="su-key-skirt"
            x={12 + col * 8.6}
            y={14 + row * 7.4 + 0.6}
            width={width}
            height="6.4"
            rx="1"
          />
          <rect
            className={enter ? "su-lkey su-lkey-red" : "su-lkey"}
            x={12 + col * 8.6}
            y={14 + row * 7.4}
            width={width}
            height="6.2"
            rx="1"
          />
        </g>,
      );
    }
  return (
    <g>
      {/* Plug in the left side port; mostly behind the base. */}
      <B
        at={[laptopPlug[0], laptopPlug[1] - 4.5, laptopPlug[2] - 3.5]}
        size={[x0 - laptopPlug[0] - 2, 9, 7]}
        tone="su-plug"
      />
      <B
        at={[x0 - 2, laptopPlug[1] - 3, laptopPlug[2] - 2]}
        size={[2, 6, 4]}
        tone="su-metal"
      />
      {[
        [x0 + 10, y0 + 6],
        [x1 - 14, y0 + 6],
        [x0 + 10, y1 - 10],
        [x1 - 14, y1 - 10],
      ].map(([x, y]) => (
        <RB
          key={`${x}${y}`}
          x={x}
          y={y}
          z={Z0}
          w={6}
          d={4}
          h={1.2}
          r={1.5}
          tone="su-dark"
        />
      ))}
      <RB
        x={x0}
        y={y0}
        z={z0}
        w={x1 - x0}
        d={y1 - y0}
        h={h}
        r={5}
        tone="su-metal"
      />
      <g transform={right(x1, y1, zt)}>
        <rect
          className="su-port"
          x="16"
          y="2.6"
          width="9"
          height="3"
          rx="0.5"
        />
        <rect
          className="su-port"
          x="29"
          y="2.6"
          width="9"
          height="3"
          rx="0.5"
        />
        <path className="su-port" d="M43 2.6H53L52 5.6H44Z" />
        <circle className="su-port" cx="60" cy="4.1" r="1.4" />
        {Array.from({ length: 8 }, (_, i) => (
          <rect
            key={i}
            className="su-slot"
            x={68 + i * 3.4}
            y="2.6"
            width="1.6"
            height="3"
            rx="0.8"
          />
        ))}
      </g>
      <g transform={top(x0, y0, zt)}>
        <rect
          className="su-deck-well"
          x="9"
          y="11"
          width="132"
          height="47"
          rx="2"
        />
        {keys}
        <rect
          className="su-touchpad"
          x="51"
          y="64"
          width="48"
          height="30"
          rx="2.5"
        />
        <circle
          className="su-led"
          cx="140"
          cy="94"
          r="1"
          data-su-led="laptop"
        />
      </g>
      <Rod
        at={[x0 + 10, y0 + 2, zt + 1]}
        axis="x"
        r={2.6}
        len={x1 - x0 - 20}
        tone="su-dark"
        steps={16}
      />
      <Solid tone="su-metal" shape={para(lidO, lidU, lidV, lidW, P)} />
      <g transform={planeMatrix(screenO, lidU, scale(lidV, -1), P)}>
        <rect
          className="su-lid-bezel"
          x="0"
          y="0"
          width={x1 - x0 - 4}
          height={lidHeight}
          rx="3"
        />
        <circle className="su-camera" cx={(x1 - x0 - 4) / 2} cy="3.6" r="1" />
        <rect
          className="su-screen-recess"
          x="5"
          y="7"
          width={x1 - x0 - 14}
          height={lidHeight - 15}
          rx="1"
        />
        <g clipPath="url(#su-screen-clip)">
          <Screen />
        </g>
      </g>
    </g>
  );
}

/** The laptop's screen, 136 × 77 at (5, 7). */
function Screen() {
  return (
    <g transform="translate(5 7)">
      <rect className="su-ui-bg" width="136" height="77" />
      <rect className="su-ui-bar" width="136" height="7" />
      {[3, 7, 11].map((x) => (
        <circle key={x} className="su-ui-dot" cx={x} cy="3.5" r="1.1" />
      ))}
      <text className="su-ui-title" x="18" y="5">
        da-flash · firmware.c
      </text>
      <text className="su-ui-clock" x="132" y="5" data-su-clock-laptop>
        --:--
      </text>
      <rect className="su-ui-side" y="7" width="24" height="70" />
      {["main.c", "lcd.c", "knob.c", "usb.c", "fw.bin"].map((f, i) => (
        <text
          key={f}
          className={i === 0 ? "su-ui-file su-ui-on" : "su-ui-file"}
          x="3"
          y={16 + i * 7}
        >
          {f}
        </text>
      ))}
      {/* Editor: code bars until the flasher takes over. */}
      <g data-su-view="code">
        {[
          [0, 30, "k"],
          [1, 52, "f"],
          [2, 44, "s"],
          [2, 26, "k"],
          [1, 8, "f"],
          [0, 0, ""],
          [0, 38, "k"],
          [1, 60, "s"],
          [2, 34, "f"],
          [1, 8, "f"],
        ].map(([indent, w, t], i) => (
          <g key={i}>
            <text className="su-ui-num" x="31" y={14.6 + i * 5.6}>
              {i + 1}
            </text>
            {Number(w) > 0 ? (
              <rect
                className={`su-code su-code-${t}`}
                x={36 + Number(indent) * 5}
                y={12.2 + i * 5.6}
                width={Number(w)}
                height="2.6"
                rx="1.2"
              />
            ) : null}
          </g>
        ))}
      </g>
      <g data-su-view="flash" opacity="0">
        <text className="su-ui-term" x="30" y="15">
          $ da-flash --port usb0
        </text>
        <text className="su-ui-term su-ui-muted" x="30" y="22">
          device DA-04 · 12.04 V
        </text>
        <text className="su-ui-term" x="30" y="29" data-su-flash-line>
          writing fw.bin…
        </text>
        <rect
          className="su-ui-track"
          x="30"
          y="33"
          width="98"
          height="5"
          rx="2.5"
        />
        <rect
          className="su-ui-fill"
          x="30"
          y="33"
          width="0"
          height="5"
          rx="2.5"
          data-su-progress
        />
        <text
          className="su-ui-term su-ui-muted"
          x="128"
          y="44"
          textAnchor="end"
          data-su-progress-text
        >
          0 / 48 kB
        </text>
        <g data-su-view="online" opacity="0">
          <rect
            className="su-ui-card"
            x="30"
            y="49"
            width="98"
            height="22"
            rx="2"
          />
          <path className="su-check" d="M35 60l3 3 6-6" />
          <text className="su-ui-strong" x="48" y="58">
            DA-04 ONLINE
          </text>
          <text
            className="su-ui-term su-ui-muted"
            x="48"
            y="66"
            data-su-ack-line
          >
            ack · 23 ms
          </text>
          <g data-su-click="ping" className="su-hit">
            <rect
              className="su-ui-button"
              x="104"
              y="55"
              width="20"
              height="10"
              rx="2"
              data-su-ping
            />
            <text className="su-ui-button-label" x="114" y="61.8">
              PING
            </text>
          </g>
        </g>
        <g data-su-view="noconn" opacity="0" pointerEvents="none">
          <rect
            className="su-ui-alert"
            x="30"
            y="49"
            width="98"
            height="22"
            rx="2"
          />
          <text className="su-ui-alert-title" x="79" y="58">
            NO CONNECTION
          </text>
          <text className="su-ui-alert-text" x="79" y="65">
            PLEASE CHECK THE DEVICE
          </text>
        </g>
      </g>
    </g>
  );
}

const lcdPitch = 9.3;
const lcdCells = Array.from(
  { length: 8 },
  (_, i) => fascia.lcd.u + 9 + i * lcdPitch,
);
const lcdClip = (() => {
  const { lcd } = fascia;
  return { x: lcd.u + 3, y: lcd.v + 3, w: lcd.w - 6, h: lcd.h - 6 };
})();

export function SignalUnitArt() {
  return (
    <>
      <svg className="su-art" viewBox="0 -14 720 484" aria-hidden="true">
        <defs>
          <clipPath id="su-lcd-clip">
            <rect
              x={lcdClip.x}
              y={lcdClip.y}
              width={lcdClip.w}
              height={lcdClip.h}
            />
          </clipPath>
          <clipPath id="su-meter-clip">
            <rect x="9" y="11" width="38" height="23" />
          </clipPath>
          <clipPath id="su-screen-clip">
            <rect x="5" y="7" width="136" height="77" rx="1" />
          </clipPath>
        </defs>
        <Bench />
        <Meter />
        <CaseBack />
        <Drop name="board">
          <Board />
        </Drop>
        <Drop name="cooler">
          <Cooler />
        </Drop>
        <Drop name="ram">
          <Ram />
        </Drop>
        <Drop name="psu">
          <Psu />
        </Drop>
        <Drop name="harness">
          {harness.map((h, i) => (
            <Cable
              key={i}
              d={cablePath(h, P, 6)}
              tone={["su-c-yellow", "su-c-red", "su-c-black", "su-c-black"][i]}
            />
          ))}
        </Drop>
        <Drop name="wires">
          {wires.map((w, i) => (
            <Cable
              key={i}
              d={cablePath(w, P, 8)}
              tone={i === 0 ? "su-c-black" : "su-c-red"}
            />
          ))}
        </Drop>
        <Drop name="ribbon">
          <Ribbon />
        </Drop>
        <Drop name="tuner">
          <Tuner />
        </Drop>
        <Drop name="coax">
          <Cable d={cablePath(coax, P, 8)} tone="su-c-coax" />
          <Cyl
            x={-174}
            y={-2}
            z={40}
            r={1.8}
            h={2.4}
            tone="su-metal"
            steps={12}
          />
        </Drop>
        <Drop name="drive">
          <Drive />
        </Drop>
        <Drop name="sata">
          <Cable d={cablePath(sata, P, 8)} tone="su-c-sata" />
        </Drop>
        <Drop name="amp">
          <Amp />
        </Drop>
        <FrontBoard />
        <RightWall />
        <Fascia />
        <LiveCables />
        <Laptop />
      </svg>
    </>
  );
}
