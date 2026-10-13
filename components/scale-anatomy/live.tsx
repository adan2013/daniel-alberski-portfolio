"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { Locale } from "@/lib/projects";
import { CaseStudyFigure } from "@/components/case-study-figure";
import { useCaseStudyView } from "@/components/case-study-story";
import { clamp, scaleAngle, scaleCopy, scalePose } from "./model";

type Props = { locale: Locale } & Record<
  | "base"
  | "mechanism"
  | "leftShell"
  | "rightShell"
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
  leftShell,
  rightShell,
  tray,
  weight,
  dial,
  layers,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const leftRef = useRef<SVGGElement>(null);
  const rightRef = useRef<SVGGElement>(null);
  const trayRef = useRef<SVGGElement>(null);
  const weightRef = useRef<SVGGElement>(null);
  const weightShadowRef = useRef<SVGEllipseElement>(null);
  const dialRef = useRef<SVGGElement>(null);
  const layersRef = useRef<SVGGElement>(null);
  const readout = useRef<HTMLOutputElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const wake = useRef<() => void>(() => {});
  const setProgress = useRef<(value: number) => void>(() => {});
  const mobileView = useCaseStudyView();
  const copy = scaleCopy[locale];

  useEffect(() => {
    const host = root.current;
    const story = host?.closest<HTMLElement>(".case-story");
    if (!host || !story) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const rows = Array.from(
      layersRef.current!.querySelectorAll<SVGGElement>("[data-layer-row]"),
    );
    const needle = dialRef.current!.querySelector<SVGGElement>(
      '[data-dial-layer="2"]',
    )!;
    let progress = 0,
      target = 0,
      frame = 0,
      last = 0,
      visible = false;
    let measure = true,
      start = 0,
      distance = 1;

    const mobile = matchMedia("(max-width: 1000px)");
    const canRun = () =>
      mobile.matches ? story.dataset.mobileView === "animation" : visible;
    const draw = () => {
      const pose = scalePose(progress);
      weightRef.current!.setAttribute(
        "transform",
        `translate(0 ${-pose.weightLift})`,
      );
      weightRef.current!.setAttribute("opacity", String(pose.weightOpacity));
      weightShadowRef.current!.setAttribute(
        "opacity",
        String(pose.weightOpacity * (1 - pose.weightLift / 100)),
      );
      needle.setAttribute("transform", `rotate(${scaleAngle(pose.mass)})`);
      bodyRef.current!.setAttribute("opacity", String(pose.bodyOpacity));
      bodyRef.current!.setAttribute(
        "transform",
        `translate(0 ${-pose.turn * 90})`,
      );
      leftRef.current!.setAttribute(
        "transform",
        `translate(${-pose.open * 66} ${-pose.open * 24}) rotate(${-pose.open * 9} 155 220)`,
      );
      rightRef.current!.setAttribute(
        "transform",
        `translate(${pose.open * 66} ${-pose.open * 24}) rotate(${pose.open * 9} 400 235)`,
      );
      trayRef.current!.setAttribute(
        "transform",
        `translate(0 ${-pose.open * 72})`,
      );
      dialRef.current!.setAttribute(
        "transform",
        `matrix(${pose.dialScale} ${pose.dialSkew} 0 1 ${pose.dialX} ${pose.dialY})`,
      );
      layersRef.current!.setAttribute("opacity", String(pose.layers[0]));
      rows.forEach((row, i) => {
        row.setAttribute("opacity", String(pose.layers[i]));
        row.setAttribute(
          "transform",
          `translate(${(1 - pose.layers[i]) * 12} 0)`,
        );
      });
      readout.current!.textContent = `${String(pose.phase + 1).padStart(2, "0")} / ${String(copy.phases.length).padStart(2, "0")} · ${copy.phases[pose.phase]}`;

      host.dataset.phase = String(pose.phase);
      host.dataset.progress = progress.toFixed(3);
    };
    function tick(now: number) {
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;
      progress = reduced.matches
        ? target
        : progress + (target - progress) * (1 - Math.exp(-dt / 0.14));
      if (Math.abs(target - progress) < 0.0005) progress = target;
      draw();
      frame =
        canRun() && !document.hidden && progress !== target
          ? requestAnimationFrame(tick)
          : 0;
    }
    function run() {
      if (!frame && canRun() && !document.hidden) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    }
    function describeTarget() {
      slider.current!.value = String(Math.round(target * 100));
      slider.current!.setAttribute(
        "aria-valuetext",
        `${Math.round(target * 100)}% · ${copy.phases[scalePose(target).phase]}`,
      );
    }
    function onScroll() {
      if (measure) {
        const bounds = story!.getBoundingClientRect();
        start = bounds.top + window.scrollY - 130;
        distance = Math.max(1, bounds.height - window.innerHeight + 170);
        measure = false;
      }
      if (!reduced.matches) target = clamp((window.scrollY - start) / distance);
      describeTarget();
      run();
    }
    function onResize() {
      measure = true;
      onScroll();
    }
    function onMotionChange() {
      host!.dataset.reduced = String(reduced.matches);
      target = reduced.matches ? 1 : target;
      onScroll();
    }
    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else onScroll();
    }
    wake.current = onScroll;
    setProgress.current = (value) => {
      target = clamp(value);
      describeTarget();
      run();
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (canRun()) onScroll();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    // Observe the whole story: the mobile figure is fixed and the article holds
    // the scroll distance, including while its text is hidden by the view switch.
    observer.observe(story);
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(story);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onMotionChange);
    onMotionChange();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onMotionChange);
      setProgress.current = () => {};
      wake.current = () => {};
    };
  }, [copy]);

  useEffect(() => {
    wake.current();
  }, [mobileView]);

  return (
    <div className="scale-anatomy" ref={root} aria-label={copy.title}>
      <CaseStudyFigure
        title={copy.title}
        hint={
          <>
            <span className="scale-scroll-hint">{copy.hint}</span>
            <span className="scale-still-hint">{copy.still}</span>
          </>
        }
        initialReadout={`01 / ${String(copy.phases.length).padStart(2, "0")} · ${copy.phases[0]}`}
        readoutRef={readout}
        progressRef={slider}
        progressLabel={copy.control}
        onProgressChange={(value) => setProgress.current(value)}
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
          <g ref={bodyRef}>
            {base}
            {mechanism}
            <g ref={leftRef}>{leftShell}</g>
            <g ref={rightRef}>{rightShell}</g>
            <g ref={trayRef}>{tray}</g>
            <ellipse
              ref={weightShadowRef}
              className="scale-shadow"
              cx="281"
              cy="126"
              rx="45"
              ry="16"
            />
            <g ref={weightRef}>{weight}</g>
          </g>
          <g ref={dialRef} transform="matrix(.9 .13 0 1 280 295)">
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
