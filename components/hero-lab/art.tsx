import type { ReactNode } from "react";
import {
  slabOf,
  topMatrix,
  sideMatrix,
  pathOf,
  translateAlong,
  type SolidPaths,
} from "../anatomy/iso-kit";
import { camera, drawing, strokeLengths, type Concept } from "./model";

function Solid({ shape, tone = "" }: { shape: SolidPaths; tone?: string }) {
  return (
    <g className={`hl-solid ${tone}`}>
      <path className="hl-fill" d={shape.fill} />
      {shape.shades.map((d, i) =>
        d ? <path key={i} className={`hl-shade-${i}`} d={d} /> : null,
      )}
      <path className="hl-top" d={shape.top} />
      <path className="hl-edge" d={shape.outline} />
      <path className="hl-seam" d={shape.crease + (shape.bevel ?? "")} />
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
  r = 1,
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
      shape={slabOf({ x, y, w, d, r }, z, h, camera, 6, Math.min(0.7, h / 4))}
    />
  );
}
function Screw({
  x,
  y,
  z,
  front = false,
}: {
  x: number;
  y: number;
  z: number;
  front?: boolean;
}) {
  return (
    <g
      transform={
        front
          ? sideMatrix([x, y], z, camera, "left")
          : topMatrix([x, y], z, camera)
      }
      className="hl-screw"
    >
      <circle r="2.1" />
      <path className="iso-line" d="M-1.5 1.5L1.5 -1.5" />
    </g>
  );
}
function Top({
  x = 0,
  y = 0,
  z,
  children,
}: {
  x?: number;
  y?: number;
  z: number;
  children: ReactNode;
}) {
  return <g transform={topMatrix([x, y], z, camera)}>{children}</g>;
}
function Front({
  x,
  y,
  z,
  children,
}: {
  x: number;
  y: number;
  z: number;
  children: ReactNode;
}) {
  return <g transform={sideMatrix([x, y], z, camera, "left")}>{children}</g>;
}

function Base({ plotter = false }: { plotter?: boolean }) {
  return (
    <g>
      <ellipse className="hl-shadow" cx="350" cy="414" rx="228" ry="41" />
      {[-152, 137].flatMap((x) =>
        [-90, 92].map((y) => (
          <Box
            key={`${x}-${y}`}
            x={x}
            y={y}
            z={-5}
            w={17}
            d={17}
            h={9}
            r={3}
            tone="hl-dark"
          />
        )),
      )}
      <Box x={-170} y={-108} z={4} w={340} d={230} h={13} r={9} />
      <Box
        x={-164}
        y={-102}
        z={17}
        w={328}
        d={218}
        h={2}
        r={6}
        tone="hl-metal"
      />
      <Top z={19}>
        <rect
          className="hl-rule"
          x="-158"
          y="-96"
          width="316"
          height="206"
          rx="4"
        />
      </Top>
      {[-155, 155].flatMap((x) =>
        [-93, 106].map((y) => <Screw key={`${x}-${y}`} x={x} y={y} z={19.1} />),
      )}
      <Front x={-146} y={122} z={14}>
        <rect className="hl-label-plate" width="60" height="7" rx="1" />
        <text className="hl-engraved" x="4" y="5">
          {plotter ? "XY / PRECISION 02" : "DA / WORKBENCH 01"}
        </text>
      </Front>
    </g>
  );
}

