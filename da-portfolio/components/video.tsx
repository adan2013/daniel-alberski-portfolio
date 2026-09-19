import type { Locale } from "@/lib/projects";
import { createTranslator } from "@/lib/i18n";

export function Video({ id, locale }: { id: string; locale: Locale }) {
  const t = createTranslator(locale);
  return (
    <figure className="video">
      <iframe
        className="aspect-video w-full border-0"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title="DIY Arduino Dashboard — ETS2 / ATS"
        loading="eager"
        allow="encrypted-media; picture-in-picture"
        allowFullScreen
      />
      <figcaption className="mt-3 text-[12px] text-muted">
        {t("video.caption")}
      </figcaption>
    </figure>
  );
}
