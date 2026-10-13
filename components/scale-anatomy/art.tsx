import type { Locale } from "@/lib/projects";
import {
  cylinder,
  slabOf,
  ring,
  lineOnTop,
  type SolidPaths,
  type Projection,
} from "../anatomy/iso-kit";
import { scaleAngle, scaleCopy, WEIGHT_KG } from "./model";
import { ScaleAnatomyLive } from "./live";
import "./scale-anatomy.css";

// The kit stays on the server. Only the completed art crosses the client boundary.
const projection: Projection = {
  origin: [287, 440],
  scale: 0.94,
  azimuth: 66,
  elevation: 18,
};
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
  const a = polar(radius, start),
    b = polar(radius, end);
  return `M${a[0]} ${a[1]}A${radius} ${radius} 0 ${end - start > 180 ? 1 : 0} 1 ${b[0]} ${b[1]}`;
}

const base = (
  <g key="base">
    <ellipse className="scale-shadow" cx="290" cy="463" rx="176" ry="31" />
    {[
      [-116, -44],
      [-116, 44],
      [116, -44],
      [116, 44],
    ].map(([x, y], i) => (
      <g key={i}>
        <Solid paths={cylinder(x, y, 10, -13, 7, projection, 32, 1)} />
        <Solid paths={cylinder(x, y, 8, -6, 6, projection, 32, 0.6)} />
      </g>
    ))}
    <Solid
      paths={slabOf(
        { x: -127, y: -65, w: 254, d: 130, r: 19 },
        0,
        15,
        projection,
        12,
        2,
      )}
    />
    <Solid
      paths={slabOf(
        { x: -122, y: -60, w: 244, d: 120, r: 17 },
        15,
        4,
        projection,
        12,
        1,
      )}
    />
    <g className="scale-pedestal">
      <Solid
        paths={slabOf(
          { x: -78, y: -39, w: 156, d: 78, r: 14 },
          19,
          6,
          projection,
          12,
          1,
        )}
      />
      {[-64, 64].map((x) => (
        <g key={x}>
          <path className="scale-edge" d={ring(x, 26, 2, 25, projection, 24)} />
          <path
            className="iso-line scale-seam"
            d={lineOnTop([x - 1.5, 26], [x + 1.5, 26], 25, projection)}
          />
        </g>
      ))}
      <Solid
        paths={slabOf(
          { x: -59, y: -32, w: 118, d: 64, r: 12 },
          25,
          45,
          projection,
          12,
          1.5,
        )}
      />
    </g>
  </g>
);

const mechanism = (
  <g key="mechanism">
    <path
      className="scale-cavity"
      d="M172 229Q175 179 226 165L335 179Q384 198 384 254L366 365L190 376Z"
    />
    <path
      className="scale-metal-side"
      d="M223 206L232 204L232 375L223 377Z M325 216L334 214L334 385L325 387Z"
    />
    <path
      className="scale-metal"
      d="M217 207L223 206L223 377L217 378Z M319 217L325 216L325 387L319 388Z"
    />
    {[218, 354].map((y) => (
      <g key={y}>
        <rect
          className="scale-metal"
          x="213"
          y={y}
          width="23"
          height="9"
          rx="2"
        />
        <rect
          className="scale-metal"
          x="315"
          y={y + 10}
          width="23"
          height="9"
          rx="2"
        />
        <Screw x={224} y={y + 4.5} r={2} />
        <Screw x={326} y={y + 14.5} r={2} />
      </g>
    ))}
    <path className="scale-metal" d="M216 264L338 278L338 292L216 278Z" />
    <circle className="scale-metal-side" cx="278" cy="283" r="20" />
    <circle className="scale-metal" cx="278" cy="283" r="12" />
    <circle className="scale-hub" cx="278" cy="283" r="5" />
    <path className="scale-metal" d="M272 183L285 185L285 227L272 225Z" />
    {Array.from({ length: 10 }, (_, i) => (
      <ellipse
        key={i}
        className="scale-spring"
        cx="278"
        cy={199 + i * 4}
        rx="10"
        ry="3"
      />
    ))}
    <rect
      className="scale-metal"
      x="264"
      y="236"
      width="29"
      height="7"
      rx="2"
    />
    <Screw x={269} y={239} r={2} />
    <Screw x={288} y={239} r={2} />
  </g>
);

