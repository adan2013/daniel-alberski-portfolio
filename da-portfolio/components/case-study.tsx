import { Action } from "@/components/ui/action";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PageShell } from "@/components/ui/page-shell";
import { TagList } from "@/components/ui/tag-list";
import { Suspense } from "react";
import ReactMarkdown from "react-markdown";
import {
  projects,
  tracks,
  projectDate,
  projectName,
  tagLabel,
  type Project,
  type Locale,
} from "@/lib/projects";
import { readCaseStudy } from "@/lib/case-studies";
import { createTranslator } from "@/lib/i18n";
import { localizedPath, projectPath } from "@/lib/localized-routes";
import { Media } from "./media";
import { BackToProjects, NextProjectLink } from "./case-navigation";
import { Video } from "./video";
export async function CaseStudy({
  project: p,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const t = createTranslator(locale);
  const source = await readCaseStudy(p, locale);
  const parts = source.split(/(\[media:\d+\]|\[video\]|\[architecture\])/g);
  const main = projects.filter((p) => p.caseStudy);
  const next =
    main[(main.findIndex((x) => x.slug === p.slug) + 1) % main.length];
  return (
    <PageShell
      as="main"
      id="main"
      className="case-main pt-9.5 max-mobile:pt-5.5"
    >
      <Suspense
        fallback={
          <Action
            className="back-link text-[14px] text-muted"
            href={`${localizedPath(locale)}#projects`}
          >
            {t("caseStudy.back")}
          </Action>
        }
      >
        <BackToProjects locale={locale} />
      </Suspense>
      <header className="case-head pt-12.5 pb-12 [&>.eyebrow]:mb-5 [&>.eyebrow]:text-muted [&>h1]:max-w-275 [&>h1]:text-[clamp(40px,6.8vw,92px)] [&>h1]:font-medium [&>h1]:leading-[1.05] [&>h1]:tracking-[-0.06em] max-mobile:pt-6.5 max-mobile:pb-7.5 max-mobile:[&>h1]:text-[43px]">
        <Eyebrow>
          CASE STUDY /{" "}
          {p.tracks
            .map((t) => tracks.find((x) => x.id === t)!.name[locale])
            .join(" + ")}
        </Eyebrow>
        <h1>{projectName(p, locale)}</h1>
        <p className="case-premise mt-6 max-w-190 text-[clamp(19px,2vw,27px)] leading-[1.45] tracking-tight max-mobile:mt-5 max-mobile:text-[20px]">
          {p.premise[locale]}
        </p>
        <dl className="case-meta mt-9 grid grid-cols-[1fr_2fr_1fr] gap-7.5 border-t border-line pt-6 [&_dt]:mb-2 [&_dt]:text-[11px] [&_dt]:tracking-widest [&_dt]:text-muted [&_dt]:uppercase [&_dd]:max-w-100 [&_dd]:text-[14px] [&_.tags]:mt-1.25 max-tablet:grid-cols-[1fr_2fr] max-tablet:[&>div:last-child]:col-span-full max-mobile:mt-6.5 max-mobile:grid-cols-1 max-mobile:gap-5 max-mobile:[&>div:last-child]:col-auto">
          <div>
            <dt>{t("caseStudy.started")}</dt>
            <dd>{projectDate(p.date, locale)}</dd>
          </div>
          <div>
            <dt>{t("caseStudy.contribution")}</dt>
            <dd>{p.role[locale]}</dd>
          </div>
          <div>
            <dt>{t("caseStudy.technologies")}</dt>
            <dd>
              <TagList>
                {p.tags.map((t) => (
                  <span key={t}>{tagLabel(t, locale)}</span>
                ))}
              </TagList>
            </dd>
          </div>
        </dl>
        <div className="case-links mt-4.5 flex flex-wrap gap-6 [&>a]:text-[13px] [&>a]:text-accent [&>a:hover]:text-white [&>a:focus-visible]:text-white max-mobile:gap-x-5.5 max-mobile:gap-y-2.5 max-mobile:[&>a]:text-[12px]">
          {p.links.map((link) => (
            <Action href={link.url} key={link.url} tone="accent">
              {link.label[locale]}
            </Action>
          ))}
        </div>
      </header>
      <div className="case-cover group/cover mx-auto max-w-250">
        <Media
          media={{ ...p.media[0], ratio: "16/9" }}
          locale={locale}
          priority
        />
      </div>
      <article
        className="case-body mx-auto my-16.25 max-w-185 [&_h2]:mt-13 [&_h2]:mb-5 [&_h2]:text-[30px] [&_h2]:font-medium [&_h2]:leading-tight [&_h2]:tracking-[-0.035em] [&_p]:mb-5.5 [&_p]:text-[18px] [&_p]:leading-[1.75] [&_ul]:pl-5.5 [&_ul]:text-[18px] [&_ul]:text-muted [&_li]:mb-2.5 [&>.media]:my-9.5 [&>.video]:my-9.5 max-mobile:mt-9 max-mobile:[&_h2]:mt-9.5 max-mobile:[&_h2]:text-[27px] max-mobile:[&_p]:text-[17px] print:max-w-full"
        aria-label={t("caseStudy.story")}
      >
        {parts.map((part, i) => {
          const match = part.match(/^\[media:(\d+)\]$/);
          if (match) {
            const m = p.media[Number(match[1])];
            return m ? <Media key={i} media={m} locale={locale} /> : null;
          }
          if (part === "[video]")
            return p.video ? (
              <Video key={i} id={p.video} locale={locale} />
            ) : null;
          if (part === "[architecture]")
            return (
              <div
                key={i}
                className="system-diagram my-8.75 flex items-center justify-between gap-3 border border-line bg-white p-6.25 text-[14px] [&_span]:text-center [&_small]:block [&_small]:text-[11px] [&_small]:text-muted max-mobile:flex-col max-mobile:gap-4 max-mobile:[&>b]:rotate-90"
                aria-label={t("caseStudy.diagramLabel")}
              >
                <span>
                  React
                  <small>{t("caseStudy.tabletInterface")}</small>
                </span>
                <b aria-hidden="true">↔</b>
                <span>
                  Node.js
                  <small>{t("caseStudy.logic")}</small>
                </span>
                <b aria-hidden="true">↔</b>
                <span>
                  Home Assistant
                  <small>{t("caseStudy.deviceCommunication")}</small>
                </span>
              </div>
            );
          return (
            <ReactMarkdown
              key={i}
              components={{
                a: ({ href, children }) =>
                  href ? (
                    <Action href={href} variant="inline">
                      {children}
                    </Action>
                  ) : (
                    children
                  ),
              }}
            >
              {part}
            </ReactMarkdown>
          );
        })}
      </article>
      <nav
        className="case-end flex items-center justify-between gap-7.5 border-t border-line pt-9 pb-16.25 text-[14px] [&_small]:mb-1.5 [&_small]:block [&_small]:text-[11px] [&_small]:text-muted max-mobile:flex-col max-mobile:items-start max-mobile:gap-5 max-mobile:pb-8.75"
        aria-label={t("caseStudy.navigation")}
      >
        <Suspense>
          <BackToProjects locale={locale} />
        </Suspense>
        <Suspense
          fallback={
            <Action
              className="next-project text-right text-[18px] max-mobile:text-left"
              href={projectPath(locale, next.slug)}
            >
              <small>{t("caseStudy.next")}</small>
              {projectName(next, locale)}
            </Action>
          }
        >
          <NextProjectLink
            locale={locale}
            slug={next.slug}
            name={projectName(next, locale)}
          />
        </Suspense>
      </nav>
    </PageShell>
  );
}
