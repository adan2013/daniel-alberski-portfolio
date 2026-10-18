"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  useContactProgress,
  type ContactProgress,
} from "@/components/contact-progress";
import type { Locale } from "@/lib/i18n";
import { pathOf, type Flat } from "../anatomy/iso-kit";
import {
  burnStep,
  clampToWork,
  displayText,
  eraseRadius,
  insideWork,
  nozzleY,
  laserCopy,
  maxCuts,
  onSheet,
  home,
  park,
  pointAt,
  plan,
  speeds,
  type Cut,
  type LaserMode,
  offset,
  type XY,
} from "./model";

const SVG = "http://www.w3.org/2000/svg";

type LiveCut = {
  cut: Cut;
  /** Share of the kerf already cut. */
  p: number;
  /** Opacity of the dropped-out piece. */
  hole: number;
  piece: SVGPathElement;
  kerf: SVGPathElement;
  scorch: SVGPathElement;
  node: SVGGElement;
};
type Burn = { x: number; y: number; r: number; node: SVGCircleElement };

function translate(node: Element | null, x: number, y: number) {
  const [dx, dy] = offset(x, y);
  node?.setAttribute(
    "transform",
    `translate(${dx.toFixed(3)} ${dy.toFixed(3)})`,
  );
}

export function LaserCutter({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const text = laserCopy[locale];
  const progress = useContactProgress();
  // The latest form progress, read when the machine is set up, and the
  // machine's handler for every later change.
  const latest = useRef(progress);
  const follow = useRef<((next: ContactProgress) => void) | null>(null);
  useEffect(() => {
    latest.current = progress;
    follow.current?.(progress);
  }, [progress]);

  useEffect(() => {
    const host = root.current!;
    const find = <T extends Element>(name: string) =>
      host.querySelector<T>(`[data-${name}]`);
    const svg = host.querySelector("svg")!;
    const art = find<SVGGElement>("lc-root")!;
    const gantry = find("plot-gantry"),
      carriage = find("plot-carriage");
    const cutsLayer = find("lc-cuts")!,
      burnsLayer = find("lc-burns")!;
    const sparks = find("lc-sparks"),
      display = find("lc-display");
    const media = matchMedia("(prefers-reduced-motion: reduce)");

    let head: XY = [...park];
    let client: [number, number] | null = null;
    let target = 0;
    let idle = 1;
    // Typing takes the head away from the cursor until the mouse moves again.
    let typing = false;
    // After a send the cut sheet stays on the bed until a new message starts.
    let sentSeen = latest.current.sent;
    let showingSent = false;
    let button = -1;
    // A click shorter than a frame still shows the beam for a moment.
    let flashUntil = 0;
    let flashButton = 0;
    let lastBurn: Burn | null = null;
    let mode: LaserMode = "track";
    let laser: "off" | "red" | "blue" = "off";
    let frame = 0;
    let last = 0;
    let visible = false;
    const cuts: LiveCut[] = [];
    const burns: Burn[] = [];
    const shown = { mode: "", laser: "" };
    let painted: XY = head;
    let movingUntil = 0;

    function cursor(): XY | null {
      const matrix = art.getScreenCTM();
      if (!client || !matrix) return null;
      const local = new DOMPoint(client[0], client[1]).matrixTransform(
        matrix.inverse(),
      );
      return onSheet(local.x, local.y);
    }

    function addCut() {
      const cut = plan[cuts.length];
      const node = document.createElementNS(SVG, "g");
      const make = (className: string) => {
        const path = document.createElementNS(SVG, "path");
        path.setAttribute("class", className);
        path.setAttribute("d", pathOf(cut.points as Flat[]));
        node.append(path);
        return path;
      };
      const piece = make(cut.hole ? "lc-hole is-hole" : "lc-hole");
      const scorch = make("lc-scorch iso-line");
      const kerf = make("lc-kerf iso-line");
      piece.setAttribute("opacity", "0");
      for (const path of [scorch, kerf]) {
        path.setAttribute("stroke-dasharray", `${cut.length} ${cut.length}`);
        path.setAttribute("stroke-dashoffset", String(cut.length));
      }
      cutsLayer.append(node);
      const live = { cut, p: 0, hole: 0, piece, kerf, scorch, node };
      cuts.push(live);
      return live;
    }

    function paintCut(live: LiveCut) {
      const left = (live.cut.length * (1 - live.p)).toFixed(2);
      live.kerf.setAttribute("stroke-dashoffset", left);
      live.scorch.setAttribute("stroke-dashoffset", left);
      live.piece.setAttribute("opacity", live.hole.toFixed(3));
    }

    function burnAt([x, y]: XY) {
      if (burns.length >= 2400) return;
      const node = document.createElementNS(SVG, "circle");
      node.setAttribute("class", "lc-burn");
      node.setAttribute("cx", x.toFixed(2));
      node.setAttribute("cy", y.toFixed(2));
      node.setAttribute("r", "1.3");
      burnsLayer.append(node);
      lastBurn = { x, y, r: 1.3, node };
      burns.push(lastBurn);
    }

    function eraseAt([x, y]: XY) {
      for (let i = burns.length - 1; i >= 0; i--) {
        const burn = burns[i];
        if (Math.hypot(burn.x - x, burn.y - y) > eraseRadius + burn.r) continue;
        burns.splice(i, 1);
        burn.node.classList.add("is-erasing");
        setTimeout(() => burn.node.remove(), 320);
        if (burn === lastBurn) lastBurn = null;
      }
    }

    function moveToward(goal: XY, distance: number) {
      const dx = goal[0] - head[0],
        dy = goal[1] - head[1];
      const length = Math.hypot(dx, dy);
      if (length <= distance) head = goal;
      else
        head = [
          head[0] + (dx / length) * distance,
          head[1] + (dy / length) * distance,
        ];
    }

    function step(dt: number) {
      const reduced = media.matches;
      const pending =
        Math.abs(target - cuts.length) + ((cuts.at(-1)?.p ?? 1) < 1 ? 1 : 0);
      const boost = reduced
        ? 1e4
        : Math.min(speeds.maxBoost, 1 + Math.max(0, pending - 1) * 0.35);
      const top = cuts.at(-1);
      const undo = cuts.length > target;
      let job: LiveCut | null = null;
      if (undo) job = top!;
      else if (top && top.p < 1) job = top;
      else if (cuts.length < target) job = addCut();
      for (const live of cuts) {
        const want = live === job && undo ? 0 : live.p >= 1 ? 1 : 0;
        const rate = reduced ? 1 : dt / 0.22;
        live.hole += Math.max(-rate, Math.min(rate, want - live.hole));
      }
      laser = "off";
      if (job) {
        idle = 0;
        typing = true;
        button = -1;
        const goal = pointAt(job.cut, job.p);
        if (Math.hypot(goal[0] - head[0], goal[1] - head[1]) > 0.35) {
          mode = "travel";
          const near = Math.hypot(goal[0] - head[0], goal[1] - head[1]);
          moveToward(
            goal,
            Math.min(speeds.travel * boost, near * 14 + 30) * dt,
          );
        } else if (undo) {
          mode = "undo";
          laser = "blue";
          if (job.hole <= 0.02) {
            job.p = Math.max(
              0,
              job.p - (speeds.cut * boost * dt) / job.cut.length,
            );
          }
          head = pointAt(job.cut, job.p);
          if (job.p <= 0) {
            job.node.remove();
            cuts.pop();
          }
        } else {
          mode = "cut";
          laser = "red";
          job.p = Math.min(
            1,
            job.p + (speeds.cut * boost * dt) / job.cut.length,
          );
          head = pointAt(job.cut, job.p);
        }
      } else {
        idle += dt;
        // The head parked after a job is ready, not steered.
        mode = typing || idle <= 0.45 ? "ready" : "track";
        if (typing && (finished() || showingSent)) {
          // The sheet is cut or sent: home the head and report it.
          const near = Math.hypot(home[0] - head[0], home[1] - head[1]);
          moveToward(
            home,
            reduced ? near : Math.min(speeds.travel, near * 6 + 20) * dt,
          );
          mode = near > 0.02 ? "homing" : showingSent ? "sent" : "done";
        }
        if (idle > 0.45 && !typing) {
          const goal = clampToWork(cursor() ?? park);
          const follow = reduced ? 1 : 1 - Math.exp(-dt / 0.09);
          const dx = goal[0] - head[0],
            dy = goal[1] - head[1];
          head =
            Math.hypot(dx, dy) < 0.02
              ? goal
              : [head[0] + dx * follow, head[1] + dy * follow];
          if (button === 0) {
            mode = "burn";
            laser = "red";
            const gap = lastBurn
              ? Math.hypot(lastBurn.x - head[0], lastBurn.y - head[1])
              : Infinity;
            if (gap >= burnStep) burnAt(head);
            else if (lastBurn && lastBurn.r < 3) {
              // A dwelling beam keeps burning a wider mark.
              lastBurn.r = Math.min(3, lastBurn.r + dt * 1.4);
              lastBurn.node.setAttribute("r", lastBurn.r.toFixed(2));
            }
          } else if (button === 2) {
            mode = "erase";
            laser = "blue";
            eraseAt(head);
          } else if (performance.now() < flashUntil) {
            mode = flashButton ? "erase" : "burn";
            laser = flashButton ? "blue" : "red";
          }
        }
      }
    }

    function paint() {
      // The second panel lamp shows the head moving, held briefly so that
      // single still frames do not make it flicker.
      const now = performance.now();
      if (Math.hypot(head[0] - painted[0], head[1] - painted[1]) > 0.04)
        movingUntil = now + 140;
      painted = head;
      const moving = now < movingUntil;
      if (host.dataset.moving !== String(moving))
        host.dataset.moving = String(moving);
      cuts.forEach(paintCut);
      translate(gantry, 0, head[1] - nozzleY);
      translate(carriage, head[0], 0);
      if (sparks) {
        if (laser === "off" || media.matches) sparks.setAttribute("d", "");
        else {
          let d = "";
          for (let i = 0; i < 4; i++) {
            const t = Math.random() * Math.PI * 2;
            const from = 1.2 + Math.random() * 1.5;
            const to = from + 1.5 + Math.random() * 3.5;
            d += `M${(Math.cos(t) * from).toFixed(2)} ${(Math.sin(t) * from).toFixed(2)}L${(Math.cos(t) * to).toFixed(2)} ${(Math.sin(t) * to).toFixed(2)}`;
          }
          sparks.setAttribute("d", d);
        }
      }
      const done = cuts.filter((live) => live.p >= 1).length;
      const next = { mode: displayText(mode, moving), laser };
      if (next.mode !== shown.mode && display) display.textContent = next.mode;
      if (next.laser !== shown.laser) host.dataset.laser = laser;
      Object.assign(shown, next);
      host.dataset.mode = mode;
      host.dataset.cuts = String(done);
      host.dataset.burns = String(burns.length);
    }

    function finished() {
      return cuts.length === plan.length && cuts.every((live) => live.p >= 1);
    }

    function settled() {
      if (cuts.length !== target || (cuts.at(-1) && cuts.at(-1)!.p < 1))
        return false;
      if (cuts.some((live) => live.hole > 0 && live.hole < 1)) return false;
      if (button >= 0 || performance.now() < flashUntil || idle <= 0.45)
        return false;
      if (typing)
        return (
          !(finished() || showingSent) ||
          Math.hypot(home[0] - head[0], home[1] - head[1]) < 0.02
        );
      const goal = clampToWork(cursor() ?? park);
      return Math.hypot(goal[0] - head[0], goal[1] - head[1]) < 0.02;
    }

    function tick(now: number) {
      frame = 0;
      if (!visible || document.hidden) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      step(dt);
      paint();
      if (!settled() || performance.now() < movingUntil)
        frame = requestAnimationFrame(tick);
      else {
        laser = "off";
        paint();
      }
    }
    function wake() {
      if (!frame && visible && !document.hidden) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    }

    function apply({ typed, sent }: ContactProgress) {
      if (sent !== sentSeen) {
        // Sent: keep the sheet, let a cut in progress finish, then report.
        sentSeen = sent;
        showingSent = true;
        typing = true;
        target = cuts.length;
      } else if (showingSent && typed > 0) {
        // A new message loads a fresh sheet.
        showingSent = false;
        for (const live of cuts) live.node.remove();
        cuts.length = 0;
      }
      if (!showingSent) target = Math.min(maxCuts, typed);
      wake();
    }

    function moved(event: PointerEvent) {
      if (
        client &&
        client[0] === event.clientX &&
        client[1] === event.clientY &&
        event.type === "pointermove"
      )
        return;
      client = [event.clientX, event.clientY];
      typing = false;
      wake();
    }
    function pressed(event: PointerEvent) {
      moved(event);
      if (event.button !== 0 && event.button !== 2) return;
      const point = cursor();
      if (!point || !insideWork(point, 3)) return;
      event.preventDefault();
      button = event.button;
      lastBurn = null;
      if (idle > 0.45) {
        flashUntil = performance.now() + 200;
        flashButton = button;
        if (button === 0) burnAt(head);
        else eraseAt(head);
      }
      wake();
    }
    const released = () => {
      button = -1;
      wake();
    };
    const menu = (event: Event) => event.preventDefault();

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else wake();
    });
    observer.observe(host);
    host.dataset.laser = "off";
    paint();
    apply(latest.current);
    follow.current = apply;
    addEventListener("pointermove", moved, { passive: true });
    addEventListener("pointerup", released);
    addEventListener("pointercancel", released);
    addEventListener("blur", released);
    addEventListener("scroll", wake, { passive: true });
    document.addEventListener("visibilitychange", wake);
    svg.addEventListener("pointerdown", pressed);
    svg.addEventListener("contextmenu", menu);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      follow.current = null;
      removeEventListener("pointermove", moved);
      removeEventListener("pointerup", released);
      removeEventListener("pointercancel", released);
      removeEventListener("blur", released);
      removeEventListener("scroll", wake);
      document.removeEventListener("visibilitychange", wake);
      svg.removeEventListener("pointerdown", pressed);
      svg.removeEventListener("contextmenu", menu);
      cutsLayer.replaceChildren();
      burnsLayer.replaceChildren();
    };
  }, [locale]);

  return (
    <figure ref={root} className="lc-figure" aria-label={text.subtitle}>
      {children}
    </figure>
  );
}
