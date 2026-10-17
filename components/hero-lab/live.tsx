"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { portraitPose, portraitTiles, tileTransform } from "./portrait-model";
import {
  benchPose,
  clamp,
  ease,
  interval,
  copy,
  offset,
  plotterPose,
  strokeLengths,
  type Concept,
} from "./model";

function translate(node: Element | null, x: number, y: number, z = 0) {
  const [dx, dy] = offset(x, y, z);
  node?.setAttribute(
    "transform",
    `translate(${dx.toFixed(3)} ${dy.toFixed(3)})`,
  );
}

function prepareArt(host: HTMLElement, concept: Concept) {
  const find = (name: string) => host.querySelector(`[data-${name}]`);
  if (concept === "portrait") {
    const tiles = portraitTiles.map((tile) => {
      const node = host.querySelector(`[data-portrait-tile="${tile.index}"]`)!;
      return {
        tile,
        node,
        tint: node.querySelector("[data-portrait-tint]"),
        glitch: node.querySelector("[data-portrait-glitch]"),
        slice: node.querySelector("[data-portrait-slice]"),
        annotation: node.querySelector("[data-portrait-annotation]"),
      };
    });
    const complete = find("portrait-complete");
    let activePair = "";
    const status = find("portrait-status"),
      count = find("portrait-count");
    return (p: number) => {
      let settled = 0;
      const moving: Element[] = [];
      for (const { tile, node, tint, glitch, slice, annotation } of tiles) {
        const pose = portraitPose(p, tile);
        node.setAttribute("transform", tileTransform(pose));
        tint?.setAttribute("opacity", pose.tint.toFixed(4));
        glitch?.setAttribute("opacity", pose.glitch.toFixed(4));
        slice?.setAttribute(
          "transform",
          `translate(${pose.shift.toFixed(3)} 0)`,
        );
        annotation?.setAttribute("opacity", pose.annotation.toFixed(4));
        const inPlace = pose.settled;
        node.setAttribute("data-swapping", String(pose.swapping));
        if (pose.swapping) moving.push(node);
        if (inPlace) settled++;
        node.setAttribute("data-settled", String(inPlace));
      }
      const pair = moving
        .map((node) => node.getAttribute("data-portrait-tile"))
        .join(",");
      if (pair !== activePair) {
        // Keep the exchanging pair above stationary tiles on its path.
        moving.forEach((node) => complete?.before(node));
        activePair = pair;
      }
      if (count) count.textContent = `${String(settled).padStart(2, "0")} / 25`;
      if (status)
        status.textContent = p >= 0.99 ? "SIGNAL RESTORED" : "RECONSTRUCTING";
      // A whole-image finish removes subpixel seams between adjacent SVG clips.
      complete?.setAttribute("opacity", String(ease(interval(p, 0.985, 1))));
      host.dataset.portrait = p >= 0.99 ? "assembled" : "scrambled";
    };
  }
  if (concept === "bench") {
    const board = find("bench-board"),
      panel = find("bench-panel");
    const sketch = find("bench-sketch"),
      ui = find("bench-ui");
    const toggle = find("bench-toggle"),
      check = find("bench-check"),
      lamp = find("bench-lamp");
    const screen = find("bench-screen-status"),
      device = find("bench-device-status"),
      ack = find("bench-ack");
    const command = find("bench-command"),
      response = find("bench-response");
    const route = find("bench-route") as SVGPathElement;
    const returnRoute = find("bench-return") as SVGPathElement;
    const routeLength = route.getTotalLength(),
      returnLength = returnRoute.getTotalLength();
    const packet = (
      node: Element | null,
      path: SVGPathElement,
      length: number,
      share: number,
    ) => {
      const point = path.getPointAtLength(length * share);
      node?.setAttribute("cx", String(point.x));
      node?.setAttribute("cy", String(point.y));
      node?.setAttribute(
        "opacity",
        String(Math.min(1, share * 12, (1 - share) * 12)),
      );
    };
    return (p: number) => {
      const pose = benchPose(p);
      translate(board, 0, 0, pose.boardLift);
      translate(panel, 0, pose.panelOut);
      sketch?.setAttribute("opacity", String(1 - pose.ui));
      ui?.setAttribute("opacity", String(pose.ui));
      toggle?.setAttribute("cx", String(117 + 10 * clamp((p - 0.53) / 0.05)));
      toggle?.setAttribute("data-on", String(p > 0.55));
      check?.setAttribute("opacity", String(pose.confirmed));
      lamp?.setAttribute("data-on", String(pose.device > 0.5));
      if (screen)
        screen.textContent =
          pose.confirmed > 0.5 ? "ONLINE" : p > 0.55 ? "SENDING" : "READY";
      if (device) device.textContent = pose.device > 0.5 ? "ACTIVE" : "STANDBY";
      if (ack)
        ack.textContent =
          pose.confirmed > 0.5 ? "CONFIRMED" : p > 0.78 ? "REPLY…" : "WAITING";
      packet(command, route, routeLength, pose.command);
      packet(response, returnRoute, returnLength, pose.response);
      host.dataset.deviceState = pose.device > 0.5 ? "on" : "off";
    };
  }
  const gantry = find("plot-gantry"),
    carriage = find("plot-carriage"),
    pen = find("plot-pen");
  const display = find("plot-display");
  const strokes = [...host.querySelectorAll("[data-plot-stroke]")];
  return (p: number) => {
    const pose = plotterPose(p);
    translate(gantry, 0, pose.y - 5);
    translate(carriage, pose.x, 0);
    translate(pen, 0, 0, pose.lift);
    strokes.forEach((stroke, i) =>
      stroke.setAttribute(
        "stroke-dashoffset",
        String(Math.max(0, strokeLengths[i] - pose.ink[i])),
      ),
    );
    if (display)
      display.textContent = pose.done ? "DONE" : p > 0.06 ? "DRAWING" : "READY";
    host.dataset.pen = pose.lift > 0.1 ? "up" : "down";
    host.dataset.drawing = pose.done ? "complete" : "in-progress";
  };
}

