"use client";
import "./geometry.css";
import { useEffect, useRef } from "react";
import { useTranslations } from "@/components/i18n-provider";
export function Geometry({ active }: { active: string }) {
  const t = useTranslations();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.closest(".intro")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!visible || document.hidden || reduced.matches) return;
      const rect = parent.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.62)));
      el.style.setProperty("--progress", p.toFixed(4));
      el.dataset.phase = p < 0.15 ? "flat" : p < 0.7 ? "fold" : "space";
    };
    const schedule = () => {
      if (reduced.matches || document.hidden || !visible) return;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const motion = () => {
      if (reduced.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        el.style.setProperty("--progress", "0.65");
        el.dataset.phase = "space";
      } else schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    observer.observe(parent);
    const resize = new ResizeObserver(schedule);
    resize.observe(parent);
    addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", motion);
    motion();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      removeEventListener("scroll", schedule);
      document.removeEventListener("visibilitychange", schedule);
      reduced.removeEventListener("change", motion);
    };
  }, []);
  return (
    <div
      ref={ref}
      className="geometry sticky top-37.5 flex aspect-[1/1.06] w-full max-w-122.5 flex-col justify-between [--progress:0] animate-[scene-entry_0.65s_ease-out_both] max-desktop:top-32.5 max-mobile:relative max-mobile:top-auto max-mobile:mx-auto max-mobile:aspect-[1.15] max-mobile:max-w-87.5 motion-reduce:[--progress:0.65]!"
      data-track={active}
      data-phase="flat"
      aria-hidden="true"
    >
      <div className="scene-top flex items-center justify-between border-t border-line py-3.5 text-[10px] tracking-[0.09em] text-muted max-desktop:text-[8px] max-tablet:text-[7px] max-mobile:text-[8px]">
        <span>FIG. 01 — MODULAR SYSTEM</span>
        <span>3 × 3</span>
      </div>
      <div className="scene-space grid min-h-75 flex-1 place-items-center overflow-visible perspective-[950px] bg-[radial-gradient(var(--line)_0.7px,transparent_0.7px)] bg-size-[21px_21px] max-desktop:min-h-65 max-tablet:min-h-57.5 max-mobile:min-h-52.5">
        <div className="module-grid grid aspect-square w-[76%] grid-cols-3 gap-3 transform-3d max-desktop:w-[83%] max-desktop:gap-2 max-tablet:gap-1.75 max-mobile:w-[65%] max-mobile:gap-2">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className={`module module-${i}`}
              style={{ "--i": i } as React.CSSProperties}
            >
              {["front", "back", "left", "right", "top", "bottom"].map(
                (face) => (
                  <div key={face} className={`face face-${face}`}>
                    {face === "front" && (
                      <span>{String(i + 1).padStart(2, "0")}</span>
                    )}
                  </div>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="scene-bottom flex items-center justify-between border-b border-line py-3.5 text-[10px] tracking-[0.09em] text-muted [&>span:last-child]:flex [&>span:last-child]:items-center [&>span:last-child]:gap-2.5 max-desktop:text-[8px] max-tablet:text-[7px] max-mobile:text-[8px]">
        <span className="phase-flat">01 / {t("geometry.flat")}</span>
        <span className="phase-fold">02 / {t("geometry.fold")}</span>
        <span className="phase-space">03 / {t("geometry.space")}</span>
        <span>
          2D <span className="scene-line h-px w-10 bg-field max-tablet:w-5" />{" "}
          3D
        </span>
      </div>
    </div>
  );
}
