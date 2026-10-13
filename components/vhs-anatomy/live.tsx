"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/projects";
import { CaseStudyFigure } from "../case-study-figure";
import { useCaseStudyProgress } from "../use-case-study-progress";
import { vhsCopy, vhsPhase, vhsPose, vhsTranslation } from "./model";

function setup(host: HTMLDivElement) {
  const parts = Object.fromEntries(
    Array.from(host.querySelectorAll<SVGElement>("[data-vh]")).map((el) => [
      el.dataset.vh!,
      el,
    ]),
  );
  const opacity = (name: string, value: number) =>
    parts[name].setAttribute("opacity", String(value));
  const move = (name: string, x: number, y: number, z: number) =>
    parts[name].setAttribute("transform", vhsTranslation(x, y, z));
  return (progress: number) => {
    const p = vhsPose(progress);
    opacity("laptop-screen", 1 - p.powerOff);
    move("bottom", -330 * p.discard, 0, -58 * p.explode);
    opacity("bottom", 1 - p.discard);
    move("rim", -330 * p.discard, 0, -58 * p.explode);
    opacity("rim", 1 - p.discard);
    move("upper", 0, 0, 145 * p.explode + 340 * p.discard);
    opacity("upper", 1 - p.discard);
    move(
      "motherboard",
      -20 * p.shuffle,
      -2 * p.board,
      28 * p.explode - 63 * p.board,
    );
    move(
      "disk",
      25 * p.shuffle - 31 * p.disk,
      17 * p.disk,
      36 * p.explode - 69 * p.disk,
    );
    move(
      "ports",
      44 * p.shuffle - 65 * p.ports,
      13 * p.ports,
      48 * p.explode - 78 * p.ports,
    );
    for (const name of ["chassis-back", "chassis-front"]) {
      opacity(name, p.chassis);
      move(name, 0, 0, -220 * (1 - p.chassis));
    }
    opacity("extras", p.extras);
    opacity("rear-board", p.extras);
    move("rear-board", 0, 0, 110 * (1 - p.extras));
    move(
      "extras",
      160 * (1 - p.extras),
      -90 * (1 - p.extras),
      100 * (1 - p.extras),
    );
    opacity("lid", Math.min(1, p.lid * 4));
    move("lid", 0, 0, 220 * (1 - p.lid));
    opacity("tape", p.cassetteVisible);
    move("tape", 0, 77 - 226 * p.cassette, 0);
    opacity("television", p.chassis);
    move("television", 0, 0, -15 * (1 - p.chassis));
    opacity("clock", p.power);
    opacity("power-led", p.power);
    opacity("desktop", p.desktop);
    // A sample clock time is replaced with the viewer's local time on power-up.
    if (p.power > 0) {
      const now = new Date();
      parts.clock.textContent = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    }
    return false;
  };
}

type Art =
  | "definitions"
  | "laptopBottom"
  | "laptopRim"
  | "laptopUpper"
  | "motherboard"
  | "disk"
  | "ports"
  | "chassisBack"
  | "chassisFront"
  | "extras"
  | "rearBoard"
  | "lid"
  | "tape"
  | "television";
export function VhsLive({
  locale,
  ...art
}: { locale: Locale } & Record<Art, ReactNode>) {
  const copy = vhsCopy[locale];
  const { root, readout, slider, onProgressChange } = useCaseStudyProgress({
    phases: copy.phases,
    phaseAt: vhsPhase,
    setup,
  });
  return (
    <div ref={root} className="vhs-anatomy" aria-label={copy.title}>
      <CaseStudyFigure
        title={copy.title}
        hint={copy.hint}
        initialReadout={`01 / 07 · ${copy.phases[0]}`}
        readoutRef={readout}
        progressRef={slider}
        progressLabel={copy.control}
        onProgressChange={onProgressChange}
      >
        <svg
          viewBox="0 0 640 560"
          className="case-figure-stage vh-stage"
          role="img"
          aria-label={copy.description}
        >
          {art.definitions}
          <ellipse cx="315" cy="456" rx="225" ry="45" fill="url(#vh-shadow)" />
          <g data-vh="television" opacity="0">
            {art.television}
          </g>
          <g data-vh="chassis-back" opacity="0">
            {art.chassisBack}
          </g>
          <g data-vh="rear-board" opacity="0">
            {art.rearBoard}
          </g>
          <g data-vh="bottom">{art.laptopBottom}</g>
          <g data-vh="motherboard">{art.motherboard}</g>
          <g data-vh="disk">{art.disk}</g>
          <g data-vh="ports">{art.ports}</g>
          <g data-vh="rim">{art.laptopRim}</g>
          <g data-vh="extras" opacity="0">
            {art.extras}
          </g>
          <g data-vh="upper">{art.laptopUpper}</g>
          <g data-vh="chassis-front" opacity="0">
            {art.chassisFront}
          </g>
          <g data-vh="lid" opacity="0">
            {art.lid}
          </g>
          <g clipPath="url(#vh-tape-outside)">
            <g data-vh="tape" opacity="0">
              {art.tape}
            </g>
          </g>
        </svg>
      </CaseStudyFigure>
    </div>
  );
}
