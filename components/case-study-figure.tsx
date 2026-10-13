import type { ReactNode, Ref } from "react";
import "./case-study-figure.css";

export function CaseStudyFigure({
  number = "01",
  title,
  children,
  hint,
  initialReadout,
  readoutRef,
  progressRef,
  progressLabel,
  onProgressChange,
  legend,
}: {
  number?: string;
  title: string;
  children: ReactNode;
  hint: ReactNode;
  initialReadout: string;
  readoutRef: Ref<HTMLOutputElement>;
  progressRef: Ref<HTMLInputElement>;
  progressLabel: string;
  onProgressChange: (progress: number) => void;
  legend?: ReactNode;
}) {
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
          <output ref={readoutRef} data-readout aria-live="off">
            {initialReadout}
          </output>
        </div>
        <input
          ref={progressRef}
          className="case-figure-progress"
          type="range"
          min="0"
          max="100"
          step="1"
          defaultValue="0"
          aria-label={progressLabel}
          onChange={(event) =>
            onProgressChange(Number(event.target.value) / 100)
          }
        />
      </div>
      {legend}
    </figure>
  );
}
