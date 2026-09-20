import type { Locale } from "@/lib/projects";
import { createTranslator } from "@/lib/i18n";

export function Video({
  id,
  locale,
  title,
}: {
  id: string;
  locale: Locale;
  title?: string;
}) {
  const t = createTranslator(locale);
  return (
    <figure className="video">
      <iframe
        className="aspect-video w-full border-0"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title ?? "Project video demo"}
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
