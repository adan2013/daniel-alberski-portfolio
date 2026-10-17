"use client";

import { useCallback, useRef, type ReactNode } from "react";
import type { Locale } from "@/lib/projects";
import { CaseStudyFigure } from "@/components/case-study-figure";
import { useCaseStudyProgress } from "@/components/use-case-study-progress";
import {
  mountedDial,
  scaleAngle,
  scaleCopy,
  scalePose,
  scaleStops,
} from "./model";

type Props = { locale: Locale } & Record<
  | "base"
  | "mechanism"
  | "shell"
  | "piston"
  | "weight"
  | "tray"
  | "dial"
  | "layers",
  ReactNode
>;

export function ScaleAnatomyLive({
  locale,
  base,
  mechanism,
  shell,
  piston,
  tray,
  weight,
  dial,
  layers,
}: Props) {
  const bodyRef = useRef<SVGGElement>(null);
  const shellRef = useRef<SVGGElement>(null);
  const trayRef = useRef<SVGGElement>(null);
  const weightRef = useRef<SVGGElement>(null);
  const weightShadowRef = useRef<SVGEllipseElement>(null);
  const dialRef = useRef<SVGGElement>(null);
  const layersRef = useRef<SVGGElement>(null);
  const copy = scaleCopy[locale];

  const setup = useCallback(() => {
    const rows = Array.from(
      layersRef.current!.querySelectorAll<SVGGElement>("[data-layer-row]"),
    );
    const dialLayers = Array.from(
      dialRef.current!.querySelectorAll<SVGGElement>("[data-dial-layer]"),
    );
    const needle = dialRef.current!.querySelector<SVGGElement>(
      '[data-dial-layer="2"]',
    )!;
    const leftShell = shellRef.current!.querySelector<SVGGElement>(
      '[data-shell-half="left"]',
    )!;
    const rightShell = shellRef.current!.querySelector<SVGGElement>(
      '[data-shell-half="right"]',
    )!;
    const shellCuts =
      shellRef.current!.querySelectorAll<SVGGElement>("[data-shell-cut]");
    let landedAt: number | undefined;
    let wasLoaded = false;
    return (progress: number, seconds: number, still: boolean) => {
      const loaded = progress === 1;
      if (!loaded || still) landedAt = undefined;
      else if (!wasLoaded) landedAt = seconds;
      wasLoaded = loaded;
      const pose = scalePose(
        progress,
        landedAt === undefined ? undefined : seconds - landedAt,
      );
      weightRef.current!.setAttribute(
        "transform",
        `translate(0 ${pose.weightY})`,
      );
      weightRef.current!.setAttribute("opacity", String(pose.weightOpacity));
      weightShadowRef.current!.setAttribute(
        "opacity",
        String(pose.weightOpacity * (1 - pose.weightLift / 100)),
      );
      weightShadowRef.current!.setAttribute(
        "transform",
        `translate(0 ${pose.weightShadowY})`,
      );
      needle.setAttribute("transform", `rotate(${scaleAngle(pose.mass)})`);
      bodyRef.current!.setAttribute("opacity", String(pose.bodyOpacity));
      bodyRef.current!.setAttribute(
        "transform",
        `translate(${pose.bodyX} ${pose.bodyY})`,
      );
      leftShell.setAttribute("transform", `translate(${-pose.open * 34} 0)`);
      rightShell.setAttribute("transform", `translate(${pose.open * 34} 0)`);
      shellCuts.forEach((cut) =>
        cut.setAttribute("opacity", String(pose.open)),
      );
      trayRef.current!.setAttribute("transform", `translate(0 ${pose.trayY})`);
      dialRef.current!.setAttribute(
        "transform",
        `matrix(${pose.dialScale} ${pose.dialSkew} 0 ${pose.dialVerticalScale} ${pose.dialX} ${pose.dialY})`,
      );
      dialLayers.forEach((layer) => {
        layer.setAttribute(
          "opacity",
          String(pose.layers[Number(layer.dataset.dialLayer)]),
        );
      });
      layersRef.current!.setAttribute("opacity", String(pose.calloutOpacity));
      rows.forEach((row, i) => {
        row.setAttribute("opacity", String(pose.layers[i]));
        row.setAttribute(
          "transform",
          `translate(${(1 - pose.layers[i]) * 12} 0)`,
        );
      });
      return pose.settling;
    };
  }, []);
  const { root, scene, onSceneChange } = useCaseStudyProgress({
    stops: scaleStops,
    setup,
  });

  return (
    <div className="scale-anatomy" ref={root} aria-label={copy.title}>
      <CaseStudyFigure
        title={copy.title}
        hint={copy.hint}
        phases={copy.phases}
        scene={scene}
        progressLabel={copy.control}
        onSceneChange={onSceneChange}
        locale={locale}
        legend={
          <ol className="scale-mobile-legend">
            {copy.layers.map((layer, i) => (
              <li key={layer}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {layer}
              </li>
            ))}
          </ol>
        }
      >
        <svg
          className="case-figure-stage scale-stage"
          viewBox="0 0 640 560"
          role="img"
          aria-label={copy.description}
        >
          <defs>
            <radialGradient id="scale-shadow">
              <stop stopColor="currentColor" stopOpacity=".13" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g ref={bodyRef} opacity="0">
            {base}
            {mechanism}
            <g ref={shellRef}>{shell}</g>
            <g data-scale-piston>{piston}</g>
            <g ref={trayRef} data-scale-tray>
              {tray}
            </g>
            <ellipse
              ref={weightShadowRef}
              className="scale-shadow"
              cx="310"
              cy="105"
              rx="45"
              ry="16"
            />
            <g ref={weightRef}>{weight}</g>
          </g>
          <g ref={dialRef} transform={`matrix(1 0 0 1 280 ${mountedDial.y})`}>
            {dial}
          </g>
          <g ref={layersRef} opacity="0">
            {layers}
          </g>
        </svg>
      </CaseStudyFigure>
    </div>
  );
}
