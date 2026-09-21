"use client";

import { cloneElement, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import type { Locale } from "@/lib/projects";
import { useI18n } from "@/components/i18n-provider";

// This library fetches in the browser; its loading markup is not SSR-stable.
const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((module) => module.GitHubCalendar),
  { ssr: false },
);

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

const theme = {
  light: [
    "var(--soft)",
    "color-mix(in srgb, var(--accent) 30%, var(--soft))",
    "color-mix(in srgb, var(--accent) 50%, var(--soft))",
    "color-mix(in srgb, var(--accent) 75%, var(--soft))",
    "var(--accent)",
  ],
};

export function ContributionCalendar({ locale }: { locale: Locale }) {
  const { t, tList } = useI18n();
  const hydrated = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  const dateFormat = new Intl.DateTimeFormat(
    locale === "pl" ? "pl-PL" : "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    },
  );

  if (!hydrated) {
    return (
      <p className="github-fallback text-[14px]">{t("calendar.fallback")}</p>
    );
  }

  return (
    <div className="graph-content @container min-h-40 text-[12px] text-muted">
      <div
        className="contribution-scroll overflow-x-auto py-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        tabIndex={0}
        role="region"
        aria-label={t("calendar.region")}
      >
        <GitHubCalendar
          username="adan2013"
          year="last"
          colorScheme="light"
          theme={theme}
          blockSize={10}
          blockMargin={3}
          blockRadius={0}
          fontSize={11}
          weekStart={1}
          className="contribution-calendar max-w-none! font-body [&>div:first-child]:overflow-visible!"
          labels={{
            months: tList("calendar.months"),
            totalCount: t("calendar.totalCount"),
            legend: {
              less: t("calendar.less"),
              more: t("calendar.more"),
            },
          }}
          errorMessage={t("calendar.error")}
          renderBlock={(block, activity) => {
            const label = t("calendar.blockLabel", {
              date: dateFormat.format(new Date(activity.date)),
              count: activity.count,
            });
            return cloneElement(
              block,
              { role: "img", "aria-label": label },
              <title>{label}</title>,
            );
          }}
        />
      </div>
      <p className="mt-2 text-[11px] @min-[690px]:hidden">
        {t("calendar.scrollHint")}
      </p>
    </div>
  );
}
