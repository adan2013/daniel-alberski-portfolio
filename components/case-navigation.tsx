"use client";
import { Action } from "@/components/ui/action";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/projects";
import { useTranslations } from "@/components/i18n-provider";
import { localizedPath } from "@/lib/localized-routes";
export function BackToProjects({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const base = localizedPath(locale);
  const href = `${base}#${slug}`;
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