const leftShell = (
  <g key="left-shell">
    <path
      className="scale-metal-side"
      d="M144 254Q141 165 216 145L277 160L276 188L200 260L208 365L184 387L158 365Z"
    />
    <path
      className="scale-enamel"
      d="M144 254Q141 173 218 169L277 176L277 198Q182 186 172 262L184 351L277 368L277 394L176 381Q148 377 147 345Z"
    />
    <path
      className="iso-line scale-seam"
      d="M268 187L216 182Q151 187 157 251L158 343Q159 368 179 370L267 383L267 377L184 364Q168 361 168 339L163 257Q161 197 221 190L268 195Z"
    />
    {[214, 238].map((y) => (
      <g key={y}>
        <path
          className="scale-metal"
          d={`M150 ${y}L170 ${y + 2}L170 ${y + 16}L150 ${y + 14}Z`}
        />
        <Screw x={155} y={y + 7} r={2} />
        <Screw x={165} y={y + 9} r={2} />
      </g>
    ))}
    <Screw x={214} y={184} />
    <Screw x={178} y={365} />
  </g>
);
const rightShell = (
  <g key="right-shell">
    <path
      className="scale-metal-side"
      d="M277 160L335 146Q421 160 429 249L421 338Q417 362 386 371L277 394L277 368L357 348L367 248Q366 188 277 188Z"
    />
    <path
      className="scale-enamel"
      d="M277 176L329 184Q398 198 400 267L393 353Q391 383 363 389L277 394L277 368L347 365Q367 361 369 340L375 265Q375 215 325 207L277 198Z"
    />
    <path
      className="iso-line scale-seam"
      d="M285 186L326 195Q387 208 389 266L382 350Q380 375 357 378L285 383L285 375L351 371Q374 367 376 348L382 266Q380 217 326 202L285 195Z"
    />
    {Array.from({ length: 6 }, (_, i) => (
      <path
        key={i}
        className="scale-vent"
        d={`M409 ${243 + i * 12}l9 -4l-1 5l-9 4Z`}
      />
    ))}
    <Screw x={333} y={200} />
    <Screw x={371} y={371} />
    <path className="scale-metal" d="M381 303L403 302L403 316L381 317Z" />
    <ellipse className="scale-metal-side" cx="405" cy="309" rx="6" ry="10" />
    <path
      className="iso-line scale-seam"
      d="M401.4 301L408.6 301M399.5 305L410.5 305M399 309L411 309M399.5 313L410.5 313M401.4 317L408.6 317"
    />
  </g>
);
const trayProjection: Projection = { ...projection, origin: [281, 184] };
const tray = (
  <g key="tray">
    <Solid
      paths={slabOf(
        { x: -14, y: -14, w: 28, d: 28, r: 3 },
        0,
        36,
        trayProjection,
        6,
        1,
      )}
    />
    <Solid
      paths={slabOf(
        { x: -23, y: -20, w: 46, d: 40, r: 5 },
        31,
        6,
        trayProjection,
        6,
        1,
      )}
    />
    <Solid
      paths={slabOf(
        { x: -130, y: -79, w: 260, d: 158, r: 16 },
        37,
        12,
        trayProjection,
        12,
        2,
      )}
    />
    <Solid
      paths={slabOf(
        { x: -121, y: -70, w: 242, d: 140, r: 12 },
        49,
        2,
        trayProjection,
        12,
        1,
      )}
    />
  </g>
);
const weight = (
  <g key="weight" className="scale-weight">
    <Solid paths={cylinder(0, 0, 32, 51, 4, trayProjection, 64, 1)} />
    <Solid paths={cylinder(0, 0, 28, 55, 40, trayProjection, 64, 2)} />
    <Solid paths={cylinder(0, 0, 26, 95, 3, trayProjection, 64, 1)} />
    <Solid paths={cylinder(0, 0, 10, 98, 7, trayProjection, 48, 1)} />
    <Solid paths={cylinder(0, 0, 18, 105, 7, trayProjection, 64, 2)} />
    <text
      className="scale-weight-label"
      transform="matrix(.98 .13 0 1 284 109)"
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
    <g data-dial-layer="0">
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
    <g data-dial-layer="1" className="scale-numerals">
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
    <g data-dial-layer="3">
      <path
        className="scale-warning"
        d={arc(100, scaleAngle(8), scaleAngle(10))}
      />
    </g>
    <g data-dial-layer="4" className="scale-dial-label">
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
    >
      <circle r="7" />
      <path d="M-3 0L-1 2L3 -3" />
    </g>
    <g data-dial-layer="2" transform={`rotate(${scaleAngle(WEIGHT_KG)})`}>
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
  [290, 213],
  [258.5, 223],
  [218, 254],
  [121.4, 318.9],
  [226, 335],
  [218, 355],
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
      leftShell={leftShell}
      rightShell={rightShell}
      tray={tray}
      weight={weight}
      dial={dial}
      layers={layers}
    />
  );
}
