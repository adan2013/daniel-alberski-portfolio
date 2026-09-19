"use client";
import { Action } from "@/components/ui/action";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PageShell } from "@/components/ui/page-shell";
import { TagList } from "@/components/ui/tag-list";
import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import {
  projects,
  tracks,
  projectDate,
  projectName,
  tagLabel,
  type Locale,
  type Track,
  type Project,
} from "@/lib/projects";
import { useTranslations } from "@/components/i18n-provider";
import { projectPath } from "@/lib/localized-routes";
import { Media } from "./media";
import { Geometry } from "./geometry";
import { ProjectFilters } from "./project-filters";
import { TrackIcon } from "./track-icon";
function validFilter(value: string | null): Track | "all" {
  return tracks.some((t) => t.id === value) ? (value as Track) : "all";
}
function subscribe(onChange: () => void) {
  addEventListener("popstate", onChange);
  addEventListener("portfolio-filter", onChange);
  return () => {
    removeEventListener("popstate", onChange);
    removeEventListener("portfolio-filter", onChange);
  };
}
export function Portfolio({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const search = useSyncExternalStore(
    subscribe,
    () => location.search,
    () => "",
  );
  const filter = validFilter(new URLSearchParams(search).get("track"));
  useEffect(() => {
    if (search !== location.search) return;
    let cancelled = false;
    try {
      if (sessionStorage.getItem("restore-portfolio") !== "yes") return;
      const saved = JSON.parse(
        sessionStorage.getItem("portfolio-return") || "null",
      );
      if (saved?.url !== location.pathname + location.search) return;
      document.fonts.ready.then(() => {
        if (cancelled) return;
        sessionStorage.removeItem("restore-portfolio");
        scrollTo({ top: saved.scroll, behavior: "instant" });
      });
    } catch {}
    return () => {
      cancelled = true;
    };
  }, [search]);
  function select(value: Track | "all") {
    const url = new URL(location.href);
    if (value === "all") url.searchParams.delete("track");
    else url.searchParams.set("track", value);
    history.replaceState(null, "", url);
    dispatchEvent(new Event("portfolio-filter"));
  }
  const visible = projects.filter(
    (p) => filter === "all" || p.tracks.includes(filter),
  );
  return (
    <>
      <PageShell
        as="section"
        className="intro relative grid grid-cols-[minmax(0,1.42fr)_minmax(0,1fr)] gap-x-11 max-desktop:grid-cols-[1.35fr_1fr] max-desktop:gap-7 max-mobile:flex max-mobile:flex-col max-mobile:gap-0 print:block"
        aria-labelledby="hero-title"
      >
        <div className="hero-copy pt-14.5 pb-17 min-[1600px]:pt-21.25 max-tablet:pt-11 max-tablet:pb-12.5 max-mobile:pt-9.75 max-mobile:pb-6">
          <Eyebrow layout="flex" size="hero" className="gap-2.5">
            <span className="tiny-square size-1.5 bg-accent" />
            {t("portfolio.hero.eyebrow")}
          </Eyebrow>
          <h1
            id="hero-title"
            className="hero-title mt-8 mb-6.5 font-display text-[clamp(85px,10.7vw,158px)] font-normal leading-[0.94] tracking-[-0.015em] [&>span]:block [&>span]:whitespace-nowrap min-[1600px]:text-[166px] max-desktop:text-[11vw] max-tablet:text-[11.4vw] max-mobile:mt-6 max-mobile:mb-5.75 max-mobile:text-[clamp(65px,20.8vw,118px)] max-mobile:leading-[0.97]"
          >
            <span>SOFTWARE</span>
            <span>
              DEVELOPER<span className="title-period text-accent">.</span>
            </span>
          </h1>
          <p className="hero-subtitle text-[clamp(20px,2vw,28px)] leading-normal tracking-[-0.035em] text-ink max-tablet:text-[21px] max-mobile:leading-[1.45]">
            {t("portfolio.hero.lead")}
            <br />
            <span className="text-muted">{t("portfolio.hero.sublead")}</span>
          </p>
          <div className="hero-actions mt-7.5 flex items-center gap-7 max-tablet:flex-col max-tablet:items-start max-tablet:gap-4.5 max-tablet:[&>.text-link]:-mt-2.5 max-mobile:mt-6.25 max-mobile:flex-row max-mobile:items-center max-mobile:gap-6 max-mobile:[&>.text-link]:mt-0 max-mobile:[&>.text-link]:text-[12px] print:hidden">
            <Action href="#projects" variant="primary">
              {t("portfolio.hero.projects")}
            </Action>
            <Action
              className="text-link text-[14px] font-medium"
              href="#contact"
            >
              {t("portfolio.hero.contact")}
            </Action>
          </div>
          <div className="hero-person mt-11.5 flex items-center gap-5 [&_strong]:text-[17px] [&_strong]:font-medium [&_p]:mt-0.75 [&_p]:max-w-75 [&_p]:text-[14px] max-desktop:mt-8 max-tablet:gap-3.5 max-tablet:[&_strong]:text-[15px] max-tablet:[&_p]:text-[12px] max-mobile:mt-7.5 max-mobile:[&_strong]:text-[16px] max-mobile:[&_p]:text-[13px] max-mobile:[&_p]:max-w-58.75">
            <div
              className="portrait h-28 basis-28 shrink-0 grow-0 overflow-hidden max-tablet:h-22 max-tablet:basis-22"
              role="img"
              aria-label={t("portfolio.hero.portraitLabel")}
            >
              <img
                src="/avatar.png"
                alt="Daniel Alberski"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <strong>{t("portfolio.hero.greeting")}</strong>
              <p>{t("portfolio.hero.bio")}</p>
            </div>
          </div>
        </div>
        <div className="scene-column col-start-2 row-span-2 row-start-1 min-w-0 pt-18.5 pb-17.5 min-[1600px]:pt-23.75 max-tablet:pt-17.5 max-mobile:px-6 max-mobile:pt-4.5 max-mobile:pb-10 print:hidden">
          <Geometry active={filter} />
        </div>
        <section
          id="about"
          aria-labelledby="about-title"
          className="about-copy max-w-162.5 border-t-3 border-accent pt-12 pb-24 max-tablet:pb-18 max-mobile:pt-8 max-mobile:pb-14"
        >
          <Eyebrow className="text-accent">
            01 / {t("portfolio.about.eyebrow")}
          </Eyebrow>
          <h2
            id="about-title"
            className="mt-5 mb-8 text-[clamp(32px,3.2vw,44px)] leading-[1.2] font-medium tracking-[-0.04em] max-mobile:mb-6"
          >
            {t("portfolio.about.title")}
            <br />
            <span className="text-accent">
              {t("portfolio.about.titleAccent")}
            </span>
          </h2>
          <div className="max-w-147.5 space-y-6 text-[17px] leading-[1.75] max-tablet:text-[16px]">
            <p className="text-[19px] text-ink max-mobile:text-[18px]">
              {t("portfolio.about.paragraph1")}
            </p>
            <p>{t("portfolio.about.paragraph2")}</p>
            <p>
              {t("portfolio.about.journeyIntro")}
              <strong>{t("portfolio.about.redarkName")}</strong>
              {t("portfolio.about.redarkText")}
              <strong>{t("portfolio.about.dashboardName")}</strong>
              {t("portfolio.about.dashboardText")}
            </p>
            <p>
              {t("portfolio.about.systemsIntro")}
              <strong>{t("portfolio.about.smartHomeName")}</strong>
              {t("portfolio.about.smartHomeText")}
              <strong>{t("portfolio.about.vhsName")}</strong>
              {t("portfolio.about.vhsText")}
            </p>
            <p>
              {t("portfolio.about.aiPrefix")}
              <strong>{t("portfolio.about.gaugeName")}</strong>
              {t("portfolio.about.aiMiddle")}
              <strong>{t("portfolio.about.piguardName")}</strong>
              {t("portfolio.about.aiSuffix")}
            </p>
          </div>
          <Action
            variant="curtain"
            tone="accent"
            className="text-link mt-8 border border-accent text-[14px] font-medium text-accent"
            href="https://www.linkedin.com/in/daniel-alberski/"
          >
            {t("portfolio.about.linkedin")}
          </Action>
        </section>
      </PageShell>
      <PageShell
        as="section"
        className="project-section border-t border-line pt-16.25 max-mobile:pt-9.5"
        id="projects"
        aria-labelledby="projects-title"
      >
        <div className="section-heading mb-11 flex items-end justify-between gap-15 [&_h2]:mt-5.5 [&_h2]:text-[clamp(34px,3.4vw,49px)] [&_h2]:font-medium [&_h2]:leading-[1.15] [&_h2]:tracking-[-0.045em] [&_h2_span]:text-muted [&>p]:max-w-82.5 [&>p]:pb-1 [&>p]:text-[16px] max-tablet:gap-7.5 max-tablet:[&>p]:max-w-57.5 max-tablet:[&>p]:text-[14px] max-mobile:mb-6.75 max-mobile:block max-mobile:[&_h2]:mt-4.5 max-mobile:[&_h2]:text-[34px] max-mobile:[&>p]:mt-5.25 max-mobile:[&>p]:max-w-90 max-mobile:[&>p]:text-[15px]">
          <div>
            <Eyebrow>02 / {t("portfolio.projects.eyebrow")}</Eyebrow>
            <h2 id="projects-title">
              {t("portfolio.projects.title")}
              <br />
              <span>{t("portfolio.projects.titleAccent")}</span>
            </h2>
          </div>
          <p>{t("portfolio.projects.intro")}</p>
        </div>
        <ProjectFilters value={filter} onChange={select} locale={locale} />
        <div
          id="project-list"
          className="project-list flex flex-col gap-6.5 max-mobile:gap-6"
        >
          {visible.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              locale={locale}
              filter={filter}
            />
          ))}
        </div>
      </PageShell>
    </>
  );
}
function ProjectCard({
  project: p,
  locale,
  filter,
}: {
  project: Project;
  locale: Locale;
  filter: Track | "all";
}) {
  const t = useTranslations();
  const url = `${projectPath(locale, p.slug)}${filter !== "all" ? `?track=${filter}` : ""}`;
  return (
    <article
      className={`project-card group/project grid scroll-mt-28 grid-cols-[2fr_3fr] border border-line transition-colors duration-200 hover:border-field max-mobile:flex max-mobile:flex-col print:break-inside-avoid ${p.priority} ${p.priority === "main" ? "bg-white" : "bg-page"}`}
      id={p.slug}
      onClickCapture={(e) => {
        if (
          (e.target as HTMLElement)
            .closest("a")
            ?.getAttribute("href")
            ?.includes("/projects/")
        ) {
          try {
            sessionStorage.setItem(
              "portfolio-return",
              JSON.stringify({
                url: location.pathname + location.search,
                scroll: scrollY,
                project: p.slug,
              }),
            );
          } catch {}
        }
      }}
    >
      <div className="project-visual flex min-w-0 items-center p-4 max-tablet:p-3 max-mobile:pb-0">
        {p.caseStudy ? (
          <Link
            href={url}
            className="block w-full"
            aria-label={`${t("portfolio.projects.readMore")} — ${projectName(p, locale)}`}
          >
            <Media media={p.media[0]} locale={locale} />
          </Link>
        ) : (
          <Media media={p.media[0]} locale={locale} />
        )}
      </div>
      <div className="project-copy flex min-w-0 flex-col p-6 pl-4 max-tablet:p-4 max-mobile:p-4">
        <div className="project-meta mb-3 flex items-center justify-between gap-3 text-[11px] text-muted [&>span]:tracking-[0.08em]">
          <time dateTime={p.date}>{projectDate(p.date, locale)}</time>
          {p.caseStudy && (
            <span className="flex items-center gap-2 text-muted before:size-1.5 before:bg-accent before:content-['']">
              {t("portfolio.projects.caseStudy")}
            </span>
          )}
        </div>
        <h3 className="mb-3 text-[28px] font-medium leading-[1.2] tracking-[-0.04em] max-tablet:text-[26px] group-[.secondary]/project:text-[26px]">
          {p.caseStudy ? (
            <Link
              href={url}
              className="transition-colors duration-200 hover:text-accent focus-visible:text-accent"
            >
              {projectName(p, locale)}
            </Link>
          ) : (
            projectName(p, locale)
          )}
        </h3>
        <p className="mb-4 text-[16px] leading-[1.6]">{p.summary[locale]}</p>
        <TagList aria-label={t("portfolio.projects.technologies")}>
          {p.tags.map((tag) => (
            <span key={tag}>{tagLabel(tag, locale)}</span>
          ))}
        </TagList>
        <ul className="project-tracks mt-3 mb-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] leading-normal text-muted">
          {p.tracks.map((track) => (
            <li key={track} className="flex items-center gap-1.5">
              <TrackIcon track={track} className="size-5 text-ink" />
              <span>{tracks.find((t) => t.id === track)!.name[locale]}</span>
            </li>
          ))}
        </ul>
        {(p.caseStudy || p.links.length > 0) && (
          <div className="project-actions mt-auto flex flex-wrap items-stretch gap-2 border-t border-line pt-4 max-mobile:gap-1.5">
            {(p.priority === "main"
              ? p.links.slice(0, p.cardLinkCount ?? 1)
              : p.links
            ).map((link) => (
              <Action
                variant="curtain"
                key={link.url}
                href={link.url}
                className="external-link justify-center border border-field bg-transparent text-center text-[13px] font-medium text-ink hover:border-ink focus-visible:border-ink max-mobile:min-h-10 max-mobile:px-2 max-mobile:py-2 max-mobile:text-[11px]"
              >
                {link.label[locale]}
              </Action>
            ))}
            {p.caseStudy && (
              <Action
                variant="curtain"
                className="read-more ml-auto justify-center border border-ink bg-soft text-center text-[13px] font-medium text-ink hover:border-ink focus-visible:border-ink max-mobile:min-h-10 max-mobile:px-2 max-mobile:py-2 max-mobile:text-[11px] max-mobile:[&_svg]:ml-1.5 max-mobile:[&_svg]:size-3.5"
                href={url}
              >
                {t("portfolio.projects.readMore")}
                <svg
                  className="ml-2 inline-block size-4 align-[-0.2em]"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2.5 8h10M8.5 4l4 4-4 4" />
                </svg>
                <span className="sr-only"> — {projectName(p, locale)}</span>
              </Action>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
