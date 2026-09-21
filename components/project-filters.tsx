"use client";

import { projects, tracks, type Locale, type Track } from "@/lib/projects";
import { FilterButton } from "./ui/filter-button";
import { TrackIcon } from "./track-icon";
import { useTranslations } from "@/components/i18n-provider";

type Filter = Track | "all";

export function ProjectFilters({
  value,
  onChange,
  locale,
}: {
  value: Filter;
  onChange: (value: Filter) => void;
  locale: Locale;
}) {
  const t = useTranslations();
  const options = [
    {
      id: "all" as const,
      label: t("filters.all"),
      description: null,
      count: projects.length,
    },
    ...tracks.map((track) => ({
      id: track.id,
      label: track.name[locale],
      description: track.description[locale],
      count: projects.filter((project) => project.tracks.includes(track.id))
        .length,
    })),
  ];
  const selected = options.find((option) => option.id === value)!;

  return (
    <fieldset
      className="project-filters mb-7 border border-line bg-soft/40 p-5 max-mobile:p-3 print:hidden"
      aria-describedby="project-filter-hint"
    >
      <legend className="sr-only">{t("filters.legend")}</legend>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="text-[16px] font-medium text-ink" aria-hidden="true">
          {t("filters.legend")}
        </p>
        <p id="project-filter-hint" className="text-[13px] leading-normal">
          {t("filters.hint")}
        </p>
      </div>
      <div className="tracks grid grid-cols-4 gap-3 max-tablet:grid-cols-2 max-mobile:grid-cols-1">
        {options.map((option) => (
          <FilterButton
            key={option.id}
            type="button"
            className={
              option.id === "all"
                ? "all-filter col-span-full flex-row items-center"
                : "track flex-col max-mobile:grid max-mobile:grid-cols-[40px_minmax(0,1fr)] max-mobile:gap-y-2"
            }
            selected={value === option.id}
            aria-controls="project-list"
            onClick={() => onChange(option.id)}
          >
            {option.id !== "all" && (
              <span className="filter-muted mb-1 text-accent group-aria-pressed/filter:text-white max-mobile:mb-0">
                <TrackIcon track={option.id} />
              </span>
            )}
            <span
              className={`flex items-start gap-3 ${option.id === "all" ? "flex-1" : "w-full max-mobile:self-center"}`}
            >
              <span
                className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-field text-[12px] leading-none group-aria-pressed/filter:border-white group-aria-pressed/filter:bg-white group-aria-pressed/filter:text-accent"
                aria-hidden="true"
              >
                {value === option.id ? "✓" : ""}
              </span>
              <strong className="flex-1 text-[17px] leading-snug font-medium tracking-tight max-mobile:text-[16px]">
                {option.label}
              </strong>
              <span
                className="filter-muted min-w-6 text-right text-[13px] leading-6 tabular-nums text-muted group-aria-pressed/filter:text-white"
                aria-label={t("filters.countLabel", {
                  count: option.count,
                })}
              >
                {option.count.toString().padStart(2, "0")}
              </span>
            </span>
            {option.description && (
              <span className="track-description filter-muted max-mobile:col-span-full text-[13px] leading-relaxed text-muted group-aria-pressed/filter:text-white">
                {option.description}
              </span>
            )}
          </FilterButton>
        ))}
      </div>
      <div className="filter-bar mt-4 flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 border-t border-line pt-4 text-[12px]">
        <p aria-live="polite" aria-atomic="true">
          {t("filters.summary", {
            selected: selected.label,
            count: selected.count,
            total: projects.length,
          })}
        </p>
      </div>
    </fieldset>
  );
}
