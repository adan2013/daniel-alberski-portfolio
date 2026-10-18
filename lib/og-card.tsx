import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";
export const siteHost = "danielalberski.adanit.pl";

const colors = {
  bg: "#f6f7fa",
  ink: "#14243b",
  muted: "#536176",
  accent: "#b32636",
  line: "#d5dce6",
};

const fonts = Promise.all([
  readFile(join(process.cwd(), "assets/og/BebasNeue-Regular.ttf")),
  readFile(join(process.cwd(), "assets/og/Geist-Regular.ttf")),
]).then(([bebas, geist]) => [
  { name: "Bebas Neue", data: bebas, weight: 400 as const },
  { name: "Geist", data: geist, weight: 400 as const },
]);

export async function publicImageDataUrl(src: string) {
  const data = await readFile(join(process.cwd(), "public", src));
  return `data:image/jpeg;base64,${data.toString("base64")}`;
}

function Mark({ size }: { size: number }) {
  const cell = size * (20 / 64);
  const gap = size * (4 / 64);
  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", width: cell * 2 + gap, gap }}
    >
      <div style={{ width: cell, height: cell, background: colors.ink }} />
      <div style={{ width: cell, height: cell, background: colors.ink }} />
      <div style={{ width: cell, height: cell }} />
      <div style={{ width: cell, height: cell, background: colors.ink }} />
    </div>
  );
}

export async function ogCard({
  eyebrow,
  title,
  subtitle,
  footer,
  image,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: string;
  image?: string;
}) {
  const textWidth = image ? 560 : 1056;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: colors.bg,
        color: colors.ink,
        fontFamily: "Geist",
        borderTop: `12px solid ${colors.accent}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Mark size={48} />
        <div style={{ fontSize: 26, color: colors.muted, letterSpacing: 1 }}>
          {siteHost}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
        <div
          style={{ display: "flex", flexDirection: "column", width: textWidth }}
        >
          <div
            style={{
              fontSize: 24,
              color: colors.accent,
              letterSpacing: 3,
              marginBottom: 12,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontFamily: "Bebas Neue",
              fontSize: image ? 104 : 168,
              lineHeight: 0.92,
              textTransform: "uppercase",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: image ? 32 : 40,
              lineHeight: 1.3,
              color: colors.muted,
              marginTop: 24,
            }}
          >
            {subtitle}
          </div>
        </div>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            width={440}
            height={275}
            style={{
              objectFit: "cover",
              border: `1px solid ${colors.line}`,
              borderRadius: 8,
            }}
          />
        )}
      </div>

      <div style={{ fontSize: 26, color: colors.ink }}>{footer}</div>
    </div>,
    { ...ogSize, fonts: await fonts },
  );
}
