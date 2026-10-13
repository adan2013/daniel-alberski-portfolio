"use client";

import { createContext, use, useState, type ReactNode } from "react";
import type { Locale } from "@/lib/projects";
import "./case-study-story.css";

type CaseStudyView = "article" | "animation";
const CaseStudyViewContext = createContext<CaseStudyView>("article");

export function useCaseStudyView() {
  return use(CaseStudyViewContext);
}

export function CaseStudyStory({
  children,
  animation,
  locale,
}: {
  children: ReactNode;
  animation?: ReactNode;
  locale: Locale;
}) {
  const [view, setView] = useState<CaseStudyView>("article");
  const labels =
    locale === "pl"
      ? { view: "Widok case study", article: "Artykuł", animation: "Animacja" }
      : { view: "Case study view", article: "Article", animation: "Animation" };

  return (
    <CaseStudyViewContext value={view}>
      <div
        className="case-story"
        data-has-animation={Boolean(animation)}
        data-mobile-view={view}
      >
        <div className="case-copy">{children}</div>
        {animation ? (
          <>
            <aside className="case-animation" aria-label={labels.animation}>
              <div className="case-animation-content">{animation}</div>
            </aside>
            <div
              className="case-mobile-switch"
              role="group"
              aria-label={labels.view}
            >
              <button
                type="button"
                aria-pressed={view === "article"}
                onClick={() => setView("article")}
              >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 3h10M3 6h10M3 9h10M3 12h6" />
                </svg>
                {labels.article}
              </button>
              <button
                type="button"
                aria-pressed={view === "animation"}
                onClick={() => setView("animation")}
              >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="5.5" />
                  <path d="M8 8l3-3" />
                </svg>
                {labels.animation}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </CaseStudyViewContext>
  );
}
