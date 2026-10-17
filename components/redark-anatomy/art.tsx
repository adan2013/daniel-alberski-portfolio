import type { Locale } from "@/lib/projects";
import {
  slabOf,
  topMatrix,
  sideMatrix,
  type SolidPaths,
} from "../anatomy/iso-kit";
import { redarkProjection as P } from "./model";
import { RedarkLive } from "./live";
import "./redark.css";

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
    <g className={`rd-solid rd-${tone}`}>
      <path className="rd-fill" d={paths.fill} />
      {paths.shades.map((d, i) =>
        d ? <path key={i} className={`rd-shade-${i}`} d={d} /> : null,
      )}
      <path className="rd-top" d={paths.top} />
      <path className="rd-seam" d={paths.crease} />
      {paths.bevel ? <path className="rd-seam" d={paths.bevel} /> : null}
      <path className="rd-edge" d={paths.outline} />
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
    <Solid paths={slabOf({ x, y, w, d, r }, z, h, P, 5, 0.6)} tone={tone} />
  );
}
function Bolts({ w, h }: { w: number; h: number }) {
  return (
    <g className="rd-bolts">
      {[
        [0, 0],
        [w, 0],
        [0, h],
        [w, h],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r="1.6" />
          <path d="M-1 0H1" />
        </g>
      ))}
    </g>
  );
}
function WordPressLogo({ size = 25 }: { size?: number }) {
  return (
    <g aria-hidden="true">
      <circle r={size} fill="#e3e8d8" stroke="#8b9d7c" strokeWidth="1.2" />
      <circle r={size - 3.5} fill="none" stroke="#627a53" strokeWidth="1" />
      <text
        y={size * 0.56}
        textAnchor="middle"
        fontFamily="Georgia,serif"
        fontWeight="bold"
        fontSize={size * 1.5}
        fill="#526d44"
      >
        W
      </text>
    </g>
  );
}
function NextLogo({ size = 24 }: { size?: number }) {
  return (
    <g aria-hidden="true">
      <circle r={size} fill="#344c39" />
      <path
        d={`M${-size * 0.42} ${size * 0.4}V${-size * 0.4}L${size * 0.53} ${size * 0.65}M${size * 0.36} ${-size * 0.4}V${size * 0.08}`}
        fill="none"
        stroke="#e3e8d5"
        strokeWidth={size * 0.13}
        strokeLinecap="square"
      />
    </g>
  );
}
function ImageMark({
  x = 0,
  y = 0,
  width = 29,
  height = 20,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={width} height={height} rx="1" fill="#b7c7a3" />
      <circle
        cx={width * 0.73}
        cy={height * 0.26}
        r={height * 0.11}
        fill="#edf0d8"
      />
      <path
        d={`M1 ${height - 1} ${width * 0.36} ${height * 0.3} ${width * 0.6} ${height * 0.7} ${width * 0.78} ${height * 0.45} ${width - 1} ${height - 1}Z`}
        fill="#738e5e"
      />
    </g>
  );
}
function Chain({
  x = 0,
  y = 0,
  broken = false,
}: {
  x?: number;
  y?: number;
  broken?: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="none"
      stroke={broken ? "#a86c59" : "#668451"}
      strokeWidth="1.7"
    >
      <rect
        x="0"
        y="3"
        width="11"
        height="6"
        rx="3"
        transform={broken ? "rotate(-22 5 6)" : undefined}
      />
      <rect
        x="12"
        y="3"
        width="11"
        height="6"
        rx="3"
        transform={broken ? "rotate(22 18 6)" : undefined}
      />
      {broken ? (
        <path d="m9-1 2 3m4-3-2 3m-2 9-2 3m4-3 2 3" />
      ) : (
        <path d="M7 6H16" />
      )}
    </g>
  );
}

const base = (
  <g key="base">
    <ellipse cx="319" cy="420" rx="282" ry="51" fill="url(#rd-shadow)" />
    {[
      [-238, -37],
      [236, -37],
      [-238, 101],
      [236, 101],
    ].map(([x, y], i) => (
      <Box key={i} x={x} y={y} z={-17} w={15} d={16} h={9} r={3} tone="dark" />
    ))}
    <Box x={-250} y={-49} z={-8} w={515} d={177} h={9} r={7} tone="dark" />
    <Box x={-247} y={-46} z={1} w={509} d={171} h={3} r={5} />
    <g transform={top(-238, -37, 4)}>
      <Bolts w={490} h={151} />
    </g>
  </g>
);

