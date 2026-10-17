"use client";

import { useEffect, useRef, useState } from "react";

type Draw = (progress: number, seconds: number, still: boolean) => boolean;
type SceneTransition = "scrub" | "step";

const SCRUB_DURATION_MS = 220;
const STEP_DURATION_MS = 1000;

/** Slider seeks quickly; arrows use the duration of each crossed scene interval. */
export function useCaseStudyProgress({
  stops,
  stepDurations,
  setup,
}: {
  stops: readonly number[];
  /** Milliseconds per interval: index 0 is the transition between scenes 0 and 1. */
  stepDurations?: readonly number[];
  setup: (host: HTMLDivElement) => Draw;
}) {
  const root = useRef<HTMLDivElement>(null);
  const seek = useRef<(scene: number, transition: SceneTransition) => void>(
    () => {},
  );
  const selectedScene = useRef(0);
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const draw = setup(host);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let progress = stops[selectedScene.current];
    let from = progress;
    let target = progress;
    let targetScene = selectedScene.current;
    let frame = 0;
    let started = 0;
    let duration = STEP_DURATION_MS;
    let last = 0;
    let time = 0;
    let visible = false;

    function paint() {
      const continuous = draw(progress, time, reduced.matches);
      host!.dataset.progress = progress.toFixed(3);
      host!.dataset.phase = String(targetScene);
      return continuous;
    }
    function tick(now: number) {
      frame = 0;
      if (document.hidden || !visible) return;
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 0;
      last = now;
      if (!reduced.matches) time += dt;
      if (progress !== target) {
        if (!started) started = now;
        const fraction = Math.min(1, (now - started) / duration);
        progress = reduced.matches ? target : from + (target - from) * fraction;
        if (fraction === 1) progress = target;
      }
      const continuous = paint();
      if (progress !== target || (continuous && !reduced.matches))
        frame = requestAnimationFrame(tick);
    }
    function run() {
      if (document.hidden || !visible) {
        cancelAnimationFrame(frame);
        frame = 0;
        started = 0;
        from = progress;
      } else if (!frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    }
    function onMotionChange() {
      host!.dataset.reduced = String(reduced.matches);
      if (reduced.matches) {
        progress = target;
        started = 0;
        paint();
      }
      run();
    }
    seek.current = (nextScene, transition) => {
      const previousScene = targetScene;
      targetScene = nextScene;
      target = stops[nextScene];
      from = progress;
      started = 0;
      duration = SCRUB_DURATION_MS;
      if (transition === "step") {
        duration = 0;
        for (
          let interval = Math.min(previousScene, nextScene);
          interval < Math.max(previousScene, nextScene);
          interval++
        ) {
          duration += stepDurations?.[interval] ?? STEP_DURATION_MS;
        }
        duration ||= STEP_DURATION_MS;
      }
      if (reduced.matches) progress = target;
      paint();
      run();
    };
    paint();
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      run();
    });
    observer.observe(host);
    document.addEventListener("visibilitychange", run);
    reduced.addEventListener("change", onMotionChange);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", run);
      reduced.removeEventListener("change", onMotionChange);
      seek.current = () => {};
    };
  }, [stops, stepDurations, setup]);

  return {
    root,
    scene,
    onSceneChange: (nextScene: number, transition: SceneTransition) => {
      const selected = Math.max(0, Math.min(stops.length - 1, nextScene));
      selectedScene.current = selected;
      setScene(selected);
      seek.current(selected, transition);
    },
  };
}
