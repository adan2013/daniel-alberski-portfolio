import { iso, pathOf, sideMatrix, type Flat } from "../anatomy/iso-kit";
import { Box, Front, Gantry, PlotterBed, Screw, Top } from "./parts";
import { camera, displayWidth, nozzleY, sheet } from "./model";
import "./laser.css";

// The beam leaves the nozzle at z = 30 and lands on the sheet under the head.
const beam = pathOf([
  iso([0, nozzleY, sheet.z + 0.1], camera) as Flat,
  iso([0, nozzleY, 30], camera) as Flat,
]);
const body = { x: -7, y: nozzleY - 6, w: 14, d: 12, z: 38, h: 60 };

// Birch grain runs edge to edge across the sheet.
const grain = Array.from({ length: 9 }, (_, i) => {
  const base = sheet.y + 12 + i * 18.5;
  return pathOf(
    Array.from({ length: 18 }, (_, j): Flat => {
      const x = sheet.x + (j / 17) * sheet.w;
      return [x, base + Math.sin(x * 0.031 + i * 1.7) * 1.6];
    }),
  );
});

function Sheet() {
  return (
    <>
      <Box
        x={sheet.x}
        y={sheet.y}
        z={sheet.z - 1}
        w={sheet.w}
        d={sheet.d}
        h={1}
        r={1}
        tone="lc-ply"
      />
      <Top z={sheet.z + 0.05}>
        {grain.map((d, i) => (
          <path key={i} className="lc-grain iso-line" d={d} />
        ))}
        <g data-lc-cuts />
        <g data-lc-burns />
      </Top>
    </>
  );
}

// Painted before the carriage plates: the spot and the beam under the nozzle.
function Beam() {
  return (
    <g data-lc-head>
      <Top x={0} y={nozzleY} z={sheet.z + 0.1}>
        <g className="lc-spot">
          <circle className="lc-spot-halo" r="5.5" />
          <circle className="lc-spot-core" r="1.2" />
          <path className="lc-sparks iso-line" data-lc-sparks d="" />
        </g>
      </Top>
      <path className="lc-beam-glow" d={beam} />
      <path className="lc-beam" d={beam} />
    </g>
  );
}

// A diode module bolted flush to the front plate: a grooved heat sink, the
// fan housing above it rising over the gantry beam, and the lens below.
function LaserModule() {
  const { x, y, w, d, z, h } = body;
  const front = y + d;
  const sink = 32;
  const grooves = (depth: number) =>
    Array.from({ length: Math.floor(depth / 2) - 1 }, (_, i) => 2 + i * 2);
  return (
    <g>
      <Box
        x={-1.2}
        y={nozzleY - 1.2}
        z={30}
        w={2.4}
        d={2.4}
        h={3}
        r={1.2}
        tone="lc-dark"
      />
      <Box
        x={-2.2}
        y={nozzleY - 2.2}
        z={33}
        w={4.4}
        d={4.4}
        h={z - 33}
        r={2.2}
        tone="lc-metal"
      />
      <Box x={x} y={y} z={z} w={w} d={d} h={sink} r={1} tone="lc-dark" />
      <Front x={x} y={front + 0.02} z={z + sink}>
        {grooves(w).map((u) => (
          <path
            key={u}
            className="lc-groove iso-line"
            d={`M${u} 0.6V${sink - 0.6}`}
          />
        ))}
      </Front>
      <g
        transform={sideMatrix([x + w + 0.02, front], z + sink, camera, "right")}
      >
        {grooves(d).map((u) => (
          <path
            key={u}
            className="lc-groove iso-line"
            d={`M${u} 0.6V${sink - 0.6}`}
          />
        ))}
      </g>
      <Box x={x} y={y} z={z + sink} w={w} d={d} h={h - sink} r={1} />
      <Box
        x={x + 1}
        y={y + 1}
        z={z + h}
        w={w - 2}
        d={d - 2}
        h={1.5}
        r={1}
        tone="lc-dark"
      />
      <Top z={z + h + 1.55}>
        <circle className="lc-fan" cx="0" cy={nozzleY} r="4.2" />
        <circle className="lc-fan-hub" cx="0" cy={nozzleY} r="1.3" />
      </Top>
      <Front x={x} y={front + 0.05} z={z + h - 6}>
        <path className="lc-warning" d="M4 10.5L7 5.3L10 10.5Z" />
        <path className="lc-warning-mark iso-line" data-free="" d="M7 7V9" />
      </Front>
      {[x + 1.8, x + w - 1.8].flatMap((sx) =>
        [z + sink + 2.5, z + h - 2.5].map((sz) => (
          <Screw key={`${sx}-${sz}`} x={sx} y={front + 0.1} z={sz} front />
        )),
      )}
    </g>
  );
}

function ControlBox() {
  return (
    <g>
      <Box x={80} y={109} z={19} w={70} d={12} h={19} r={2} tone="lc-dark" />
      <Front x={85} y={121.1} z={34}>
        <rect className="lc-glass" y="-1" width="46" height="13" rx="1" />
        <text className="lc-segments lc-segments-ghost" x="3.6" y="8.6">
          {"~".repeat(displayWidth)}
        </text>
        <text className="lc-segments" x="3.6" y="8.6" data-lc-display>
          {"!".repeat(displayWidth)}
        </text>
        <rect
          className="lc-lamp"
          data-lc-led
          x="49"
          y="2.5"
          width="5"
          height="6"
          rx="1"
        />
        <rect
          className="lc-button lc-move-lamp"
          x="56.5"
          y="2.5"
          width="5"
          height="6"
          rx="1"
        />
      </Front>
      <Box x={133} y={111} z={38} w={9} d={8} h={2} r={3} tone="lc-dark" />
      <Box x={134} y={112} z={40} w={7} d={6} h={3} r={3} tone="lc-red" />
    </g>
  );
}

export function LaserArt({ label = "ENGRAVER 3000" }: { label?: string }) {
  return (
    <svg className="lc-art" viewBox="45 80 610 345" aria-hidden="true">
      <g data-lc-root transform="translate(0 -55)">
        <PlotterBed label={label} sheet={<Sheet />} />
        <Gantry tool={<Beam />} face={<LaserModule />} />
        <ControlBox />
      </g>
    </svg>
  );
}