function Monitor() {
  return (
    <g>
      <Box x={-110} y={-76} z={19} w={83} d={70} h={6} r={5} />
      <Box x={-79} y={-68} z={25} w={20} d={8} h={51} r={2} tone="hl-dark" />
      <Box
        x={-148}
        y={-72}
        z={76}
        w={166}
        d={15}
        h={123}
        r={5}
        tone="hl-dark"
      />
      <Front x={-143} y={-56.8} z={194}>
        <rect className="hl-bezel" width="156" height="113" rx="4" />
        <rect
          className="hl-screen-recess"
          x="6"
          y="6"
          width="144"
          height="94"
          rx="2"
        />
        <g clipPath="url(#hl-monitor-clip)">
          <rect
            className="hl-glass"
            x="8"
            y="8"
            width="140"
            height="90"
            rx="1"
          />
          <g data-bench-sketch>
            <rect
              className="hl-sketch"
              x="17"
              y="19"
              width="121"
              height="67"
              rx="2"
            />
            <path className="hl-sketch iso-line" d="M17 32H138M49 32V86" />
            <rect
              className="hl-sketch"
              x="59"
              y="42"
              width="68"
              height="33"
              rx="0"
            />
            <path
              className="hl-sketch iso-line"
              d="M59 42L127 75M59 75L127 42"
            />
          </g>
          <g data-bench-ui opacity="0">
            <rect
              className="hl-ui-sidebar"
              x="8"
              y="8"
              width="33"
              height="90"
            />
            <rect
              className="hl-ink"
              x="15"
              y="16"
              width="8"
              height="8"
              rx="1"
            />
            {[34, 43, 52, 61].map((y, i) => (
              <rect
                key={y}
                className="hl-ui-muted"
                x="15"
                y={y}
                width={i === 1 ? 15 : 19}
                height="2"
                rx="1"
              />
            ))}
            <text className="hl-screen-heading" x="49" y="22">
              CONTROL / 01
            </text>
            <rect
              className="hl-ui-card"
              x="48"
              y="31"
              width="91"
              height="39"
              rx="3"
            />
            <text className="hl-screen-label" x="55" y="43">
              DEVICE
            </text>
            <text
              className="hl-screen-value"
              x="55"
              y="60"
              data-bench-screen-status
            >
              READY
            </text>
            <rect
              className="hl-toggle-bg"
              x="112"
              y="46"
              width="20"
              height="10"
              rx="5"
            />
            <circle
              className="hl-toggle-dot"
              data-bench-toggle
              cx="117"
              cy="51"
              r="3.5"
            />
            <rect
              className="hl-ui-card"
              x="48"
              y="76"
              width="91"
              height="14"
              rx="2"
            />
            <path
              className="hl-check"
              data-bench-check
              opacity="0"
              d="m55 83 3 3 6-6"
            />
            <text className="hl-screen-label" x="69" y="85" data-bench-ack>
              WAITING
            </text>
          </g>
        </g>
        <path className="hl-rule iso-line" d="M0 104H156" />
        <circle className="hl-lamp-muted" cx="147" cy="108" r="1.3" />
      </Front>
      {[-142, 12].flatMap((x) =>
        [82, 193].map((z) => (
          <Screw key={`${x}-${z}`} x={x} y={-56.6} z={z} front />
        )),
      )}
      <Top z={199}>
        {Array.from({ length: 8 }, (_, i) => (
          <rect
            key={i}
            className="hl-vent"
            x={-125 + i * 16}
            y="-67"
            width="9"
            height="3"
            rx="1"
          />
        ))}
      </Top>
    </g>
  );
}

function Keyboard() {
  return (
    <g>
      <Box x={-145} y={32} z={19} w={144} d={63} h={7} r={5} />
      <Box x={-140} y={37} z={26} w={134} d={53} h={1} r={3} tone="hl-dark" />
      {Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: 10 }, (_, col) => (
          <Box
            key={`${row}-${col}`}
            x={-136 + col * 12.6}
            y={41 + row * 10.8}
            z={27}
            w={10}
            d={8}
            h={2.5}
            r={1}
          />
        )),
      )}
      <Box x={-103} y={84} z={27} w={59} d={4} h={2} r={1} />
    </g>
  );
}

function CircuitBoard() {
  return (
    <g data-bench-board transform={translateAlong(camera, [0, 0, 62])}>
      <Box x={43} y={-33} z={32} w={101} d={87} h={2.4} r={3} tone="hl-pcb" />
      <Top z={34.5}>
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            className="hl-trace iso-line"
            d={`M${56 + i * 6} -24V${-11 + i * 5}H${80 + i * 5}V38`}
          />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <circle className="hl-pad" cx={56 + i * 6} cy={-24} r="1.8" />
            <circle className="hl-pad" cx={80 + i * 5} cy="38" r="1.8" />
          </g>
        ))}
      </Top>
      <Box x={75} y={-9} z={34.5} w={27} d={27} h={4} tone="hl-dark" />
      {Array.from({ length: 4 }, (_, i) => (
        <g key={i}>
          <Box
            x={72}
            y={-5 + i * 5}
            z={34.5}
            w={3}
            d={2}
            h={1.3}
            tone="hl-metal"
          />
          <Box
            x={102}
            y={-5 + i * 5}
            z={34.5}
            w={3}
            d={2}
            h={1.3}
            tone="hl-metal"
          />
        </g>
      ))}
      {[49, 127].map((x) => (
        <g key={x}>
          <Box x={x} y={-17} z={34.5} w={9} d={49} h={6} tone="hl-dark" />
          {Array.from({ length: 6 }, (_, i) => (
            <Box
              key={i}
              x={x + 2}
              y={-14 + i * 7}
              z={40.5}
              w={5}
              d={2}
              h={1}
              tone="hl-metal"
            />
          ))}
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <Box key={i} x={111} y={-11 + i * 11} z={34.5} w={8} d={4} h={2} />
      ))}
      {[48, 139].flatMap((x) =>
        [-28, 49].map((y) => <Screw key={`${x}-${y}`} x={x} y={y} z={34.5} />),
      )}
      <Top z={38.6}>
        <path
          className="hl-chip-mark iso-line"
          data-free=""
          d="M80 -3H97M80 1H91"
        />
      </Top>
    </g>
  );
}

