import type { Track } from "@/lib/projects";

const shapes: Record<Track, React.ReactNode> = {
  software: (
    <>
      <rect x="4" y="7" width="32" height="26" />
      <path d="M4 13h32M16 19l-5 4 5 4m8-8 5 4-5 4" />
      <path d="M8 10h2m3 0h2" />
    </>
  ),
  hardware: (
    <>
      <rect x="10" y="10" width="20" height="20" />
      <rect x="16" y="16" width="8" height="8" />
      <path d="M14 4v6m6-6v6m6-6v6M14 30v6m6-6v6m6-6v6M4 14h6m-6 6h6m-6 6h6m20-12h6m-6 6h6m-6 6h6" />
    </>
  ),
  ai: (
    <>
      <path d="M24 10l4 10 9 4-9 4-4 10-4-10-9-4 9-4 4-10ZM9 3l2.5 5.5L17 11l-5.5 2.5L9 19l-2.5-5.5L1 11l5.5-2.5L9 3Z" />
      <path d="M7 29v6m-3-3h6" />
    </>
  ),
  "3d": (
    <>
      <path d="m20 4 14 8v16l-14 8-14-8V12L20 4Z" />
      <path d="m6 12 14 8 14-8M20 20v16M13 8l14 8" />
    </>
  ),
};

export function TrackIcon({
  track,
  className = "size-10",
}: {
  track: Track;
  className?: string;
}) {
  return (
    <svg
      className={`track-symbol shrink-0 ${className}`}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {shapes[track]}
    </svg>
  );
}
