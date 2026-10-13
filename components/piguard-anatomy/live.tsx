"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/projects";
import { CaseStudyFigure } from "../case-study-figure";
import { useCaseStudyProgress } from "../use-case-study-progress";
import { guardCopy, guardPhase, guardPose } from "./model";

function setup(host: HTMLDivElement) {
  const parts = Object.fromEntries(
    Array.from(host.querySelectorAll<SVGElement>("[data-pg]")).map((el) => [
      el.dataset.pg!,
      el,
    ]),
  );
  const opacity = (name: string, value: number) =>
    parts[name].setAttribute("opacity", String(value));
  const transform = (name: string, value: string) =>
    parts[name].setAttribute("transform", value);
  return (progress: number, time: number, still: boolean) => {
    const p = guardPose(progress);
    opacity("scene", p.firstScene);
    opacity("intruder", p.intruder);
    transform("intruder", `translate(${(1 - p.intruder) * 210} 0)`);
    opacity("sly", 1 - p.fear);
    opacity("fear", p.fear);
    opacity("sensor-led", p.detection);
    opacity("alert", p.detection);
    transform("alert", `translate(0 ${-8 * p.detection})`);
    const shake = still ? 0 : Math.sin(time * 40) * 1.6 * p.alarm;
    transform("device", `rotate(${shake} 185 256)`);
    // Small, local LED pulse: faster when the local alarm is sounding.
    const pulse = still
      ? 1
      : 0.45 +
        0.55 * (0.5 + 0.5 * Math.sin(time * Math.PI * (2 + 6 * p.alarm)));
    opacity("led", pulse);
    opacity("outgoing", p.outgoing);
    transform(
      "outgoing",
      `translate(${186 + p.departure * 28} ${147 - p.departure * 68}) scale(${0.8 + p.departure * 0.2})`,
    );
    opacity("recipient", p.recipient);
    transform("recipient", `translate(0 ${(1 - p.recipient) * 18})`);
    opacity("incoming", p.incoming);
    transform(
      "incoming",
      `translate(${493 - p.arrival * 162} ${96 + p.arrival * 211}) scale(${1 - p.arrival * 0.55})`,
    );
    transform("phone-arm", `rotate(${35 * (1 - p.phone)} 40 -20)`);
    opacity("phone-arm", p.phone);
    opacity("resting-arm", 1 - p.phone);
    opacity("phone-message", p.phone);
    opacity("message", p.message);
    transform("message", `translate(0 ${(1 - p.message) * 12})`);
    opacity("smile", 1 - p.shock);
    opacity("shock", p.shock);
    return p.firstScene > 0;
  };
}
export function PiGuardLive({
  locale,
  device,
  sensor,
  alert,
  burglar,
  recipient,
  radio,
  message,
}: {
  locale: Locale;
  device: ReactNode;
  sensor: ReactNode;
  alert: ReactNode;
  burglar: ReactNode;
  recipient: ReactNode;
  radio: ReactNode;
  message: ReactNode;
}) {
  const copy = guardCopy[locale];
  const { root, readout, slider, onProgressChange } = useCaseStudyProgress({
    phases: copy.phases,
    phaseAt: guardPhase,
    setup,
  });
  return (
    <div ref={root} className="piguard-anatomy" aria-label={copy.title}>
      <CaseStudyFigure
        title={copy.title}
        hint={copy.hint}
        initialReadout={`01 / 06 · ${copy.phases[0]}`}
        readoutRef={readout}
        progressRef={slider}
        progressLabel={copy.control}
        onProgressChange={onProgressChange}
      >
        <svg
          viewBox="0 0 640 560"
          className="case-figure-stage pg-stage"
          role="img"
          aria-label={copy.description}
        >
          <defs>
            <radialGradient id="pg-shadow">
              <stop stopColor="#4c6148" stopOpacity=".18" />
              <stop offset="1" stopColor="#4c6148" stopOpacity="0" />
            </radialGradient>
            <clipPath id="pg-shirt">
              <path d="M-38-35-17-44H18L40-33Q51-13 46 17L40 70Q0 81-42 70L-46 12Q-50-15-38-35Z" />
            </clipPath>
            <clipPath id="pg-left-sleeve">
              <path d="M-43-27Q-60-24-65 1L-72 40-58 44-40 7Z" />
            </clipPath>
            <clipPath id="pg-sleeve">
              <path d="M41-28Q58-25 64-4L74 20 61 28 43 6Z" />
            </clipPath>
            <clipPath id="pg-lens">
              <path d="M-23-14Q-2-19 21-14L18 31Q0 42-21 31Z" />
            </clipPath>
          </defs>
          <g data-pg="scene">
            <g data-pg="intruder" opacity="0">
              {burglar}
            </g>
            <ellipse
              cx="184"
              cy="384"
              rx="129"
              ry="25"
              fill="url(#pg-shadow)"
            />
            <g data-pg="device">{device}</g>
            {sensor}
            <g data-pg="alert" opacity="0">
              {alert}
            </g>
            <g data-pg="outgoing" opacity="0">
              {radio}
            </g>
          </g>
          <g data-pg="recipient" opacity="0">
            {recipient}
          </g>
          <g data-pg="incoming" opacity="0">
            {radio}
          </g>
          <g data-pg="message" opacity="0">
            {message}
          </g>
        </svg>
      </CaseStudyFigure>
    </div>
  );
}
