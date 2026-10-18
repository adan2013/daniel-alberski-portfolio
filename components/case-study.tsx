import { Action } from "@/components/ui/action";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PageShell } from "@/components/ui/page-shell";
import { TagList } from "@/components/ui/tag-list";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import {
  projects,
  tracks,
  projectDate,
  linkUrl,
  projectName,
  tagLabel,
  type Project,
  type Locale,
} from "@/lib/projects";
import { readCaseStudy } from "@/lib/case-studies";
import { createTranslator } from "@/lib/i18n";
import { projectPath } from "@/lib/localized-routes";
import { Media } from "./media";
import { BackToProjects } from "./case-navigation";
import { Video } from "./video";
import { CaseStudyStory } from "./case-study-story";
import { Contact } from "./contact";
export async function CaseStudy({
  project: p,
  locale,
  animation,
}: {
  project: Project;
  locale: Locale;
  animation?: ReactNode;
}) {
  const t = createTranslator(locale);
  const source = await readCaseStudy(p, locale);
  const parts = source.split(
    /(\[media:\d+\]|\[video\]|\[architecture\]|\[hero\])/g,
  );
  const main = projects.filter((p) => p.caseStudy);
  const next =
    main[(main.findIndex((x) => x.slug === p.slug) + 1) % main.length];
  return (
    <main id="main" className="case-main">
      <PageShell className="pt-9.5 max-mobile:pt-5.5">
        <BackToProjects locale={locale} slug={p.slug} />
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
          <div className="case-links mt-7 grid grid-cols-4 gap-3 max-tablet:grid-cols-2 max-mobile:mt-6 max-mobile:flex max-mobile:flex-wrap max-mobile:gap-1.5">
            {p.links.map((link) => (
              <Action
                href={linkUrl(link, locale)}
                icon={link.icon}
                key={linkUrl(link, locale)}
                variant="tile"
                tone="accent"
              >
                {link.label[locale]}
              </Action>
            ))}
          </div>
        </header>
        <CaseStudyStory locale={locale} animation={animation}>
          <article
            className="case-body mx-auto my-16.25 max-w-185 [&>h2]:mt-13 [&>h2]:mb-5 [&>h2]:text-[30px] [&>h2]:font-medium [&>h2]:leading-tight [&>h2]:tracking-[-0.035em] [&>p]:mb-5.5 [&>p]:text-[18px] [&>p]:leading-[1.75] [&>ul]:pl-5.5 [&>ul]:text-[18px] [&>ul]:text-muted [&>ul_li]:mb-2.5 [&>.media]:my-9.5 [&>.video]:my-9.5 max-mobile:mt-9 max-mobile:[&>h2]:mt-9.5 max-mobile:[&>h2]:text-[27px] max-mobile:[&>p]:text-[17px] print:max-w-full"
            aria-label={t("caseStudy.story")}
          >
            {parts.map((part, i) => {
              if (part === "[hero]")
                return (
                  <div key={i} className="case-cover group/cover my-9.5">
                    <Media media={p.media[0]} locale={locale} />
                  </div>
                );
              const match = part.match(/^\[media:(\d+)\]$/);
              if (match) {
                const m = p.media[Number(match[1])];
                return m ? <Media key={i} media={m} locale={locale} /> : null;
              }
              if (part === "[video]")
                return p.video ? (
                  <Video
                    key={i}
                    id={p.video.id}
                    title={`${projectName(p, locale)} — ${p.video.caption[locale]}`}
                    caption={p.video.caption[locale]}
                  />
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
        </CaseStudyStory>
        <nav
          className="case-end flex items-center justify-between gap-7.5 border-t border-line pt-9 pb-16.25 text-[14px] [&_small]:mb-1.5 [&_small]:block [&_small]:text-[11px] [&_small]:text-muted max-mobile:flex-col max-mobile:items-start max-mobile:gap-5 max-mobile:pb-8.75"
          aria-label={t("caseStudy.navigation")}
        >
          <BackToProjects locale={locale} slug={p.slug} />
          <Action
            className="next-project text-right text-[18px] max-mobile:text-left"
            href={projectPath(locale, next.slug)}
          >
            <small>{t("caseStudy.next")}</small>
            {projectName(next, locale)}
          </Action>
        </nav>
      </PageShell>
      <Contact locale={locale} variant="caseStudy" />
    </main>
  );
}
