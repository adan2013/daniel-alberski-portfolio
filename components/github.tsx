"use client";

import { Action } from "@/components/ui/action";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PageShell } from "@/components/ui/page-shell";
import type { Locale } from "@/lib/projects";
import { useTranslations } from "@/components/i18n-provider";
import { ContributionCalendar } from "./contribution-calendar";
export function GitHub({ locale }: { locale: Locale }) {
  const t = useTranslations();
  return (
    <PageShell
      as="section"
      className="github-section my-20 grid grid-cols-[1fr_2fr] gap-15 border-y border-line py-8 [&_h2]:mt-3.5 [&_h2]:text-[25px] [&_h2]:tracking-tight max-desktop:grid-cols-1 max-desktop:gap-5 max-mobile:my-12.5 max-mobile:py-6.75"
      aria-labelledby="github-heading"
    >
      <div>
        <Eyebrow>03 / {t("github.eyebrow")}</Eyebrow>
        <h2 id="github-heading">{t("github.title")}</h2>
        <p className="my-2.5 max-w-77.5 text-[14px] max-desktop:max-w-145">
          {t("github.description")}
        </p>
        <Action
          className="text-link text-[14px] font-medium"
          href="https://github.com/adan2013"
        >
          {t("github.visit")}
        </Action>
      </div>
      <div className="min-w-0 self-center">
        <ContributionCalendar locale={locale} />
      </div>
    </PageShell>
  );
}
