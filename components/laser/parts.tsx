import type { ReactNode } from "react";
import {
  slabOf,
  topMatrix,
  sideMatrix,
  translateAlong,
  type SolidPaths,
} from "../anatomy/iso-kit";
import { camera } from "./model";

// The plotter's bed, gantry and drawing primitives, rebuilt for the laser.
export function Solid({
  shape,
  tone = "",
}: {
  shape: SolidPaths;
  tone?: string;
}) {
  return (
    <g className={`lc-solid ${tone}`}>
      <path className="lc-fill" d={shape.fill} />
      {shape.shades.map((d, i) =>
        d ? <path key={i} className={`lc-shade-${i}`} d={d} /> : null,
      )}
      <path className="lc-top" d={shape.top} />
      <path className="lc-edge" d={shape.outline} />
      <path className="lc-seam" d={shape.crease + (shape.bevel ?? "")} />
    </g>
  );
}
export function Box({
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
export function Screw({
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
      className="lc-screw"
    >
      <circle r="2.1" />
      <path className="iso-line" d="M-1.5 1.5L1.5 -1.5" />
    </g>
  );
}
export function Top({
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
export function Front({
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

export function Base({
  plotter = false,
  label,
}: {
  plotter?: boolean;
  label?: string;
}) {
  return (
    <g>
      <ellipse className="lc-shadow" cx="350" cy="414" rx="228" ry="41" />
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
            tone="lc-dark"
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
        tone="lc-metal"
      />
      <Top z={19}>
        <rect
          className="lc-rule"
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
        <rect className="lc-label-plate" width="60" height="7" rx="1" />
        <text className="lc-engraved" x="4" y="5">
          {label ?? (plotter ? "XY / PRECISION 02" : "DA / WORKBENCH 01")}
        </text>
      </Front>
    </g>
  );
}

export function PlotterBed({
  label,
  sheet,
}: {
  label?: string;
  sheet: ReactNode;
}) {
  return (
    <g>
      <Base plotter label={label} />
      <Box x={-130} y={-88} z={19} w={260} d={184} h={6} r={4} tone="lc-dark" />
      {sheet}
      {[-122, 110].flatMap((x) =>
        [-73, 81].map((y) => (
          <g key={`${x}-${y}`}>
            <Box x={x} y={y} z={25} w={12} d={8} h={2} tone="lc-metal" />
            <Screw x={x + 6} y={y + 4} z={27.1} />
          </g>
        )),
      )}
      {[-151, 138].map((x) => (
        <g key={x}>
          <Box x={x} y={-91} z={19} w={13} d={191} h={9} r={2} tone="lc-dark" />
          <Box x={x + 3} y={-86} z={28} w={7} d={181} h={3} tone="lc-metal" />
          <Top z={31.1}>
            <rect
              className="lc-belt"
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
          className="lc-ruler"
          x="-128"
          y="102"
          width="254"
          height="8"
          rx="1"
        />
        {Array.from({ length: 51 }, (_, i) => (
          <path
            key={i}
            className="lc-rule iso-line"
            d={`M${-126 + i * 5} 102v${i % 5 ? 3 : 6}`}
          />
        ))}
      </Top>
    </g>
  );
}

// The tool hangs below the carriage plates, so it is painted before them;
// the face is drawn in front of the front plate and its screws.
export function Gantry({ tool, face }: { tool: ReactNode; face: ReactNode }) {
  return (
    <g data-plot-gantry transform={translateAlong(camera, [0, -67, 0])}>
      {[-154, 135].map((x) => (
        <g key={x}>
          <Box x={x} y={-19} z={31} w={19} d={32} h={6} r={2} tone="lc-dark" />
          <Box x={x + 3} y={-15} z={37} w={13} d={15} h={27} tone="lc-metal" />
          {[-13, 7].map((y) => (
            <Screw key={y} x={x + 9} y={y} z={37.1} />
          ))}
        </g>
      ))}
      <Box x={-151} y={-15} z={64} w={302} d={13} h={16} r={2} />
      <Box x={-137} y={-1.9} z={67} w={274} d={2} h={3} tone="lc-dark" />
      <Box x={-137} y={-1.9} z={76} w={274} d={2} h={2} tone="lc-metal" />
      <Front x={-136} y={0.2} z={74}>
        <rect className="lc-belt" width="272" height="3" />
        {Array.from({ length: 68 }, (_, i) => (
          <path
            key={i}
            className="lc-belt-tooth iso-line"
            d={`M${i * 4} 0v3`}
          />
        ))}
      </Front>
      <Box x={137} y={-19} z={64} w={22} d={22} h={27} r={2} tone="lc-dark" />
      <Box x={138} y={-18} z={91} w={20} d={20} h={2} tone="lc-metal" />
      <Top z={93.1}>
        {Array.from({ length: 5 }, (_, i) => (
          <rect
            key={i}
            className="lc-vent"
            x="142"
            y={-14 + i * 3}
            width="12"
            height="1.4"
            rx="0.7"
          />
        ))}
      </Top>
      <g data-plot-carriage transform={translateAlong(camera, [-119, 0, 0])}>
        {tool}
        <Box x={-12} y={0.2} z={60} w={24} d={6} h={24} r={2} tone="lc-dark" />
        <Box x={-10} y={6.2} z={62} w={20} d={3} h={20} r={1} />
        {[-7, 7].map((x) => (
          <Screw key={x} x={x} y={9.3} z={77} front />
        ))}
        {face}
      </g>
    </g>
  );
}