export function HeroLabScene({
  concept,
  locale,
  children,
}: {
  concept: Concept;
  locale: Locale;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState(0);
  const content = copy[locale][concept];
  const number =
    concept === "bench" ? "01" : concept === "plotter" ? "02" : "03";
  const nextHref =
    concept === "bench"
      ? "#plotter"
      : concept === "plotter"
        ? "#portrait"
        : "#comparison";
  const nextLabel =
    locale === "pl"
      ? concept === "bench"
        ? "Zobacz ploter"
        : concept === "plotter"
          ? "Zobacz portret"
          : "Porównaj kierunki"
      : concept === "bench"
        ? "See the plotter"
        : concept === "plotter"
          ? "See the portrait"
          : "Compare concepts";

  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const sticky = host.querySelector<HTMLElement>(".hl-sticky")!;
    const paintArt = prepareArt(host, concept);
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let last = 0;
    let current = 0;
    let target = 0;
    let selected = -1;
    let top = 112;
    let range = 1;
    function measure() {
      top = parseFloat(getComputedStyle(sticky).top) || 0;
      range = Math.max(1, host!.offsetHeight - sticky.offsetHeight);
    }
    function paint(p: number) {
      paintArt(p);
      host!.dataset.progress = p.toFixed(4);
      const next = p < 0.16 ? 0 : p < 0.53 ? 1 : p < 0.94 ? 2 : 3;
      if (next !== selected) {
        selected = next;
        setPhase(next);
      }
    }
    function tick(now: number) {
      frame = 0;
      if (!visible || document.hidden || media.matches) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      current += (target - current) * (1 - Math.exp(-dt / 0.075));
      if (Math.abs(target - current) < 0.0002) current = target;
      paint(current);
      if (current !== target) frame = requestAnimationFrame(tick);
    }
    function schedule() {
      if (media.matches || !visible || document.hidden) return;
      target = clamp((top - host!.getBoundingClientRect().top) / range);
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    }
    function resized() {
      measure();
      schedule();
    }
    function motionChanged() {
      cancelAnimationFrame(frame);
      frame = 0;
      host!.dataset.reduced = String(media.matches);
      if (media.matches) {
        current = 1;
        paint(1);
      } else schedule();
    }
    measure();
    motionChanged();
    if (!media.matches) paint(0);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else schedule();
    });
    observer.observe(host);
    const resize = new ResizeObserver(resized);
    resize.observe(host);
    resize.observe(sticky);
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", resized);
    document.addEventListener("visibilitychange", schedule);
    media.addEventListener("change", motionChanged);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", resized);
      document.removeEventListener("visibilitychange", schedule);
      media.removeEventListener("change", motionChanged);
    };
  }, [concept, locale]);

  return (
    <section
      ref={root}
      id={concept}
      className="hl-run"
      aria-labelledby={`${concept}-title`}
    >
      <div className="hl-sticky">
        <div className="hl-copy">
          <div className="hl-eyebrow">
            <span />
            {number} / {content.subtitle}
          </div>
          <h2 id={`${concept}-title`}>{content.title}</h2>
          <p className="hl-description">{content.description}</p>
          <div className="hl-caption">
            <span>{String(phase + 1).padStart(2, "0")}</span>
            <p>{content.captions[phase]}</p>
          </div>
          <a className="hl-next" href={nextHref}>
            {nextLabel} <span aria-hidden="true">↓</span>
          </a>
        </div>
        <figure className="hl-figure iso-plate" aria-label={content.subtitle}>
          <div className="hl-figure-heading">
            <span>FIG. {number}</span>
            <span>{content.subtitle}</span>
          </div>
          {children}
        </figure>
      </div>
    </section>
  );
}
