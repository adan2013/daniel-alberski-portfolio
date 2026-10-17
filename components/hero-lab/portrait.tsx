import {
  PORTRAIT_SIZE,
  TILE_SIZE,
  portraitTiles,
  portraitPose,
  tileTransform,
} from "./portrait-model";

// Duotone ramps use the portfolio's navy, crimson, slate, paper and sage.
const ramps = [
  ["#14243b", "#dce4f0"],
  ["#471a25", "#df6874"],
  ["#26364b", "#a6b8ce"],
  ["#536176", "#f6f7fa"],
  ["#35472e", "#cbd8bd"],
] as const;
function channels(hex: string) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
}

export function PortraitArt() {
  return (
    <svg
      key="portrait-art"
      className="hl-art hl-portrait-art"
      viewBox="70 0 560 500"
      aria-hidden="true"
    >
      <defs>
        <image
          id="hl-portrait-source"
          href="/hero-portrait.jpg"
          width={PORTRAIT_SIZE}
          height={PORTRAIT_SIZE}
        />
        <clipPath id="hl-portrait-tile-clip">
          <rect width={TILE_SIZE} height={TILE_SIZE} />
        </clipPath>
        <pattern
          id="hl-portrait-scan"
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 0H4" stroke="#14243b" strokeWidth="1" opacity=".28" />
        </pattern>
        {ramps.map(([dark, light], index) => {
          const low = channels(dark),
            high = channels(light);
          return (
            <filter
              key={dark}
              id={`hl-duotone-${index}`}
              x="0"
              y="0"
              width="100%"
              height="100%"
              colorInterpolationFilters="sRGB"
            >
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="table" tableValues={`${low[0]} ${high[0]}`} />
                <feFuncG type="table" tableValues={`${low[1]} ${high[1]}`} />
                <feFuncB type="table" tableValues={`${low[2]} ${high[2]}`} />
              </feComponentTransfer>
            </filter>
          );
        })}
        {portraitTiles.map((tile) => (
          <clipPath key={tile.index} id={`hl-portrait-band-${tile.index}`}>
            <rect y={tile.bandY} width={TILE_SIZE} height={tile.bandHeight} />
            <rect y={tile.bandY + 19} width={TILE_SIZE} height="3" />
          </clipPath>
        ))}
      </defs>
      <g className="hl-portrait-registration" data-portrait-registration>
        <path d="M130 62V30H162M538 30H570V62M130 438V470H162M538 470H570V438" />
        <text x="131" y="19">
          DA / SIGNAL 03
        </text>
        <text x="570" y="19" textAnchor="end">
          5 × 5
        </text>
        <text x="131" y="490" data-portrait-status>
          RECONSTRUCTING
        </text>
        <text x="570" y="490" textAnchor="end" data-portrait-count>
          00 / 25
        </text>
      </g>
      {portraitTiles.map((tile) => {
        const pose = portraitPose(0, tile);
        const imageX = -tile.col * TILE_SIZE,
          imageY = -tile.row * TILE_SIZE;
        return (
          <g
            key={tile.index}
            data-portrait-tile={tile.index}
            transform={tileTransform(pose)}
          >
            <g clipPath="url(#hl-portrait-tile-clip)">
              <use href="#hl-portrait-source" x={imageX} y={imageY} />
              <g data-portrait-tint opacity={pose.tint}>
                <use
                  href="#hl-portrait-source"
                  x={imageX}
                  y={imageY}
                  filter={`url(#hl-duotone-${tile.color})`}
                />
              </g>
              <g data-portrait-glitch opacity={pose.glitch}>
                <g clipPath={`url(#hl-portrait-band-${tile.index})`}>
                  <use
                    data-portrait-slice
                    href="#hl-portrait-source"
                    x={imageX}
                    y={imageY}
                    transform={`translate(${pose.shift} 0)`}
                    filter={`url(#hl-duotone-${(tile.color + 2) % 5})`}
                  />
                  <rect
                    width="80"
                    height="1.4"
                    y={tile.bandY}
                    fill="var(--accent)"
                    opacity=".8"
                  />
                </g>
                <rect
                  width={TILE_SIZE}
                  height={TILE_SIZE}
                  fill="url(#hl-portrait-scan)"
                />
                <rect
                  x={(tile.index * 11) % 55}
                  y={(tile.index * 17) % 62}
                  width={10 + (tile.index % 3) * 7}
                  height="4"
                  fill={tile.color % 2 ? "var(--accent)" : "var(--soft)"}
                  opacity=".6"
                />
              </g>
            </g>
            <g data-portrait-annotation opacity={pose.annotation}>
              <rect
                className="hl-tile-outline"
                x=".5"
                y=".5"
                width="79"
                height="79"
              />
              <rect
                x="5"
                y="63"
                width="20"
                height="12"
                fill="#14243b"
                opacity=".75"
              />
              <text className="hl-tile-index" x="9" y="71">
                {String(tile.index + 1).padStart(2, "0")}
              </text>
            </g>
          </g>
        );
      })}
      <use
        data-portrait-complete
        href="#hl-portrait-source"
        x="150"
        y="50"
        opacity="0"
      />
    </svg>
  );
}
