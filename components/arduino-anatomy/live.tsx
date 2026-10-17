"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/projects";
import { CaseStudyFigure } from "../case-study-figure";
import { useCaseStudyProgress } from "../use-case-study-progress";
import {
  arduinoCopy,
  arduinoNeedleInk,
  arduinoPose,
  arduinoStepDurations,
  arduinoStops,
  arduinoTelemetry,
  arduinoTranslation,
} from "./model";

function setup(host: HTMLDivElement) {
  const parts = Object.fromEntries(
    Array.from(host.querySelectorAll<SVGElement>("[data-ad]")).map((el) => [
      el.dataset.ad!,
      el,
    ]),
  );
  const opacity = (name: string, value: number) =>
    parts[name].setAttribute("opacity", String(value));
  const move = (name: string, x: number, y: number, z: number) =>
    parts[name].setAttribute("transform", arduinoTranslation(x, y, z));
  return (progress: number, time: number, still: boolean) => {
    const p = arduinoPose(progress);
    opacity("shell", 1 - p.shellGone);
    move("shell", 0, 65 * p.shellGone, -60 * p.shellGone);
    opacity("old-needles", p.oldNeedles);
    move("old-needles", 0, 90 * (1 - p.oldNeedles), 50 * (1 - p.oldNeedles));
    opacity("old-faces", 1 - p.oldFaces);
    move("old-faces", -90 * p.oldFaces, 55 * p.oldFaces, 90 * p.oldFaces);
    opacity("new-faces", p.newFaces);
    move(
      "new-faces",
      70 * (1 - p.newFaces),
      30 * (1 - p.newFaces),
      90 * (1 - p.newFaces),
    );
    parts["new-faces"].dataset.seated = String(p.newFaces === 1);
    opacity("new-needles", p.newNeedles);
    move("new-needles", 0, 45 * (1 - p.newNeedles), 20 * (1 - p.newNeedles));
    opacity("dial-indicators", p.newFaces);
    move(
      "dial-indicators",
      70 * (1 - p.newFaces),
      30 * (1 - p.newFaces),
      90 * (1 - p.newFaces),
    );
    opacity("housing-back", p.openEnclosure);
    move("housing-back", 0, 0, -65 * (1 - p.openEnclosure));
    opacity("electronics", p.electronics);
    move("electronics", 0, 0, 215 * (1 - p.electronicsSeated) - 189);
    parts["electronics"].dataset.seated = String(p.electronicsSeated === 1);
    parts["electronics"].dataset.bottomZ = String(
      13 + 215 * (1 - p.electronicsSeated),
    );
    parts["electronics"].dataset.mount = "lower-base";
    opacity("housing-front", p.enclosure);
    // The fascia approaches from the front. Its gauge openings clear the spindles.
    move("housing-front", 0, 65 * (1 - p.enclosure), 0);
    opacity("lid", p.enclosure);
    move("lid", 0, 0, 60 * (1 - p.enclosure));
    parts["lid"].dataset.closed = String(p.enclosure === 1);
    opacity("monitor", p.monitor);
    move("monitor", 0, 0, -25 * (1 - p.monitor));
    opacity("lcd", p.running);
    opacity("light-dipped-beam", p.running);
    opacity("light-fuel", p.running);
    opacity("light-battery", p.running);
    opacity("light-high-beam", p.running);
    const brakePulse = still ? 0.8 : 0.65 + 0.35 * Math.sin(time * Math.PI * 2);
    opacity("light-brake", p.running * brakePulse);
    const turnPulse = still ? 1 : 0.5 + 0.5 * Math.sin(time * Math.PI * 1.6);
    opacity("turn-left-light", p.running * turnPulse);
    opacity("turn-right-light", p.running * turnPulse);
    const dim = [110, 125, 100],
      lit = [237, 244, 220];
    host.style.setProperty(
      "--ad-scale-ink",
      `rgb(${dim.map((v, i) => Math.round(v + (lit[i] - v) * p.running)).join(" ")})`,
    );
    const needleInk = arduinoNeedleInk(p.running);
    for (const id of ["speed", "rpm", "fuel", "air"]) {
      parts[`new-needle-body-${id}`].setAttribute("fill", needleInk.body);
      parts[`new-needle-body-${id}`].setAttribute("stroke", needleInk.edge);
      parts[`new-needle-highlight-${id}`].setAttribute(
        "stroke",
        needleInk.highlight,
      );
    }
    parts["new-needles"].dataset.backlight = String(p.running);
    parts["new-faces"].dataset.backlight = String(p.running);
    const telemetry = arduinoTelemetry(time, still);
    parts["new-needle-speed"].setAttribute(
      "transform",
      `rotate(${-135 + ((p.running * telemetry.speed) / 140) * 270})`,
    );
    parts["new-needle-rpm"].setAttribute(
      "transform",
      `rotate(${-135 + ((p.running * telemetry.rpm) / 3000) * 270})`,
    );
    parts["new-needle-fuel"].setAttribute(
      "transform",
      `rotate(${-65 + p.running * 80})`,
    );
    parts["new-needle-air"].setAttribute(
      "transform",
      `rotate(${-65 + p.running * 100})`,
    );
    const speed = String(Math.round(telemetry.speed));
    for (const id of ["lcd-speed", "pc-speed"])
      if (parts[id].textContent !== speed) parts[id].textContent = speed;
    return p.running > 0;
  };
}
type Art =
  | "shell"
  | "motors"
  | "oldFaces"
  | "newFaces"
  | "oldNeedles"
  | "newNeedles"
  | "dialIndicators"
  | "housingBack"
  | "electronics"
  | "housingFront"
  | "lid"
  | "monitor";
