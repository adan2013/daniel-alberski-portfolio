"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prepareSignalUnit } from "./live";

const clamp = (value: number) => Math.max(0, Math.min(1, value));

/**
 * Drives the signal unit from scroll. The figure sticks inside its column, so
 * the story plays while the hero and the about section pass; where the column
 * is no taller than the figure (phones) it plays as the figure crosses the
 * viewport. Reduced motion shows the finished, live unit.
 */
export function SignalUnitScene({
  label,
  hint,
  done,
  mobile,
  children,
}: {
  label: string;
  hint: string;
  done: string;
  mobile: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const stick = host.querySelector<HTMLElement>(".su-stick")!;
    const paint = prepareSignalUnit(host);
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let last = 0;
    let current = 0;
    let target = 0;
    function progress() {
      const box = host!.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(stick).top) || 0;
      const range = box.height - stick.offsetHeight;
      // The story ends at 80% of the pinned range, so the finished unit and
      // its note stay in full view for the rest of the scroll.
      if (range > 160) return clamp((top - box.top) / (range * 0.8));
      return clamp((innerHeight * 0.92 - box.top) / (innerHeight * 0.6));
    }
    function tick(now: number) {
      frame = 0;
      if (!visible || document.hidden || media.matches) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      current += (target - current) * (1 - Math.exp(-dt / 0.075));
      if (Math.abs(target - current) < 0.0002) current = target;
      paint(current);
      host!.dataset.progress = current.toFixed(4);
      atTop();
      if (current !== target) frame = requestAnimationFrame(tick);
    }
    // Under the figure: a scroll hint while the page sits at its top, a
    // thank-you once the unit is up and live, nothing in between.
    function atTop() {
      host!.dataset.top = String(scrollY < 40 && !media.matches);
      host!.dataset.done = String(host!.dataset.suLive === "true");
    }
    function schedule() {
      atTop();
      if (media.matches || !visible || document.hidden) return;
      target = progress();
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    }
    function motionChanged() {
      cancelAnimationFrame(frame);
      frame = 0;
      if (media.matches) {
        current = 1;
        paint(1);
        host!.dataset.progress = "1.0000";
        atTop();
      } else schedule();
    }
    current = target = media.matches ? 1 : progress();
    paint(current);
    host.dataset.progress = current.toFixed(4);
    atTop();
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else schedule();
    });
    observer.observe(host);
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    media.addEventListener("change", motionChanged);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      media.removeEventListener("change", motionChanged);
      paint.dispose();
    };
  }, []);
  return (
    <div ref={root} className="signal-unit" data-top="true">
      <div className="su-stick">
        <div role="img" aria-label={label}>
          {children}
        </div>
        <div className="su-notes">
          <p className="su-hint su-hint-scroll">
            <svg viewBox="0 0 12 16" aria-hidden="true">
              <path d="M6 1V14M1.5 9.5 6 14l4.5-4.5" />
            </svg>
            {hint}
          </p>
          <p className="su-hint su-hint-done">{done}</p>
          <p className="su-hint su-hint-mobile">{mobile}</p>
        </div>
      </div>
    </div>
  );
}
