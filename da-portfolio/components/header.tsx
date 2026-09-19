"use client";

import { useTranslations } from "@/components/i18n-provider";
import { Action } from "@/components/ui/action";
import { PageShell } from "@/components/ui/page-shell";
import { localizedPath } from "@/lib/localized-routes";
import type { Locale } from "@/lib/projects";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const path = usePathname();
  const home = localizedPath(locale);
  const publicPath =
    locale === "pl"
      ? path.replace(/^\/pl(?=\/|$)/, "") || "/"
      : path.replace(/^\/en(?=\/|$)/, "") || "/";
  const other = localizedPath(locale === "pl" ? "en" : "pl", publicPath);

  return (
    <header className="site-header sticky top-0 z-30 border-b border-line bg-page/95 backdrop-blur-lg print:hidden">
      <PageShell className="header-inner flex h-21.75 items-center justify-between gap-6 max-tablet:h-19 max-mobile:h-17.5 max-mobile:gap-2.5">
        <Link
          className="brand flex items-center gap-3 text-[18px] font-semibold tracking-[-0.04em] max-tablet:text-[16px] max-mobile:gap-1.75 max-mobile:text-[13px]"
          href={home}
          aria-label={t("navigation.brandLabel")}
        >
          <span
            className="brand-mark mr-0.75 grid size-5.5 rotate-[-8deg] grid-cols-[9px_9px] gap-0.5 [&>i]:bg-ink [&>i:last-child]:col-start-2 [&>i:last-child]:bg-accent max-mobile:mr-px max-mobile:size-4.25 max-mobile:grid-cols-[7px_7px]"
            aria-hidden="true"
          >
            <i />
            <i />
            <i />
          </span>
          Daniel Alberski
          <span className="brand-dot -ml-3 text-accent max-mobile:-ml-1.75">
            .
          </span>
        </Link>
        <nav
          className="flex shrink-0 items-center gap-5.5 text-[14px] max-tablet:gap-3 max-tablet:text-[13px] max-mobile:gap-1 max-mobile:text-[11px]"
          aria-label={t("navigation.main")}
        >
          <Action href={`${home}#projects`}>{t("navigation.projects")}</Action>
          <Action
            className="about-nav max-mobile:hidden"
            href={`${home}#about`}
          >
            {t("navigation.about")}
          </Action>
          <Action href={`${home}#contact`}>{t("navigation.contact")}</Action>
          <Link
            className={`language relative ml-4 flex min-h-8 w-16 shrink-0 overflow-hidden rounded-none border border-field bg-page text-[12px] leading-4 font-medium transition-colors before:pointer-events-none before:absolute before:inset-0 before:bg-[#203d66] before:content-[''] hover:border-[#203d66] max-tablet:ml-0 max-mobile:w-14 max-mobile:text-[10px] ${locale === "pl" ? "before:[clip-path:polygon(0_0,55%_0,45%_100%,0_100%)]" : "before:[clip-path:polygon(55%_0,100%_0,100%_100%,45%_100%)]"}`}
            href={other}
            hrefLang={locale === "pl" ? "en" : "pl"}
            aria-label={t("navigation.switchLanguage")}
          >
            {(["pl", "en"] as const).map((language) => (
              <span
                key={language}
                lang={language}
                aria-hidden="true"
                className={`relative flex flex-1 items-center justify-center py-1.5 ${locale === language ? "text-white" : "text-muted"}`}
              >
                {language.toUpperCase()}
              </span>
            ))}
          </Link>
        </nav>
      </PageShell>
    </header>
  );
}