export function ArduinoLive({
  locale,
  ...art
}: { locale: Locale } & Record<Art, ReactNode>) {
  const copy = arduinoCopy[locale];
  const { root, scene, onSceneChange } = useCaseStudyProgress({
    stops: arduinoStops,
    stepDurations: arduinoStepDurations,
    setup,
  });
  return (
    <div ref={root} className="arduino-anatomy" aria-label={copy.title}>
      <CaseStudyFigure
        title={copy.title}
        hint={copy.hint}
        phases={copy.phases}
        scene={scene}
        progressLabel={copy.control}
        onSceneChange={onSceneChange}
        locale={locale}
      >
        <svg
          viewBox="0 0 640 560"
          className="case-figure-stage ad-stage"
          role="img"
          aria-label={copy.description}
        >
          <defs>
            <radialGradient id="ad-shadow">
              <stop stopColor="#506546" stopOpacity=".19" />
              <stop offset="1" stopColor="#506546" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="318" cy="465" rx="235" ry="39" fill="url(#ad-shadow)" />
          <g data-ad="monitor" opacity="0">
            {art.monitor}
          </g>
          <g data-ad="housing-back" opacity="0">
            {art.housingBack}
          </g>
          <g data-ad="electronics" opacity="0">
            {art.electronics}
          </g>
          <g data-ad="cluster">
            {art.motors}
            <g data-ad="shell">{art.shell}</g>
          </g>
          <g data-ad="housing-front" opacity="0">
            {art.housingFront}
          </g>
          <g data-ad="lid" opacity="0">
            {art.lid}
          </g>
          <g data-ad="face-carriage">
            <g data-ad="old-faces">{art.oldFaces}</g>
            <g data-ad="new-faces" opacity="0">
              {art.newFaces}
            </g>
            <g data-ad="dial-indicators" opacity="0">
              {art.dialIndicators}
            </g>
            <g data-ad="old-needles">{art.oldNeedles}</g>
            <g data-ad="new-needles" opacity="0">
              {art.newNeedles}
            </g>
          </g>
        </svg>
      </CaseStudyFigure>
    </div>
  );
}
