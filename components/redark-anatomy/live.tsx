"use client";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/projects";
import { CaseStudyFigure } from "../case-study-figure";
import { useCaseStudyProgress } from "../use-case-study-progress";
import {
  redarkCopy,
  redarkPose,
  redarkStepDurations,
  redarkStops,
  redarkTranslation,
} from "./model";
function setup(host: HTMLDivElement) {
  const parts = Object.fromEntries(
    Array.from(host.querySelectorAll<SVGElement>("[data-rd]")).map((el) => [
      el.dataset.rd!,
      el,
    ]),
  );
  const opacity = (key: string, value: number) =>
    parts[key].setAttribute("opacity", String(value));
  const transform = (key: string, value: string) =>
    parts[key].setAttribute("transform", value);
  return (progress: number) => {
    const p = redarkPose(progress);
    transform("sheet", redarkTranslation(p.travel));
    transform("belt-treads", `translate(${p.travel % 12} 0)`);
    transform("roller-left", `rotate(${p.travel * 5})`);
    transform("roller-right", `rotate(${p.travel * 5})`);
    transform("scan-head", redarkTranslation(p.scan * 78));
    opacity("raw-content", 1 - p.corrected);
    opacity("error-marks", p.scanned * (1 - p.corrected));
    opacity("corrected-content", p.corrected * (1 - p.structured));
    opacity("mdx-content", p.structured);
    opacity("scanner-error", p.scanned * (1 - p.corrected));
    opacity("scanner-ok", p.corrected);
    // The receiving enclosure occludes the moving paper; it never dissolves
    // during transport. Hide only when it is fully inside the computer.
    opacity("sheet", p.imported === 1 ? 0 : 1);
    opacity("next-logo", 1 - p.imported);
    opacity("import-screen", p.imported * (1 - p.published));
    opacity("website", p.published);
    parts["source-led"].setAttribute(
      "fill",
      p.printed > 0 ? "#e1edba" : "#91a77c",
    );
    parts["target-led"].setAttribute(
      "fill",
      p.imported > 0 ? "#e1edba" : "#91a77c",
    );
    return false;
  };
}
type Art =
  | "base"
  | "belt"
  | "scannerBack"
  | "scannerFront"
  | "scanHead"
  | "document"
  | "source"
  | "receiver";
export function RedarkLive({
  locale,
  ...art
}: { locale: Locale } & Record<Art, ReactNode>) {
  const copy = redarkCopy[locale];
  const { root, scene, onSceneChange } = useCaseStudyProgress({
    stops: redarkStops,
    stepDurations: redarkStepDurations,
    setup,
  });
  return (
    <div
      ref={root}
      className="redark-anatomy"
      data-locale={locale}
      aria-label={copy.title}
    >
      <CaseStudyFigure
        title={copy.title}
        hint={copy.phases[scene]}
        phases={copy.phases}
        scene={scene}
        progressLabel={copy.control}
        onSceneChange={onSceneChange}
        locale={locale}
      >
        <svg
          viewBox="0 0 640 560"
          className="case-figure-stage rd-stage"
          role="img"
          aria-label={copy.description}
        >
          <defs>
            <radialGradient id="rd-shadow">
              <stop stopColor="#4c6148" stopOpacity=".2" />
              <stop offset="1" stopColor="#4c6148" stopOpacity="0" />
            </radialGradient>
            <clipPath id="rd-belt-clip">
              <rect width="290" height="76" />
            </clipPath>
            <clipPath id="rd-wp-screen-clip">
              <rect x="5" y="6" width="74" height="68" rx="3" />
            </clipPath>
            <clipPath id="rd-next-screen-clip">
              <rect x="5" y="6" width="74" height="68" rx="3" />
            </clipPath>
          </defs>
          <g transform="translate(44.8 44.1) scale(.86)">
            {art.base}
            {art.scannerBack}
            {art.belt}
            <g data-rd="sheet">{art.document}</g>
            {art.source}
            <g data-rd="scan-head">{art.scanHead}</g>
            {art.scannerFront}
            {art.receiver}
          </g>
        </svg>
      </CaseStudyFigure>
    </div>
  );
}
