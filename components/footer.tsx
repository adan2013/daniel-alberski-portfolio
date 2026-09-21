"use client";

import { useTranslations } from "@/components/i18n-provider";
import { Action } from "@/components/ui/action";
import { PageShell } from "@/components/ui/page-shell";

export function Footer() {
  const t = useTranslations();
  return (
    <PageShell
      as="footer"
      className="footer flex items-center justify-between gap-5 pt-6.25 pb-20 text-[12px] text-muted [&>div]:flex [&>div]:gap-5.5 max-mobile:items-start max-mobile:gap-2.5 max-mobile:pt-5.5 max-mobile:text-[10px] max-mobile:[&>div]:gap-3.5"
    >
      <span>
        {t("site.footerCopyright", { year: new Date().getFullYear() })}
      </span>
      <div>
        <Action href="https://github.com/adan2013">GitHub</Action>
        <Action href="https://www.linkedin.com/in/daniel-alberski/">
          LinkedIn
        </Action>
      </div>
    </PageShell>
  );
}