function Controller() {
  return (
    <g>
      <Box x={34} y={-45} z={19} w={119} d={118} h={5} r={5} />
      <Box x={34} y={-45} z={24} w={119} d={5} h={17} r={1} />
      <Box x={34} y={-40} z={24} w={5} d={108} h={17} />
      <Box x={148} y={-40} z={24} w={5} d={108} h={17} />
      {[48, 139].flatMap((x) =>
        [-28, 49].map((y) => (
          <Box
            key={`${x}-${y}`}
            x={x - 3}
            y={y - 3}
            z={24}
            w={6}
            d={6}
            h={8}
            tone="hl-metal"
          />
        )),
      )}
      <CircuitBoard />
      <g data-bench-panel transform={translateAlong(camera, [0, 44, 0])}>
        <Box x={34} y={68} z={24} w={119} d={5} h={51} r={1} />
        <Front x={43} y={73.1} z={69}>
          <rect className="hl-bezel" width="100" height="31" rx="2" />
          <rect
            className="hl-glass"
            x="3"
            y="3"
            width="94"
            height="25"
            rx="1"
          />
          <g clipPath="url(#hl-device-clip)">
            <text className="hl-screen-label" x="9" y="12">
              MODULE / 01
            </text>
            <text
              className="hl-screen-value"
              x="9"
              y="23"
              data-bench-device-status
            >
              STANDBY
            </text>
            <rect
              className="hl-device-lamp"
              data-bench-lamp
              x="80"
              y="10"
              width="10"
              height="12"
              rx="2"
            />
          </g>
          <rect
            className="hl-button"
            x="3"
            y="36"
            width="14"
            height="6"
            rx="1"
          />
          <rect
            className="hl-button"
            x="23"
            y="36"
            width="14"
            height="6"
            rx="1"
          />
          <path
            className="hl-rule iso-line"
            d="M76 36V42M81 36V42M86 36V42M91 36V42M96 36V42M76 36H96M76 42H96"
          />
        </Front>
        {[38, 149].flatMap((x) =>
          [29, 70].map((z) => (
            <Screw key={`${x}-${z}`} x={x} y={73.2} z={z} front />
          )),
        )}
      </g>
    </g>
  );
}

function Bench() {
  return (
    <g key="bench-art">
      <defs>
        <clipPath id="hl-monitor-clip">
          <rect x="8" y="8" width="140" height="90" rx="1" />
        </clipPath>
        <clipPath id="hl-device-clip">
          <rect x="3" y="3" width="94" height="25" rx="1" />
        </clipPath>
      </defs>
      <Base />
      <Box x={-27} y={-28} z={19} w={62} d={49} h={1} r={3} tone="hl-pcb" />
      <Top z={20.1}>
        <path
          className="hl-bus iso-line"
          data-bench-route
          d="M-27 -13H-10V-6H35"
        />
        <path
          className="hl-bus iso-line"
          data-bench-return
          d="M35 5H-19V-4H-27"
        />
        {[
          [-27, -13],
          [35, -6],
          [35, 5],
          [-27, -4],
        ].map(([x, y]) => (
          <rect
            key={`${x}-${y}`}
            className="hl-pad"
            x={x - 2}
            y={y - 2}
            width="4"
            height="4"
            rx="1"
          />
        ))}
        <circle data-bench-command className="hl-signal" r="2.3" opacity="0" />
        <circle data-bench-response className="hl-signal" r="2.3" opacity="0" />
      </Top>
      <Monitor />
      <Controller />
      <Keyboard />
    </g>
  );
}

