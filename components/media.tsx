import Image from "next/image";
import type { Locale, Media as MediaType } from "@/lib/projects";
export function Media({
  media,
  locale,
  priority = false,
}: {
  media: MediaType;
  locale: Locale;
  priority?: boolean;
}) {
  return (
    <figure
      className="media relative min-w-0 w-full overflow-hidden"
      style={{ aspectRatio: media.ratio }}
    >
      {media.src ? (
        <Image
          src={media.src}
          alt={media.alt?.[locale] ?? media.label[locale]}
          fill
          sizes="(max-width: 700px) 100vw, 60vw"
          style={{ objectFit: media.fit === "contain" ? "contain" : "cover" }}
          preload={priority}
        />
      ) : (
        <>
          <span
            className="media-corner absolute top-2.5 left-3.5 text-[20px] font-light"
            aria-hidden="true"
          >
            ＋
          </span>
          <div
            className="media-center absolute inset-0 z-1 flex flex-col items-center justify-center gap-4.5 [&>svg]:bg-[#e5e5e5] [&>svg]:text-[#777] [&>svg]:shadow-[0_0_0_18px_#e5e5e5] group-[.case-cover]/cover:gap-6"
            aria-hidden="true"
          >
            <svg
              aria-hidden="true"
              width="44"
              height="36"
              viewBox="0 0 44 36"
              fill="none"
            >
              <rect
                x="1"
                y="1"
                width="42"
                height="34"
                rx="1"
                stroke="currentColor"
              />
              <circle cx="30" cy="11" r="4" stroke="currentColor" />
              <path d="m1 29 12-13 12 14 7-8 11 12" stroke="currentColor" />
            </svg>
            <span className="media-label max-w-[85%] bg-[#e5e5e5] px-3 py-1.5 text-center text-[12px] leading-normal group-[.case-cover]/cover:text-[14px] max-mobile:group-[.case-cover]/cover:text-[11px]">
              {media.label[locale]}
            </span>
          </div>
          <span
            className="media-format absolute right-3.75 bottom-3 text-[10px] tracking-widest"
            aria-hidden="true"
          >
            {media.ratio.replace("/", " : ")}
          </span>
          <figcaption className="sr-only">{media.label[locale]}</figcaption>
        </>
      )}
    </figure>
  );
}
