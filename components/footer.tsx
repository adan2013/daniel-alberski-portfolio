"use client";

import { useTranslations } from "@/components/i18n-provider";
import { Action } from "@/components/ui/action";
import { PageShell } from "@/components/ui/page-shell";

export function Footer() {
  const t = useTranslations();
  return (
    <PageShell
      as="footer"
      className="footer flex items-center justify-between gap-5 pt-6.25 pb-20 text-[12px] text-muted [&>div]:flex [&>div]:gap-5.5 max-mobile:flex-col max-mobile:items-start max-mobile:gap-1 max-mobile:pt-5.5 max-mobile:text-[10px] max-mobile:[&>div]:w-[calc(100%+1.5rem)] max-mobile:[&>div]:-ml-3 max-mobile:[&>div]:gap-1 max-mobile:[&>div]:whitespace-nowrap"
    >
      <span>
        {t("site.footerCopyright", { year: new Date().getFullYear() })}
      </span>
      <div>
        <Action href="https://github.com/adan2013" icon="github">
          GitHub
        </Action>
        <Action
          href="https://www.linkedin.com/in/daniel-alberski/"
          icon="linkedin"
        >
          LinkedIn
        </Action>
        <Action href="#main" className="back-to-top ml-auto print:hidden">
          <span className="inline-flex items-center gap-2">
            <svg
              className="size-[1.1em] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            {t("site.backToTop")}
          </span>
        </Action>
      </div>
    </PageShell>
  );
}