function PlotterBed() {
  return (
    <g>
      <Base plotter />
      <Box x={-130} y={-88} z={19} w={260} d={184} h={6} r={4} tone="hl-dark" />
      <Box
        x={-119}
        y={-77}
        z={25}
        w={238}
        d={169}
        h={1}
        r={1}
        tone="hl-paper"
      />
      <Top z={26.1}>
        {drawing.map((points, i) => (
          <path
            key={i}
            data-plot-stroke={i}
            className="hl-plot-ink iso-line"
            data-free=""
            d={pathOf(points.map(([x, y]) => [x, y]))}
            strokeDasharray={strokeLengths[i]}
            strokeDashoffset={strokeLengths[i]}
          />
        ))}
      </Top>
      {[-122, 110].flatMap((x) =>
        [-73, 81].map((y) => (
          <g key={`${x}-${y}`}>
            <Box x={x} y={y} z={25} w={12} d={8} h={2} tone="hl-metal" />
            <Screw x={x + 6} y={y + 4} z={27.1} />
          </g>
        )),
      )}
      {[-151, 138].map((x) => (
        <g key={x}>
          <Box x={x} y={-91} z={19} w={13} d={191} h={9} r={2} tone="hl-dark" />
          <Box x={x + 3} y={-86} z={28} w={7} d={181} h={3} tone="hl-metal" />
          <Top z={31.1}>
            <rect
              className="hl-belt"
              x={x + 5}
              y="-86"
              width="3"
              height="181"
            />
          </Top>
          {[-94, 96].map((y) => (
            <g key={y}>
              <Box x={x - 2} y={y} z={19} w={17} d={6} h={15} r={2} />
              <Screw x={x + 6} y={y + 3} z={34} />
            </g>
          ))}
        </g>
      ))}
      <Top z={19.2}>
        <rect
          className="hl-ruler"
          x="-128"
          y="102"
          width="254"
          height="8"
          rx="1"
        />
        {Array.from({ length: 51 }, (_, i) => (
          <path
            key={i}
            className="hl-rule iso-line"
            d={`M${-126 + i * 5} 102v${i % 5 ? 3 : 6}`}
          />
        ))}
      </Top>
    </g>
  );
}

function Gantry() {
  return (
    <g data-plot-gantry transform={translateAlong(camera, [0, -67, 0])}>
      {[-154, 135].map((x) => (
        <g key={x}>
          <Box x={x} y={-19} z={31} w={19} d={32} h={6} r={2} tone="hl-dark" />
          <Box x={x + 3} y={-15} z={37} w={13} d={15} h={27} tone="hl-metal" />
          {[-13, 7].map((y) => (
            <Screw key={y} x={x + 9} y={y} z={37.1} />
          ))}
        </g>
      ))}
      <Box x={-151} y={-15} z={64} w={302} d={13} h={16} r={2} />
      <Box x={-137} y={-1.9} z={67} w={274} d={2} h={3} tone="hl-dark" />
      <Box x={-137} y={-1.9} z={76} w={274} d={2} h={2} tone="hl-metal" />
      <Front x={-136} y={0.2} z={74}>
        <rect className="hl-belt" width="272" height="3" />
        {Array.from({ length: 68 }, (_, i) => (
          <path
            key={i}
            className="hl-belt-tooth iso-line"
            d={`M${i * 4} 0v3`}
          />
        ))}
      </Front>
      <Box x={137} y={-19} z={64} w={22} d={22} h={27} r={2} tone="hl-dark" />
      <Box x={138} y={-18} z={91} w={20} d={20} h={2} tone="hl-metal" />
      <Top z={93.1}>
        {Array.from({ length: 5 }, (_, i) => (
          <rect
            key={i}
            className="hl-vent"
            x="142"
            y={-14 + i * 3}
            width="12"
            height="1.4"
            rx="0.7"
          />
        ))}
      </Top>
      <g data-plot-carriage transform={translateAlong(camera, [-119, 0, 0])}>
        <Box x={-12} y={0.2} z={60} w={24} d={6} h={24} r={2} tone="hl-dark" />
        <Box x={-10} y={6.2} z={62} w={20} d={3} h={20} r={1} />
        <Box x={-6} y={1} z={44} w={12} d={8} h={18} tone="hl-metal" />
        <g data-plot-pen>
          <Box x={-3} y={2} z={30} w={6} d={6} h={44} r={1} tone="hl-pen" />
          <Box x={-1} y={4} z={26.1} w={2} d={2} h={3.9} r={0} tone="hl-dark" />
          <Box x={-4} y={1} z={52} w={8} d={8} h={4} tone="hl-dark" />
        </g>
        {[-7, 7].map((x) => (
          <Screw key={x} x={x} y={9.3} z={77} front />
        ))}
      </g>
    </g>
  );
}

function Plotter() {
  return (
    <g key="plotter-art" transform="translate(0 -55)">
      <PlotterBed />
      <Gantry />
      <Box x={80} y={109} z={19} w={70} d={12} h={19} r={2} tone="hl-dark" />
      <Front x={85} y={121.1} z={34}>
        <rect className="hl-glass" width="33" height="10" rx="1" />
        <text className="hl-screen-label" x="3" y="7" data-plot-display>
          READY
        </text>
        {[39, 48, 57].map((x) => (
          <rect
            key={x}
            className="hl-button"
            x={x}
            y="2"
            width="5"
            height="6"
            rx="1"
          />
        ))}
      </Front>
    </g>
  );
}

export function HeroLabArt({
  concept,
}: {
  concept: Exclude<Concept, "portrait">;
}) {
  return (
    <svg
      key={concept}
      className="hl-art"
      viewBox="0 0 700 500"
      aria-hidden="true"
    >
      {concept === "bench" ? <Bench /> : <Plotter />}
    </svg>
  );
}
