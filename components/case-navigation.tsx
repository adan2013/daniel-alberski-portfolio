"use client";
import { Action } from "@/components/ui/action";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { tracks, type Locale } from "@/lib/projects";
import { useTranslations } from "@/components/i18n-provider";
import { localizedPath, projectPath } from "@/lib/localized-routes";
export function BackToProjects({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const query = useSearchParams();
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const track = query.get("track");
  const base = `${localizedPath(locale)}${track ? `?track=${encodeURIComponent(track)}` : ""}`;
  const href = `${base}#${params.slug}`;
  return (
    <Action
      className="back-link text-[14px] text-muted"
      href={href}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        try {
          const saved = JSON.parse(
            sessionStorage.getItem("portfolio-return") || "null",
          );
          if (saved?.url === base) {
            e.preventDefault();
            sessionStorage.setItem("restore-portfolio", "yes");
            router.push(href, { scroll: false });
          }
        } catch {}
      }}
    >
      {t("caseStudy.back")}
    </Action>
  );
}

export function NextProjectLink({
  locale,
  slug,
  name,
}: {
  locale: Locale;
  slug: string;
  name: string;
}) {
  const t = useTranslations();
  const query = useSearchParams();
  const requestedTrack = query.get("track");
  const track = tracks.some(({ id }) => id === requestedTrack)
    ? requestedTrack
    : null;
  const href = `${projectPath(locale, slug)}${track ? `?track=${encodeURIComponent(track)}` : ""}`;

  return (
    <Action
      className="next-project text-right text-[18px] max-mobile:text-left"
      href={href}
    >
      <small>{t("caseStudy.next")}</small>
      {name}
    </Action>
  );
}