const belt = (
  <g key="belt">
    {[-115, 139].map((x) => (
      <g key={x}>
        <Box x={x} y={-3} z={4} w={12} d={12} h={52} tone="dark" />
        <Box x={x} y={81} z={4} w={12} d={12} h={52} tone="dark" />
      </g>
    ))}
    <Box x={-126} y={-4} z={56} w={290} d={9} h={15} />
    <Box x={-126} y={5} z={60} w={290} d={76} h={4} r={4} tone="dark" />
    <Box x={-126} y={5} z={70} w={290} d={76} h={4} r={4} tone="dark" />
    <g transform={top(-126, 5, 74)} clipPath="url(#rd-belt-clip)">
      <g data-rd="belt-treads">
        {Array.from({ length: 28 }, (_, i) => (
          <rect
            key={i}
            x={-20 + i * 12}
            y="1"
            width="1.3"
            height="74"
            fill="#879b74"
          />
        ))}
      </g>
    </g>
    <Box x={-126} y={81} z={56} w={290} d={9} h={15} />
    <g transform={front(-123, 90, 69)}>
      <Bolts w={284} h={10} />
    </g>
    {[-116, 154].map((x, i) => (
      <g key={x} transform={front(x, 90.1, 66)}>
        <circle r="9" fill="#758b65" stroke="#506c45" strokeWidth=".8" />
        <circle r="6.4" fill="#b0bf9d" stroke="#617d53" strokeWidth=".6" />
        <g data-rd={i === 0 ? "roller-left" : "roller-right"}>
          <path d="M-5 0H5M0-5V5" stroke="#70885f" strokeWidth="1" />
          <circle r="2" fill="#5d784e" />
        </g>
      </g>
    ))}
    <g transform={front(-63, 90, 67)}>
      <rect width="143" height="8" rx="1" fill="#a9ba98" stroke="#7f9770" />
      {Array.from({ length: 11 }, (_, i) => (
        <rect
          key={i}
          x={6 + i * 12}
          y="2"
          width="4"
          height="4"
          rx="1"
          fill="#748d63"
        />
      ))}
    </g>
  </g>
);

const scannerBack = (
  <g key="scanner-back">
    {[-60, 45].map((x) => (
      <g key={x}>
        <Box x={x - 3} y={-14} z={4} w={15} d={16} h={5} tone="dark" />
        <Box x={x} y={-11} z={9} w={9} d={9} h={128} />
        <Box x={x + 2} y={-9} z={13} w={5} d={5} h={119} tone="dark" />
      </g>
    ))}
    <Box x={-63} y={-14} z={137} w={120} d={15} h={10} r={3} />
    <g transform={front(-57, 1, 144)}>
      <Bolts w={108} h={4} />
    </g>
  </g>
);
const scannerFront = (
  <g key="scanner-front">
    {[-60, 45].map((x) => (
      <g key={x}>
        <Box x={x - 3} y={94} z={4} w={15} d={16} h={5} tone="dark" />
        <Box x={x} y={97} z={9} w={9} d={9} h={128} />
        <Box x={x + 2} y={99} z={13} w={5} d={5} h={119} tone="dark" />
      </g>
    ))}
    <Box x={-63} y={94} z={137} w={120} d={15} h={10} r={3} />
    <g transform={front(-56, 109, 144)}>
      <Bolts w={105} h={4} />
      <rect x="31" y="-1" width="48" height="7" rx="1" fill="#d4dfc4" />
      <g data-rd="scanner-error" opacity="0">
        <path
          d="m39 0 4 4m0-4-4 4m15-4 4 4m0-4-4 4m15-4 4 4m0-4-4 4"
          stroke="#ad5a45"
          strokeWidth="1.5"
        />
      </g>
      <g data-rd="scanner-ok" opacity="0">
        <path
          d="m39 2 2 2 4-4m10 2 2 2 4-4m10 2 2 2 4-4"
          stroke="#4c713f"
          strokeWidth="1.5"
          fill="none"
        />
      </g>
    </g>
  </g>
);
const scanHead = (
  <g key="scan-head">
    <Box x={-45} y={-9} z={128} w={13} d={114} h={8} r={2} tone="dark" />
    <Box x={-47} y={-12} z={136} w={17} d={15} h={5} />
    <Box x={-47} y={93} z={136} w={17} d={15} h={5} />
    <g transform={top(-43, 4, 136)}>
      <rect width="9" height="87" rx="1" fill="#adbe95" />
      <rect x="3" y="4" width="3" height="79" rx="1" fill="#dce8c5" />
    </g>
  </g>
);

