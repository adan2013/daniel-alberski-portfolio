"use client";

import { useEffect, useRef } from "react";
import { useCaseStudyView } from "./case-study-story";

type Draw = (progress: number, seconds: number, still: boolean) => boolean;

/** Shared scroll transport; each figure owns its geometry and narrative. */
export function useCaseStudyProgress({
  phases,
  phaseAt,
  setup,
}: {
  phases: string[];
  phaseAt: (progress: number) => number;
  setup: (host: HTMLDivElement) => Draw;
}) {
  const root = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLOutputElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const wake = useRef(() => {});
  const seek = useRef<(value: number) => void>(() => {});
  const view = useCaseStudyView();

  useEffect(() => {
    const host = root.current;
    const story = host?.closest<HTMLElement>(".case-story");
    if (!host || !story) return;
    const draw = setup(host);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 1000px)");
    let progress = 0,
      target = 0,
      frame = 0,
      last = 0,
      time = 0;
    let visible = false,
      dirty = true,
      start = 0,
      distance = 1;
    const active = () =>
      !document.hidden &&
      (mobile.matches ? story.dataset.mobileView === "animation" : visible);
    function tick(now: number) {
      frame = 0;
      if (!active()) return;
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;
      if (!reduced.matches) time += dt;
      progress = reduced.matches
        ? target
        : progress + (target - progress) * (1 - Math.exp(-dt / 0.14));
      if (Math.abs(target - progress) < 0.0005) progress = target;
      const continuous = draw(progress, time, reduced.matches);
      const phase = phaseAt(progress);
      readout.current!.textContent = `${String(phase + 1).padStart(2, "0")} / ${String(phases.length).padStart(2, "0")} · ${phases[phase]}`;
      host!.dataset.progress = progress.toFixed(3);
      host!.dataset.phase = String(phase);
      if (progress !== target || (continuous && !reduced.matches))
        frame = requestAnimationFrame(tick);
    }
    function run() {
      if (!active()) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    }
    function describe() {
      slider.current!.value = String(Math.round(target * 100));
      slider.current!.setAttribute(
        "aria-valuetext",
        `${Math.round(target * 100)}% · ${phases[phaseAt(target)]}`,
      );
    }
    function onScroll() {
      if (dirty) {
        const bounds = story!.getBoundingClientRect();
        start = bounds.top + scrollY - 130;
        distance = Math.max(1, bounds.height - innerHeight + 170);
        dirty = false;
      }
      if (!reduced.matches)
        target = Math.max(0, Math.min(1, (scrollY - start) / distance));
      describe();
      run();
    }
    function onResize() {
      dirty = true;
      onScroll();
    }
    function onMotion() {
      host!.dataset.reduced = String(reduced.matches);
      if (reduced.matches) target = 1;
      onScroll();
    }
    seek.current = (value) => {
      target = Math.max(0, Math.min(1, value));
      describe();
      run();
    };
    wake.current = run;
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      run();
    });
    intersection.observe(host);
    const resize = new ResizeObserver(onResize);
    resize.observe(story);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", run);
    reduced.addEventListener("change", onMotion);
    onMotion();
    return () => {
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", run);
      reduced.removeEventListener("change", onMotion);
      wake.current = () => {};
      seek.current = () => {};
    };
  }, [phases, phaseAt, setup]);
  useEffect(() => {
    wake.current();
  }, [view]);
  return {
    root,
    readout,
    slider,
    onProgressChange: (value: number) => seek.current(value),
  };
}
