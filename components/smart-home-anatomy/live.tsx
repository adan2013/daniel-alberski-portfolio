"use client";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/projects";
import { CaseStudyFigure } from "../case-study-figure";
import { useCaseStudyProgress } from "../use-case-study-progress";
import { homeCopy, homePose, homeStops, homeStepDurations } from "./model";
import {
  homeViewBox,
  homeReturnRoutes,
  homeToggleGeometry,
  homeRoutes as routes,
  homeAckPath as ackPath,
  homeFanoutPhone as fanoutPhone,
  homeFanoutTablet as fanoutTablet,
  homeProcessPath,
  homeTransmitPath,
} from "./layout";
function setup(host: HTMLDivElement) {
  const parts = Object.fromEntries(
    Array.from(host.querySelectorAll<SVGElement>("[data-sh]")).map((el) => [
      el.dataset.sh!,
      el,
    ]),
  );
  const nodes = Array.from(
    host.querySelectorAll<SVGGElement>("[data-sh-node]"),
  );
  const basePaths = Array.from(
    host.querySelectorAll<SVGPathElement>("[data-sh-base]"),
  );
  const paths = Object.fromEntries(
    Array.from(host.querySelectorAll<SVGPathElement>("[data-sh-route]")).map(
      (el) => [el.dataset.shRoute!, { el, length: el.getTotalLength() }],
    ),
  );
  const move = (packet: string, route: string, t: number) => {
    const { el, length } = paths[route];
    const point = el.getPointAtLength(t * length);
    parts[packet].setAttribute("transform", `translate(${point.x} ${point.y})`);
  };
  const opacity = (name: string, value: number) =>
    parts[name].setAttribute("opacity", String(value));
  const setRoute = (name: string, amount: number) => {
    const { el, length } = paths[name];
    el.style.strokeDasharray = String(length);
    el.style.strokeDashoffset = String(length * (1 - amount));
    el.dataset.active = String(amount > 0);
    el.setAttribute(
      "marker-end",
      amount > 0.99 && el.classList.contains("sh-command-link")
        ? "url(#sh-arrow)"
        : "none",
    );
  };
  return (progress: number) => {
    const p = homePose(progress);
    const returning = progress > 0.7;
    host.dataset.direction = returning ? "reverse" : "forward";
    for (const path of basePaths) {
      const name = path.dataset.shBase as keyof typeof routes;
      path.setAttribute("d", returning ? homeReturnRoutes[name] : routes[name]);
      path.dataset.shDirection = returning ? "reverse" : "forward";
      path.setAttribute("marker-end", returning ? "none" : "url(#sh-arrow)");
      if (returning) {
        const length = path.getTotalLength();
        const end = path.getPointAtLength(length);
        const before = path.getPointAtLength(length - 1);
        const angle =
          (Math.atan2(end.y - before.y, end.x - before.x) * 180) / Math.PI;
        parts[`return-arrow-${name}`].setAttribute(
          "transform",
          `translate(${end.x} ${end.y}) rotate(${angle})`,
        );
      }
    }
    const selected = [
      [],
      ["phone", "backend"],
      ["backend"],
      ["ha"],
      ["dongle", "socket"],
      ["socket"],
      ["dongle", "ha", "backend"],
      ["phone", "tablet"],
    ][p.stage];
    for (const node of nodes) {
      const active = selected.includes(node.dataset.shNode!);
      node.dataset.active = String(active);
      node.style.opacity = "1";
    }
    opacity("return-arrows", returning ? 1 : 0);
    opacity("backend-work", p.processing);
    opacity("backend-idle", 1 - p.processing);
    opacity("ha-route", p.homeAssistant);
    opacity("dongle-on", p.usb);
    opacity("wireless", returning ? 0 : p.radio);
    opacity("wireless-return", returning ? 1 - p.fanout : 0);
    parts["wireless"].dataset.active = String(!returning && p.radio > 0);
    parts["wireless-return"].dataset.active = String(returning && p.fanout < 1);
    host.dataset.radioEmitter = returning
      ? p.fanout < 1
        ? "socket"
        : "none"
      : p.radio > 0
        ? "dongle"
        : "none";
    opacity("socket-on", p.socket);
    parts["socket-on"].dataset.state = p.socket > 0.99 ? "on" : "off";
    parts["socket-connected"].dataset.state = "on";
    for (const side of ["left", "right"]) {
      opacity(`tablet-led-${side}`, p.notification);
      opacity(`tablet-light-${side}`, p.notification);
      parts[`tablet-led-${side}`].dataset.state =
        p.notification > 0.99 ? "on" : "off";
    }
    opacity("tablet-notification", p.notification);
    opacity("tablet-empty", 1 - p.notification);
    parts["tablet-notification"].setAttribute(
      "transform",
      `translate(0 ${8 * (1 - p.notification)})`,
    );
    parts["tablet-notification"].dataset.state =
      p.notification > 0.99 ? "visible" : "hidden";
    parts["tablet-notification-count"].textContent =
      p.notification > 0.99 ? "1" : "0";
    for (const device of ["phone", "tablet"] as const) {
      opacity(`${device}-on`, p.confirmed);
      parts[`${device}-knob`].setAttribute(
        "transform",
        `translate(${p.confirmed * homeToggleGeometry[device].travel} 0)`,
      );
      parts[`${device}-text`].textContent = p.confirmed > 0.99 ? "ON" : "OFF";
    }

    setRoute("phone", returning ? 0 : p.command);
    setRoute("backend", returning ? 0 : p.homeAssistant);
    setRoute("usb", returning ? 0 : p.usb);
    setRoute("radio", returning ? 0 : p.radio);
    setRoute("ack", p.feedback);
    setRoute("fanout-phone", p.fanout);
    setRoute("fanout-tablet", p.fanout);
    // A packet remains visible at its receiving port at every settled scene.
    opacity("command", progress > 0 && progress <= 0.7 ? 1 : 0);
    if (progress <= 0.14) move("command", "phone", p.command);
    else if (progress <= 0.28) move("command", "process", p.processing);
    else if (progress <= 0.42) move("command", "backend", p.homeAssistant);
    else
      move(
        "command",
        "transmit",
        Math.max(0, Math.min(1, (progress - 0.42) / 0.14)),
      );
    opacity("ack", progress > 0.7 && progress <= 0.84 ? 1 : 0);
    // Keep the packet's 24-unit half-width and the endpoint arrowhead clear.
    move("ack", "ack", p.feedback * (1 - 40 / paths.ack.length));
    for (const device of ["phone", "tablet"] as const) {
      opacity(`fanout-${device}`, progress > 0.84 ? 1 : 0);
      const route = `fanout-${device}`;
      move(route, route, p.fanout * (1 - 16 / paths[route].length));
    }
    host.dataset.deviceState = p.socket > 0.99 ? "on" : "off";
    host.dataset.dashboards = p.confirmed > 0.99 ? "on" : "off";
    host.dataset.flowStage = String(p.stage);
    host.dataset.notification = p.notification > 0.99 ? "visible" : "hidden";
    return false;
  };
}
function Packet({
  name,
  returned = false,
}: {
  name: string;
  returned?: boolean;
}) {
  return (
    <g
      data-sh={name}
      opacity="0"
      className={returned ? "sh-packet sh-return" : "sh-packet"}
    >
      <rect x="-24" y="-13" width="48" height="26" rx="5" />
      <text x={returned ? -6 : 0} y="4">
        ON
      </text>
      {returned ? <path className="sh-packet-check" d="m7 0 4 4 7-8" /> : null}
    </g>
  );
}
export function SmartHomeLive({
  locale,
  devices,
}: {
  locale: Locale;
  devices: ReactNode;
}) {
  const copy = homeCopy[locale];
  const { root, scene, onSceneChange } = useCaseStudyProgress({
    stops: homeStops,
    stepDurations: homeStepDurations,
    setup,
  });
  return (
    <div ref={root} className="smart-home-anatomy" aria-label={copy.title}>
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
          viewBox={homeViewBox}
          className="case-figure-stage sh-stage"
          role="img"
          aria-label={copy.description}
        >
          <defs>
            <radialGradient id="sh-shadow">
              <stop stopColor="#4b6240" stopOpacity=".2" />
              <stop offset="1" stopColor="#4b6240" stopOpacity="0" />
            </radialGradient>
            <marker
              id="sh-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path
                d="m1 1 7 4-7 4"
                fill="none"
                stroke="context-stroke"
                strokeWidth="1.5"
              />
            </marker>
          </defs>
          <g className="sh-links">
            {Object.entries(routes).map(([name, d]) => (
              <path
                key={name}
                data-sh-base={name}
                data-sh-direction="forward"
                d={d}
                className={
                  name === "radio" ? "sh-link sh-radio-link" : "sh-link"
                }
                markerEnd="url(#sh-arrow)"
              />
            ))}
          </g>
          <path
            data-sh-route="process"
            d={homeProcessPath}
            fill="none"
            stroke="none"
          />
          <path
            data-sh-route="transmit"
            d={homeTransmitPath}
            fill="none"
            stroke="none"
          />
          <g className="sh-active-links">
            {Object.entries(routes)
              .filter(([name]) => name !== "tablet")
              .map(([name, d]) => (
                <path
                  key={name}
                  data-sh-route={name}
                  d={d}
                  className="sh-command-link"
                />
              ))}
            <path
              data-sh-route="ack"
              d={ackPath}
              className="sh-feedback-link"
            />
            <path
              data-sh-route="fanout-phone"
              d={fanoutPhone}
              className="sh-feedback-link"
            />
            <path
              data-sh-route="fanout-tablet"
              d={fanoutTablet}
              className="sh-feedback-link"
            />
          </g>
          {devices}
          {/* One return arrow per connection, anchored to its receiving endpoint. */}
          <g
            data-sh="return-arrows"
            opacity="0"
            fill="none"
            stroke="#597c48"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {Object.keys(routes).map((name) => (
              <path
                key={name}
                data-sh={`return-arrow-${name}`}
                data-sh-return-arrow={name}
                d="m-7-4 7 4-7 4"
              />
            ))}
          </g>
          <text x="230" y="111" className="sh-edge-label">
            WebSocket
          </text>
          <text
            x="247"
            y="271"
            className="sh-edge-label"
            transform="rotate(-90 247 271)"
          >
            WebSocket
          </text>
          <text x="750" y="260" className="sh-edge-label">
            USB
          </text>
          <text x="548" y="398" className="sh-edge-label">
            Zigbee
          </text>
          <g data-sh="wireless" opacity="0" className="sh-wireless">
            <path d="M598 316q-7 7-7 17M590 311q-11 10-11 25M582 306q-15 14-15 33" />
          </g>
          <g
            data-sh="wireless-return"
            opacity="0"
            data-active="false"
            className="sh-wireless sh-wireless-return"
            transform="translate(467 321) rotate(-25)"
          >
            <path d="M0-9Q8 0 0 9M7-15Q20 0 7 15M14-21Q32 0 14 21" />
          </g>
          <Packet name="command" />
          <Packet name="ack" returned />
          <Packet name="fanout-phone" returned />
          <Packet name="fanout-tablet" returned />
          <g transform="translate(250 515)">
            <path d="M0 0h22" className="sh-legend-command" />
            <text x="30" y="4" className="sh-legend-label">
              {copy.request}
            </text>
            <path d="M145 0h22" className="sh-legend-return" />
            <text x="175" y="4" className="sh-legend-label">
              {copy.state}
            </text>
          </g>
        </svg>
      </CaseStudyFigure>
    </div>
  );
}
