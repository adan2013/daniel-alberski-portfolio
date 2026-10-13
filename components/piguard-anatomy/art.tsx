import type { Locale } from "@/lib/projects";
import {
  slabOf,
  sideMatrix,
  type Projection,
  type SolidPaths,
} from "../anatomy/iso-kit";
import { PiGuardLive } from "./live";
import { guardCopy } from "./model";
import "./piguard.css";

// A wall-mounted alarm tells the story: intrusion → local alarm → remote SMS.
// Parts: rear shell, front lid, lid seam, 24 recessed vents, 4 screw seats,
// 4 slotted heads, LED bezel/lens/core, key-switch nut/barrel/slot,
// GSM badge, lower switch, phone shell/screen,
// speaker/camera/button; characters add shoes, trousers, cuffs, hands,
// striped jersey, neck, ears, face, mask, brows, pupils, cap and its folded rim.
const P: Projection = {
  origin: [325, 419],
  scale: 0.94,
  azimuth: 72,
  elevation: 16,
};
function Solid({ paths }: { paths: SolidPaths }) {
  return (
    <g className="pg-solid">
      <path className="pg-solid-fill" d={paths.fill} />
      {paths.shades.map((d, i) =>
        d ? <path key={i} className={`pg-shade-${i}`} d={d} /> : null,
      )}
      <path className="pg-solid-top" d={paths.top} />
      <path className="pg-solid-edge" d={paths.outline} />
      <path className="pg-solid-seam" d={paths.crease} />
      {paths.bevel ? <path className="pg-solid-seam" d={paths.bevel} /> : null}
    </g>
  );
}
const device = (
  <g key="device" transform="translate(-82 10) scale(.82)">
    <Solid
      paths={slabOf(
        { x: -110, y: -25, w: 220, d: 40, r: 6 },
        0,
        190,
        P,
        8,
        1.2,
      )}
    />
    <g transform={sideMatrix([-110, 15], 190, P, "left")}>
      <rect className="pg-lid" x="0" y="0" width="220" height="190" rx="6" />
      <rect
        className="pg-lid-seam"
        x="3"
        y="3"
        width="214"
        height="184"
        rx="4"
      />
      {Array.from({ length: 24 }, (_, i) => (
        <g key={i}>
          <rect
            x={23 + i * 7.35}
            y="17"
            width="3.3"
            height="25"
            rx="1.2"
            fill="#151b1a"
            stroke="#101615"
            strokeWidth=".7"
          />
          <path
            className="iso-line"
            d={`M${24.4 + i * 7.35} 18v23`}
            stroke="#626b65"
            strokeWidth=".65"
          />
        </g>
      ))}
      {[
        [9, 9],
        [211, 9],
        [9, 181],
        [211, 181],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r="4.5" fill="#202725" stroke="#555f58" strokeWidth=".7" />
          <circle r="2.65" fill="#bac0b4" stroke="#e3e5d8" strokeWidth=".55" />
          <path
            className="iso-line"
            d="M-1.6 1.6 1.6-1.6"
            stroke="#4f5950"
            strokeWidth=".9"
          />
        </g>
      ))}
      <text x="22" y="95" className="pg-brand">
        PiGuard
      </text>
      <rect x="159" y="108" width="39" height="15" rx="1.4" fill="#bfc4b8" />
      <text x="178.5" y="119" className="pg-gsm">
        GSM
      </text>
      <g transform="translate(30 150)">
        <circle r="8" fill="#1b2220" stroke="#4e5850" />
        <circle r="5" fill="#861e23" stroke="#b84b4c" strokeWidth=".8" />
        <g data-pg="led">
          <circle r="5" fill="#ee343b" />
          <circle cx="-1" cy="-1" r="2.5" fill="#fff0dd" />
        </g>
      </g>
      <circle
        cx="30"
        cy="170"
        r="3"
        fill="#1c2320"
        stroke="#545d54"
        strokeWidth=".7"
      />
      <g transform="translate(67 156)">
        <path
          d="M-10-7-4-12 6-11 12-4 10 7 4 12-7 10-12 3Z"
          fill="#969e91"
          stroke="#e0e3d8"
        />
        <circle r="9" fill="#d0d3c4" stroke="#424e46" />
        <circle r="6.5" fill="#777e73" stroke="#f1f0df" strokeWidth=".6" />
        <path d="M-1-4h2v8h-2z" fill="#151c19" />
      </g>
    </g>
  </g>
);

