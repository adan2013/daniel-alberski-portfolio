"use client";

import { useTranslations } from "@/components/i18n-provider";
import { Action } from "@/components/ui/action";
import { Eyebrow } from "@/components/ui/eyebrow";

export function CoffeeCard() {
  const t = useTranslations();
  return (
    <aside
      aria-labelledby="coffee-title"
      className="flex items-center justify-between gap-8 border border-line bg-page p-8 max-tablet:flex-col max-tablet:items-start max-mobile:gap-6 max-mobile:p-5 print:hidden"
    >
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center bg-accent text-white">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 2v2M10 2v2M14 2v2M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
          </svg>
        </span>
        <div>
          <Eyebrow className="text-muted">
            {t("contact.coffee.eyebrow")}
          </Eyebrow>
          <h3 id="coffee-title" className="mt-1 text-xl font-medium text-ink">
            {t("contact.coffee.title")}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6">
            {t("contact.coffee.description")}
          </p>
        </div>
      </div>
      <Action
        variant="outline"
        href="https://buymeacoffee.com/danielalberski"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("contact.coffee.linkLabel")}
        className="min-h-12 max-w-full shrink-0 px-6"
      >
        Buy me a coffee
      </Action>
    </aside>
  );
}
