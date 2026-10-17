import type { ReactNode } from "react";
import type { Locale } from "@/lib/projects";
import { SmartHomeLive } from "./live";
import { homeCopy } from "./model";
import { homeNodePositions, homeToggleGeometry } from "./layout";
import "./smart-home.css";

function Shell({
  w,
  h,
  depth = 9,
  children,
}: {
  w: number;
  h: number;
  depth?: number;
  children?: ReactNode;
}) {
  const trim = depth < 4 ? 1.5 : 4;
  return (
    <g className="sh-hardware">
      <ellipse
        cx="0"
        cy={h / 2 + 12}
        rx={w * 0.62}
        ry="12"
        fill="url(#sh-shadow)"
        stroke="none"
      />
      <path
        d={`M${-w / 2} ${-h / 2}l${depth} ${-depth}h${w}l${-depth} ${depth}Z`}
        fill="#c6d1b5"
      />
      <path
        d={`M${w / 2} ${-h / 2}l${depth} ${-depth}v${h}l${-depth} ${depth}Z`}
        fill="#7c916f"
      />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="0" fill="#adbe9b" />
      <rect
        x={-w / 2 + trim}
        y={-h / 2 + trim}
        width={w - trim * 2}
        height={h - trim * 2}
        rx="0"
        fill="none"
        stroke="#d4ddc2"
        strokeWidth=".6"
      />
      {children}
    </g>
  );
}
function Toggle({
  prefix,
  x = 0,
  y = 0,
}: {
  prefix: "phone" | "tablet";
  x?: number;
  y?: number;
}) {
  const { width, radius, travel } = homeToggleGeometry[prefix];
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        data-sh={`${prefix}-toggle-track`}
        x={-width / 2}
        y="-9"
        width={width}
        height="18"
        rx="9"
        fill="#8c9d7d"
      />
      <g data-sh={`${prefix}-on`} opacity="0">
        <rect
          x={-width / 2}
          y="-9"
          width={width}
          height="18"
          rx="9"
          fill="#e5edbd"
        />
      </g>
      <circle
        data-sh={`${prefix}-knob`}
        cx={-travel / 2}
        cy="0"
        r={radius}
        fill="#f1f2e3"
        stroke="#627b53"
        strokeWidth=".7"
      />
      <text data-sh={`${prefix}-text`} x="0" y="24" className="sh-state">
        OFF
      </text>
    </g>
  );
}
function Phone() {
  return (
    <g key="phone-art">
      <Shell w={52} h={100} depth={2.5}>
        <rect x="-23" y="-43" width="46" height="83" rx="0" fill="#e9eddb" />
        <rect x="-12" y="-47" width="22" height="2" rx="1" fill="#536b48" />
        <circle cx="16" cy="-46" r="1.5" fill="#536b48" />
        <rect x="-17" y="-35" width="34" height="8" rx="1" fill="#c0ceac" />
        <rect
          data-sh="phone-tile"
          x="-18"
          y="-20"
          width="36"
          height="47"
          rx="3"
          fill="#d8e1c6"
        />
        <Toggle prefix="phone" y={-3} />
        <circle cy="46" r="2" fill="#6b825b" />
      </Shell>
    </g>
  );
}
function Tablet({ locale }: { locale: Locale }) {
  const copy = homeCopy[locale];
  return (
    <g key="tablet-art">
      <path d="M-55-50h110v11H-55Z" fill="#829874" />
      <defs>
        <radialGradient id="sh-tablet-spill">
          <stop stopColor="#ecc168" stopOpacity=".88" />
          <stop offset=".4" stopColor="#ecc168" stopOpacity=".48" />
          <stop offset="1" stopColor="#e4c57a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[-79, 81].map((x, i) => (
        <g
          key={x}
          data-sh={i === 0 ? "tablet-light-left" : "tablet-light-right"}
          opacity="0"
        >
          <ellipse cx={x} cy="0" rx="15" ry="40" fill="url(#sh-tablet-spill)" />
        </g>
      ))}
      <Shell w={154} h={98} depth={2.5}>
        <rect x="-73" y="-44" width="146" height="88" rx="0" fill="#e9eddb" />
        <clipPath id="sh-tablet-glass">
          <rect x="-72" y="-43" width="144" height="86" rx="0" />
        </clipPath>
        <g clipPath="url(#sh-tablet-glass)">
          <rect x="-68" y="-38" width="53" height="10" rx="1" fill="#c1cfad" />
          <rect x="-68" y="-23" width="53" height="61" rx="3" fill="#d8e1c6" />
          <g transform="translate(-41 -2) scale(.85)">
            <Toggle prefix="tablet" />
          </g>
          <path d="M-9-38v76" stroke="#b3c5a0" strokeWidth=".7" />
          <text x="-3" y="-30" className="sh-notification-heading">
            {copy.notificationTitle}
          </text>
          <circle cx="63" cy="-33" r="6" fill="#c0ceac" stroke="none" />
          <text
            data-sh="tablet-notification-count"
            x="63"
            y="-30.5"
            className="sh-notification-count"
          >
            0
          </text>
          <rect x="-3" y="-20" width="71" height="54" rx="2" fill="#d8e1c6" />
          <g data-sh="tablet-empty">
            <path d="M8-7h47M8 2h33M8 11h40" stroke="#b8c8a6" strokeWidth="2" />
          </g>
          <g data-sh="tablet-notification" opacity="0" data-state="hidden">
            <rect
              x="-3"
              y="-20"
              width="71"
              height="54"
              rx="2"
              fill="#efe1b6"
              stroke="#b39961"
              strokeWidth=".6"
            />
            <rect
              x="-3"
              y="-20"
              width="3"
              height="54"
              rx="1"
              fill="#bc9547"
              stroke="none"
            />
            <path
              d="M8-5v-4a4 4 0 0 1 8 0v4l2 3H6Zm3 5h2"
              fill="none"
              stroke="#8e7037"
              strokeWidth="1"
            />
            <text x="6" y="11" className="sh-notification-body">
              {copy.notificationBody}
            </text>
            <path d="M7 21h44M7 26h31" stroke="#c0a569" strokeWidth="1" />
          </g>
        </g>
        <circle cy="-46.5" r="1" fill="#526a46" />
        {[-74.5, 74.5].flatMap((x) =>
          [-46.5, 46.5].map((y) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r=".7" fill="#667f56" />
          )),
        )}
      </Shell>
      {["translate(-77.5 0)", "matrix(1 -1 0 1 77.6 -.6)"].map(
        (projection, i) => (
          <g key={i} transform={projection}>
            <rect
              x="0"
              y="-33"
              width="1.3"
              height="66"
              rx=".3"
              fill="#b8c5a7"
              stroke="#617653"
              strokeWidth=".35"
            />
            <g
              data-sh={i === 0 ? "tablet-led-left" : "tablet-led-right"}
              opacity="0"
              data-state="off"
            >
              <rect
                x=".2"
                y="-32"
                width=".9"
                height="64"
                rx=".2"
                fill="#ffe4a2"
              />
              <path d="M.6-31v62" stroke="#fff0c0" strokeWidth=".3" />
            </g>
          </g>
        ),
      )}
    </g>
  );
}
function Backend() {
  return (
    <g key="backend-art">
      <path d="M-46 44v8h16v-8m60 0v8h16v-8" fill="#61764f" />
      <Shell w={116} h={92}>
        <rect
          x="-51"
          y="-38"
          width="75"
          height="15"
          rx="2"
          fill="#cbd5b9"
          stroke="#8b9e78"
        />
        <text x="-14" y="-27.5" className="sh-device-label" textAnchor="middle">
          Node.js
        </text>
        <circle cx="-46" cy="-30.5" r="1" fill="#7a9066" />
        <circle cx="19" cy="-30.5" r="1" fill="#7a9066" />
        {[-15, 4, 23].map((y) => (
          <g key={y}>
            <rect
              x="-51"
              y={y - 7}
              width="75"
              height="16"
              rx="2"
              fill="#738865"
              stroke="#526b45"
            />
            <rect
              x="-47"
              y={y - 4}
              width="49"
              height="10"
              rx="1.5"
              fill="#b6c4a5"
            />
            <path
              d={`M-42 ${y - 1}h35M-42 ${y + 3}h35`}
              stroke="#8b9e79"
              strokeWidth=".7"
            />
            <rect
              x="13"
              y={y - 4}
              width="6"
              height="10"
              rx="1"
              fill="#879c70"
            />
            <circle cx="7" cy={y + 1} r="2" fill="#425c37" />
          </g>
        ))}
        <g data-sh="backend-work" opacity="0">
          {[-14, 5, 24].map((y) => (
            <circle key={y} cx="7" cy={y} r="2" fill="#f1d78b" stroke="none" />
          ))}
        </g>
        <rect x="31" y="-38" width="20" height="72" rx="2" fill="#96aa83" />
        <circle cx="41" cy="-27" r="5" fill="#728862" />
        <circle data-sh="backend-idle" cx="41" cy="-27" r="2" fill="#d8e8ad" />
        {[-15, -7].map((y) => (
          <rect
            key={y}
            x="35"
            y={y}
            width="12"
            height="4"
            rx=".6"
            fill="#3f5737"
          />
        ))}
        <path d="M35 6h12v10h-3v3h-6v-3h-3Z" fill="#405a36" />
        {[23, 27, 31].map((y) => (
          <path key={y} d={`M35 ${y}h12`} stroke="#677f54" strokeWidth="1.1" />
        ))}
        {[-52, 52].map((x) => (
          <circle key={x} cx={x} cy="39" r="1" fill="#536e44" />
        ))}
      </Shell>
    </g>
  );
}
function Assistant() {
  return (
    <g key="ha-art" transform="matrix(1 .07 0 1 0 0)">
      <Shell w={108} h={82}>
        <g>
          <rect x="-44" y="-33" width="88" height="51" rx="0" fill="#e3e9d5" />
          {/* Official outline, toned and projected with its fascia at the user's request. */}
          <svg
            aria-hidden="true"
            focusable="false"
            data-sh="ha-official-logo"
            x="-22"
            y="-29"
            width="42"
            height="42"
            viewBox="0 0 240 240"
          >
            <path
              d="M229.39 109.153L130.61 10.3725C124.78 4.5425 115.23 4.5425 109.4 10.3725L10.61 109.153C4.78 114.983 0 126.512 0 134.762V224.762C0 233.012 6.75 239.762 15 239.762H107.27L66.64 199.132C64.55 199.852 62.32 200.262 60 200.262C48.7 200.262 39.5 191.062 39.5 179.762C39.5 168.462 48.7 159.262 60 159.262C71.3 159.262 80.5 168.462 80.5 179.762C80.5 182.092 80.09 184.322 79.37 186.412L111 218.042V102.162C104.2 98.8225 99.5 91.8425 99.5 83.7725C99.5 72.4725 108.7 63.2725 120 63.2725C131.3 63.2725 140.5 72.4725 140.5 83.7725C140.5 91.8425 135.8 98.8225 129 102.162V183.432L160.46 151.972C159.84 150.012 159.5 147.932 159.5 145.772C159.5 134.472 168.7 125.272 180 125.272C191.3 125.272 200.5 134.472 200.5 145.772C200.5 157.072 191.3 166.272 180 166.272C177.5 166.272 175.12 165.802 172.91 164.982L129 208.892V239.772H225C233.25 239.772 240 233.022 240 224.772V134.772C240 126.522 235.23 115.002 229.39 109.162V109.153Z"
              fill="#4d6740"
              stroke="none"
            />
          </svg>
        </g>
        {[-27, 0, 27].map((x) => (
          <rect
            key={x}
            x={x - 8}
            y="23"
            width="16"
            height="9"
            rx="1.5"
            fill="#718760"
            stroke="#516c43"
          />
        ))}
        <g data-sh="ha-route" opacity="0">
          <rect
            x="19"
            y="23"
            width="16"
            height="9"
            rx="1.5"
            fill="#e6edbc"
            stroke="#546e43"
          />
        </g>
      </Shell>
    </g>
  );
}
function Dongle() {
  return (
    <g key="dongle-art" className="sh-hardware">
      <ellipse
        cx="14"
        cy="30"
        rx="79"
        ry="11"
        fill="url(#sh-shadow)"
        stroke="none"
      />
      {/* All connector faces share the same 6,-6 depth vector as the case. */}
      <path d="M60-12l6-6h26l-6 6Z" fill="#e4e9db" />
      <path d="M86-12l6-6v24l-6 6Z" fill="#778b69" />
      <path d="M60-12h26v24H60Z" fill="#cbd5bf" />
      <path d="M88-10l2-2V4l-2 2Z" fill="#3f5737" strokeWidth=".5" />
      {[-7, 3].map((y) => (
        <rect
          key={y}
          x="75"
          y={y}
          width="6"
          height="5"
          rx=".5"
          fill="#687e57"
        />
      ))}
      <path d="M-30-18l6-6h90l-6 6Z" fill="#d0dabe" />
      <path d="M60-18l6-6v36l-6 6Z" fill="#7c916b" />
      <rect x="-30" y="-18" width="90" height="36" rx="0" fill="#aabb95" />
      <rect
        x="-26"
        y="-14"
        width="82"
        height="28"
        rx="0"
        fill="none"
        stroke="#d0dcbc"
        strokeWidth=".6"
      />
      <path d="M-30 8h90" stroke="#8ea27b" strokeWidth=".6" />
      <circle cx="-20" cy="-8" r="1.2" fill="#5d764e" />
      <circle cx="50" cy="-8" r="1.2" fill="#5d764e" />
      <path d="M-6-7h31M-6-2h22" stroke="#7f966b" strokeWidth="1.1" />
      <circle cx="40" cy="1" r="3" fill="#758e61" />
      <circle
        data-sh="dongle-on"
        opacity="0"
        cx="40"
        cy="1"
        r="3"
        fill="#e9eebd"
      />
      <rect x="-48" y="-7" width="18" height="14" rx="1" fill="#8ea16f" />
      {[-45, -41, -37].map((x) => (
        <path key={x} d={`M${x}-7V7`} stroke="#657d50" strokeWidth=".7" />
      ))}
      <path d="M-48 5q-9 0-9-9v-50h9v49Z" fill="#5d764c" />
      <path d="M-57-54v-12q4-6 9 0v12Z" fill="#738a60" />
      <path d="M-55-56v-9" stroke="#9eb28b" strokeWidth="1" />
    </g>
  );
}
function Socket() {
  return (
    <g key="socket-art">
      <Shell w={98} h={120}>
        <rect x="-34" y="-51" width="68" height="64" rx="20" fill="#e5ead6" />
        <ellipse cy="-20" rx="26" ry="26" fill="#c4d1b5" stroke="#819b6d" />
        <ellipse cy="-20" rx="22" ry="22" fill="#edf0df" stroke="#a2b48e" />
        <circle cx="-9" cy="-20" r="3.5" fill="#4f6942" />
        <circle cx="9" cy="-20" r="3.5" fill="#4f6942" />
        <path d="M0-45v7m0 34v7" stroke="#738d5e" strokeWidth="3" />
        <rect
          x="-40"
          y="18"
          width="80"
          height="35"
          rx="4"
          fill="#d8e1c5"
          stroke="#8ca275"
          strokeWidth=".6"
        />
        <circle cx="-29" cy="27" r="4.5" fill="#627c50" stroke="#98ac83" />
        <circle
          data-sh="socket-connected"
          data-state="on"
          cx="-29"
          cy="27"
          r="3.3"
          fill="#bfdc83"
          stroke="none"
        />
        <text x="-18" y="30" className="sh-device-label">
          connected
        </text>
        <circle cx="-29" cy="44" r="4.5" fill="#627c50" stroke="#98ac83" />
        <circle
          data-sh="socket-on"
          data-state="off"
          opacity="0"
          cx="-29"
          cy="44"
          r="3.3"
          fill="#edce7b"
          stroke="none"
        />
        <text x="-18" y="47" className="sh-device-label">
          enabled
        </text>
      </Shell>
    </g>
  );
}
const nodeNames = ["phone", "tablet", "backend", "ha", "dongle", "socket"];
export function SmartHomeAnatomy({ locale }: { locale: Locale }) {
  const copy = homeCopy[locale];
  const parts = [
    <Phone key="phone" />,
    <Tablet key="tablet" locale={locale} />,
    <Backend key="backend" />,
    <Assistant key="ha" />,
    <Dongle key="dongle" />,
    <Socket key="socket" />,
  ];
  const devices = (
    <g key="devices">
      {homeNodePositions.map(([x, y], i) => (
        <g key={nodeNames[i]} transform={`translate(${x} ${y})`}>
          <g data-sh-node={nodeNames[i]}>
            <rect
              className="sh-focus"
              x={i === 1 ? -99 : i === 4 ? -70 : -72}
              y={i === 4 ? -79 : i === 1 ? -65 : -74}
              width={i === 1 ? 202 : i === 4 ? 171 : 144}
              height={i === 4 ? 122 : i === 1 ? 130 : i === 5 ? 149 : 145}
              rx="16"
            />
            {parts[i]}
          </g>
          <text x="0" y="95" className="sh-label">
            {copy.labels[i]}
          </text>
          {i === 2 ? (
            <text x="0" y="110" className="sh-sub-label">
              Node.js
            </text>
          ) : null}
        </g>
      ))}
    </g>
  );
  return <SmartHomeLive locale={locale} devices={devices} />;
}