function Face({ burglar = false }: { burglar?: boolean }) {
  return (
    <g>
      <ellipse cx="-35" cy="-86" rx="8" ry="11" className="pg-skin" />
      <ellipse cx="35" cy="-86" rx="8" ry="11" className="pg-skin" />
      <path
        d="M-34-113Q-33-141 0-143Q35-141 35-110L33-74Q27-52 3-49Q-23-50-31-70Z"
        className="pg-skin"
      />
      <path
        d="M24-127Q37-115 31-77Q26-58 10-53Q30-53 35-74L36-112Z"
        fill="#d2d6c8"
        stroke="none"
      />
      {burglar ? (
        <>
          <path
            d="M-36-109Q-42-145-10-155Q25-164 38-133L39-113Z"
            className="pg-dark"
          />
          <path d="M-38-117Q0-126 39-116L38-105Q0-114-37-104Z" fill="#626c60" />
          <path d="M-23-138Q-8-152 7-148" className="pg-detail" />
          <path
            d="M-34-101Q-20-108-5-100Q0-97 6-100Q23-107 35-99L31-81Q12-76 2-88Q-12-77-31-83Z"
            className="pg-dark"
          />
        </>
      ) : (
        <path
          d="M-34-102Q-45-131-17-143Q-2-161 17-144Q38-142 39-113L31-97 25-123Q9-115-7-127Q-20-110-31-114Z"
          className="pg-dark"
        />
      )}
      <g data-pg={burglar ? "sly" : "smile"}>
        <ellipse cx="-17" cy="-94" rx="9" ry="5" fill="#f8f7ed" />
        <ellipse cx="18" cy="-94" rx="9" ry="5" fill="#f8f7ed" />
        <circle cx={burglar ? -13 : -15} cy="-93" r="2.8" fill="#28362e" />
        <circle cx={burglar ? 22 : 17} cy="-93" r="2.8" fill="#28362e" />
        <path
          d={
            burglar
              ? "M-26-104-9-99M10-99 27-104"
              : "M-25-104Q-18-108-10-105M10-105Q18-108 25-104"
          }
          className="pg-expression"
        />
        <path
          d={
            burglar
              ? "M-9-68Q9-63 19-77Q10-59-9-68Z"
              : "M-14-70Q0-61 16-72Q2-48-14-70Z"
          }
          fill="#f8f7ed"
          stroke="#4e5c4e"
          strokeWidth="1.4"
        />
      </g>
      <g data-pg={burglar ? "fear" : "shock"} opacity="0">
        <ellipse cx="-17" cy="-94" rx="8" ry="9" fill="#fffef4" />
        <ellipse cx="18" cy="-94" rx="8" ry="9" fill="#fffef4" />
        <circle cx="-16" cy="-93" r="2.5" fill="#28362e" />
        <circle cx="17" cy="-93" r="2.5" fill="#28362e" />
        <path
          d="M-26-111Q-18-117-10-111M10-111Q18-117 27-111"
          className="pg-expression"
        />
        <ellipse cx="3" cy="-65" rx="7" ry="9" fill="#39463b" />
        <path
          d="M-1-60Q3-63 7-60"
          stroke="#a6b09e"
          fill="none"
          strokeWidth="2"
        />
      </g>
      <path d="M1-91-3-79 4-78" className="pg-detail" />
    </g>
  );
}
function JerseyStripes({ clip }: { clip: string }) {
  return (
    <g clipPath={`url(#${clip})`}>
      {[-22, -1, 20, 41, 62].map((y) => (
        <path
          key={y}
          d={`M-90 ${y}Q0 ${y + 8} 90 ${y}`}
          fill="none"
          stroke="#404c42"
          strokeWidth="10"
        />
      ))}
    </g>
  );
}