const document = (
  <g key="document">
    <Box x={-209} y={8} z={74} w={80} d={70} h={1.3} r={1} tone="paper" />
    <g transform={top(-209, 8, 75.3)}>
      <g data-rd="raw-content">
        <rect x="7" y="6" width="46" height="3" fill="#7a8f68" />
        <rect
          x="7"
          y="14"
          width="30"
          height="22"
          rx="1"
          fill="#d8deca"
          stroke="#a1ae91"
        />
        <path d="m10 17 24 16m0-16-24 16" stroke="#a6ad99" strokeWidth="1.6" />
        <Chain x={45} y={17} broken />
        <path
          d="M8 43h53M8 48h37m4 0h14M8 53h12m6 0h35M8 58h49"
          className="rd-rule"
          data-free="true"
        />
        <path
          d="m61 38-4 4 4 4m7-8 4 4-4 4"
          fill="none"
          stroke="#9d7c67"
          strokeWidth="1.4"
        />
      </g>
      <g data-rd="error-marks" opacity="0">
        <rect
          x="5"
          y="12"
          width="34"
          height="26"
          rx="2"
          fill="none"
          stroke="#b65c47"
          strokeWidth="2"
        />
        <circle
          cx="57"
          cy="23"
          r="15"
          fill="none"
          stroke="#b65c47"
          strokeWidth="2"
        />
        <circle cx="72" cy="9" r="5" fill="#b65c47" />
        <path d="M72 6V9m0 2v1" stroke="#fff2df" strokeWidth="1.4" />
      </g>
      <g data-rd="corrected-content" opacity="0">
        <rect x="7" y="6" width="46" height="3" fill="#7a8f68" />
        <ImageMark x={7} y={14} width={30} height={22} />
        <Chain x={45} y={17} />
        <path
          d="M8 43h53M8 48h53M8 53h53M8 58h37"
          className="rd-rule"
          data-free="true"
        />
        <path
          d="m55 34 4 4 9-10"
          fill="none"
          stroke="#60864d"
          strokeWidth="2.5"
        />
      </g>
      <g data-rd="mdx-content" opacity="0">
        <rect
          x="5"
          y="4"
          width="70"
          height="62"
          rx="2"
          fill="#e9eddb"
          stroke="#a2b48b"
        />
        <rect x="5" y="4" width="70" height="12" rx="2" fill="#b8caa1" />
        <text x="10" y="13" className="rd-paper-code">
          MDX
        </text>
        <path
          d="m57 7-3 3 3 3m9-6 3 3-3 3m-4-7-2 8"
          fill="none"
          stroke="#5c7a48"
          strokeWidth="1.2"
        />
        <ImageMark x={10} y={21} width={28} height={20} />
        <Chain x={45} y={24} />
        {[46, 53, 60].map((y) => (
          <g key={y}>
            <rect x="10" y={y} width="12" height="2.5" fill="#789c60" />
            <rect
              x="27"
              y={y}
              width={y === 60 ? 28 : 38}
              height="2.5"
              fill="#adbe96"
            />
          </g>
        ))}
        <path
          d="m52 38 4 4 10-10"
          fill="none"
          stroke="#60864d"
          strokeWidth="2"
        />
      </g>
    </g>
  </g>
);

