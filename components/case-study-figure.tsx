import type { CSSProperties, ReactNode } from "react";
import type { Locale } from "@/lib/projects";
import { createTranslator } from "@/lib/i18n";
import "./case-study-figure.css";

export function CaseStudyFigure({
  number = "01",
  title,
  children,
  hint,
  phases,
  scene,
  progressLabel,
  onSceneChange,
  locale,
  legend,
}: {
  number?: string;
  title: string;
  children: ReactNode;
  hint: ReactNode;
  phases: readonly string[];
  scene: number;
  progressLabel: string;
  onSceneChange: (scene: number, transition: "scrub" | "step") => void;
  locale: Locale;
  legend?: ReactNode;
}) {
  const t = createTranslator(locale);
  return (
    <figure className="case-figure">
      <div className="case-figure-card iso-plate">
        <div className="case-figure-card-heading">
          <span>FIG. {number}</span>
          <span>{title}</span>
        </div>
        {children}
        <div className="case-figure-card-footer">
          {hint}
          <div className="case-figure-arrows">
            <button
              type="button"
              className="case-figure-arrow"
              aria-label={t("caseStudy.previousScene")}
              disabled={scene === 0}
              onClick={() => onSceneChange(scene - 1, "step")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m14.5 5-7 7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              className="case-figure-arrow"
              aria-label={t("caseStudy.nextScene")}
              disabled={scene === phases.length - 1}
              onClick={() => onSceneChange(scene + 1, "step")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9.5 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div
          className="case-figure-controls"
          style={
            {
              "--scene-percent": `${(scene / (phases.length - 1)) * 100}%`,
            } as CSSProperties
          }
        >
          <input
            className="case-figure-progress"
            type="range"
            min="0"
            max={phases.length - 1}
            step="1"
            value={scene}
            aria-label={progressLabel}
            aria-valuetext={phases[scene]}
            onChange={(event) =>
              onSceneChange(Number(event.target.value), "scrub")
            }
          />
          <div className="case-figure-track" aria-hidden="true">
            <span className="case-figure-track-fill" />
            <span className="case-figure-thumb" />
          </div>
        </div>
      </div>
      {legend}
    </figure>
  );
}