function Person({ burglar = false }: { burglar?: boolean }) {
  return (
    <g className="pg-person">
      <ellipse
        cx="0"
        cy="165"
        rx="74"
        ry="10"
        fill="url(#pg-shadow)"
        stroke="none"
      />
      <path
        d="M-38 64-36 143-9 143 1 88 13 143 41 143 35 63Z"
        fill={burglar ? "#4c574e" : "#6c7868"}
      />
      <path
        d="M-37 140-42 153Q-57 155-53 164L-8 164-8 141Z"
        className="pg-dark"
      />
      <path d="M13 141 12 164H58Q62 155 42 151L39 139Z" className="pg-dark" />
      <path d="M-52 159H-9M14 159H57" stroke="#8f9b89" strokeWidth="1" />
      <path
        d="M-43-27Q-60-24-65 1L-72 40-58 44-40 7Z"
        fill={burglar ? "#f0f0e5" : "#bbc4b1"}
      />
      {burglar ? <JerseyStripes clip="pg-left-sleeve" /> : null}
      <path
        d="M-73 36Q-84 43-74 58L-61 58Q-51 54-57 43L-61 37Z"
        className="pg-skin"
      />
      <path
        d="M-38-35-17-44H18L40-33Q51-13 46 17L40 70Q0 81-42 70L-46 12Q-50-15-38-35Z"
        fill={burglar ? "#f0f0e5" : "#a7b59b"}
      />
      {burglar ? (
        <JerseyStripes clip="pg-shirt" />
      ) : (
        <>
          <path d="M-4-27V73" className="pg-detail" />
          {[0, 23, 46].map((y) => (
            <circle
              key={y}
              cx="1"
              cy={y}
              r="1.5"
              fill="#697760"
              stroke="none"
            />
          ))}
          <path d="M13 11h21v21Q23 39 13 31Z" fill="#99a98d" strokeWidth=".8" />
        </>
      )}
      <path d="M-15-54V-38Q0-24 18-40L16-56Z" className="pg-skin" />
      {burglar ? (
        <>
          <path d="M41-28Q58-25 64-4L74 20 61 28 43 6Z" fill="#f0f0e5" />
          <JerseyStripes clip="pg-sleeve" />
          <path d="M61 23Q64 38 73 37L82 27Q85 16 74 15Z" className="pg-skin" />
        </>
      ) : (
        <>
          <g data-pg="resting-arm">
            <path d="M39-31Q58-26 61-3L68 42 52 45 41 8Z" fill="#a7b59b" />
            <path d="M52 39 67 37 69 47 53 50Z" fill="#ccd3bf" />
            <path
              d="M54 47Q48 54 55 64Q65 70 72 60L68 47Z"
              className="pg-skin"
            />
          </g>
          <g data-pg="phone-arm" opacity="0" transform="rotate(35 40 -20)">
            <path
              d="M38-31Q55-29 59-9L70 24 87 2 100 10 80 45Q69 57 58 40L40 8Z"
              fill="#a7b59b"
            />
            <path d="M83 5 94-4 104 6 97 17Z" fill="#ccd3bf" />
            <g transform="translate(101 -16) rotate(12)">
              <rect
                x="-13"
                y="-29"
                width="31"
                height="58"
                rx="6"
                fill="#303c33"
                stroke="#18271e"
                strokeWidth="1.5"
              />
              <rect
                x="-9"
                y="-24"
                width="23"
                height="46"
                rx="3"
                fill="#dce2d3"
                stroke="#7a8976"
                strokeWidth=".8"
              />
              <rect
                x="-2"
                y="-22"
                width="9"
                height="2"
                rx="1"
                fill="#465440"
                stroke="none"
              />
              <circle cx="4" cy="25" r="1.2" fill="#84917b" stroke="none" />
              <g data-pg="phone-message" opacity="0">
                <rect
                  x="-5"
                  y="-8"
                  width="16"
                  height="12"
                  rx="2"
                  fill="#f7f8ed"
                />
                <path
                  d="m-5-7 8 6 8-6"
                  fill="none"
                  stroke="#718168"
                  strokeWidth="1"
                />
              </g>
              <path
                d="M-15 8Q-20 3-17-3Q-15-7-11-5L-6 6Q-2 16-7 20L-13 24-19 16Z"
                className="pg-skin"
              />
            </g>
          </g>
        </>
      )}
      <Face burglar={burglar} />
    </g>
  );
}
export function Radio() {
  return (
    <g className="pg-radio">
      <path
        d="M-34-12Q-46 0-34 12M-43-20Q-63 0-43 20M34-12Q46 0 34 12M43-20Q63 0 43 20"
        fill="none"
        stroke="#697d66"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="-25"
        y="-17"
        width="50"
        height="34"
        rx="5"
        fill="#eff1e8"
        stroke="#4d654c"
        strokeWidth="1.5"
      />
      <path
        d="m-24-13 24 17 24-17"
        fill="none"
        stroke="#4d654c"
        strokeWidth="1.5"
      />
    </g>
  );
}
export function PiGuardAnatomy({ locale }: { locale: Locale }) {
  const copy = guardCopy[locale];
  return (
    <PiGuardLive
      locale={locale}
      device={device}
      sensor={
        <g key="sensor" transform="translate(356 284)">
          <ellipse cy="105" rx="49" ry="10" fill="url(#pg-shadow)" />
          <g transform="matrix(-.88 .16 0 1 0 0)">
            <path
              d="M-24-57Q-33-55-33-41V39Q-31 56-15 59H19Q37 55 38 38V-40Q37-56 24-60Z"
              fill="#bdc5b8"
              stroke="#89977f"
              strokeWidth="1"
            />
            <path
              d="M-25-58Q-34-56-34-41V37Q-33 54-17 57H15Q29 55 30 39V-42Q28-56 18-58Z"
              fill="#e6eade"
              stroke="#8c9a82"
              strokeWidth="1"
            />
            <path
              d="M-28-39Q-28-51-17-52H15Q24-51 24-40V35Q23 49 12 50H-15Q-27 47-28 35Z"
              fill="#f2f3e9"
              stroke="#c6cdbb"
              strokeWidth=".8"
            />
            <rect
              x="-8"
              y="-39"
              width="12"
              height="5"
              rx="2.5"
              fill="#9c413e"
              stroke="#73564a"
              strokeWidth=".6"
            />
            <rect
              data-pg="sensor-led"
              opacity="0"
              x="-8"
              y="-39"
              width="12"
              height="5"
              rx="2.5"
              fill="#f4393e"
            />
            <path
              d="M-23-14Q-2-19 21-14L18 31Q0 42-21 31Z"
              fill="#dbe0d2"
              stroke="#a5b198"
              strokeWidth="1"
            />
            <g clipPath="url(#pg-lens)">
              {[-7, 3, 13, 23, 33].map((y) => (
                <path
                  key={y}
                  d={`M-25 ${y}Q0 ${y + 7} 24 ${y}`}
                  fill="none"
                  stroke="#afbaa3"
                  strokeWidth=".75"
                />
              ))}
              {[-15, -6, 3, 12].map((x) => (
                <path
                  key={x}
                  d={`M${x} -17Q${x + 2} 9 ${x} 37`}
                  fill="none"
                  stroke="#bcc6b0"
                  strokeWidth=".65"
                />
              ))}
            </g>
            <path d="M-9 45h14" stroke="#a1ad93" strokeWidth="1" />
            <circle cx="-2" cy="-25" r="1.3" fill="#c3ccb7" />
          </g>
        </g>
      }
      alert={
        <g key="alert" transform="translate(356 216)">
          <path
            d="M-9-59H11L7-22H-5ZM-5-14H7V-2H-5Z"
            fill="#771c28"
            opacity=".18"
            transform="translate(2 3)"
          />
          <path d="M-9-59H11L7-22H-5ZM-5-14H7V-2H-5Z" fill="#c3293b" />
        </g>
      }
      burglar={
        <g key="burglar" transform="translate(523 277) scale(.91)">
          <Person burglar />
        </g>
      }
      recipient={
        <g key="recipient" transform="translate(230 323)">
          <Person />
        </g>
      }
      radio={<Radio key="radio" />}
      message={
        <g key="message" className="pg-message" transform="translate(337 158)">
          <path
            d="M0 12Q0 0 12 0H242Q254 0 254 12V103Q254 115 242 115H30L12 132V115Q0 115 0 103Z"
            fill="#f9faf2"
            stroke="#a7b49e"
            strokeWidth="1"
          />
          <rect x="16" y="17" width="19" height="19" rx="5" fill="#344f38" />
          <path d="M21 23h9v6h-6l-3 3Z" fill="#edf2e6" stroke="none" />
          <text x="45" y="31" className="pg-sender">
            PiGuard GSM
          </text>
          <text x="236" y="31" textAnchor="end" className="pg-time">
            {copy.now}
          </text>
          <text x="17" y="64" className="pg-message-text">
            {copy.message[0]}
          </text>
          <text x="17" y="87" className="pg-message-text">
            {copy.message[1]}
          </text>
        </g>
      }
    />
  );
}