function Computer({ destination = false }: { destination?: boolean }) {
  const x = destination ? 157 : -240;
  const screen = x + 8;
  return (
    <g>
      <Box x={x} y={0} z={4} w={98} d={89} h={69} r={4} />
      <Box x={x + 4} y={4} z={73} w={90} d={81} h={3} r={2} tone="dark" />
      <Box x={x + 29} y={-7} z={76} w={44} d={33} h={5} r={3} />
      <Box x={x + 44} y={-1} z={81} w={14} d={15} h={15} tone="dark" />
      <Box x={x + 4} y={-29} z={95} w={92} d={40} h={99} r={6} />
      <g transform={front(screen, 11, 190)}>
        <rect width="84" height="91" rx="5" fill="#536e4b" stroke="#3c5b38" />
        <rect x="5" y="6" width="74" height="68" rx="3" fill="#d8e1c8" />
        <g clipPath={`url(#rd-${destination ? "next" : "wp"}-screen-clip)`}>
          {destination ? (
            <>
              <g data-rd="next-logo">
                <g transform="translate(42 38)">
                  <NextLogo size={23} />
                </g>
              </g>
              <g data-rd="import-screen" opacity="0">
                <rect x="5" y="6" width="74" height="68" fill="#334c39" />
                <text x="12" y="22" className="rd-display">
                  MDX
                </text>
                {[30, 37, 44, 51, 58].map((y, i) => (
                  <g key={y}>
                    <rect
                      x="12"
                      y={y}
                      width={12 + i * 4}
                      height="2.5"
                      fill="#c4d7a7"
                    />
                    <rect
                      x={29 + i * 4}
                      y={y}
                      width={30 - i * 3}
                      height="2.5"
                      fill="#789b65"
                    />
                  </g>
                ))}
                <path
                  d="m56 61 5 5 10-12"
                  fill="none"
                  stroke="#c6dba9"
                  strokeWidth="2.5"
                />
              </g>
              <g data-rd="website" opacity="0">
                <rect x="5" y="6" width="74" height="68" fill="#e4e8d8" />
                <rect x="5" y="6" width="74" height="10" fill="#bdc9ae" />
                <text x="10" y="13" className="rd-url">
                  /vhs-htpc/
                </text>
                <rect x="11" y="21" width="47" height="3" fill="#546e49" />
                <ImageMark x={11} y={29} width={61} height={23} />
                {[58, 63, 68].map((y) => (
                  <rect
                    key={y}
                    x="11"
                    y={y}
                    width={y === 68 ? 35 : 59}
                    height="1.5"
                    fill="#8b9d7d"
                  />
                ))}
              </g>
            </>
          ) : (
            <>
              <g transform="translate(42 36)">
                <WordPressLogo size={23} />
              </g>
              <rect x="23" y="63" width="38" height="2" fill="#849b72" />
            </>
          )}
        </g>
        <g transform="translate(13 83)">
          {destination ? <NextLogo size={6} /> : <WordPressLogo size={6} />}
        </g>
        <text x="26" y="85" className="rd-small rd-computer-brand">
          {destination ? "Next.js" : "WordPress"}
        </text>
        <circle
          data-rd={destination ? "target-led" : "source-led"}
          cx="74"
          cy="82"
          r="1.8"
          fill="#91a77c"
        />
      </g>
      <g transform={front(x + 8, 89, 63)}>
        <rect width="82" height="12" rx="2" fill="#667f58" stroke="#506f44" />
        <rect x="5" y="3" width="72" height="5" rx="1" fill="#344c39" />
        <g transform="translate(3 24)">
          {Array.from({ length: 12 }, (_, i) => (
            <rect
              key={i}
              x={i * 6}
              width="2.5"
              height="10"
              rx="1"
              fill="#819972"
            />
          ))}
        </g>
        <g transform="translate(0 43)">
          <Bolts w={82} h={7} />
        </g>
      </g>
      {destination ? (
        <>
          <Box x={143} y={4} z={71} w={15} d={77} h={3} tone="dark" />
          <Box x={143} y={1} z={74} w={17} d={4} h={4} />
          <Box x={143} y={81} z={74} w={17} d={4} h={4} />
        </>
      ) : (
        <>
          <Box x={-143} y={4} z={71} w={18} d={77} h={3} tone="dark" />
          <Box x={-143} y={1} z={74} w={20} d={4} h={4} />
          <Box x={-143} y={81} z={74} w={20} d={4} h={4} />
        </>
      )}
    </g>
  );
}
const source = (
  <g key="source">
    <Computer />
  </g>
);
const receiver = (
  <g key="receiver">
    <Computer destination />
  </g>
);
export function RedarkAnatomy({ locale }: { locale: Locale }) {
  return (
    <RedarkLive
      locale={locale}
      base={base}
      belt={belt}
      scannerBack={scannerBack}
      scannerFront={scannerFront}
      scanHead={scanHead}
      document={document}
      source={source}
      receiver={receiver}
    />
  );
}
