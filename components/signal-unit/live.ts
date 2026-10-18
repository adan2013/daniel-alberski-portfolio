import { translateAlong, type Point3 } from "../anatomy/iso-kit";
import { cablePath } from "./geo";
import {
  camera as P,
  assemblyPose,
  leadCable,
  leadPlugAt,
  usbCable,
  usbPlugAt,
  type AssemblyPose,
  type DropName,
} from "./model";

const cableDrops = new Set<DropName>([
  "harness",
  "ribbon",
  "sata",
  "coax",
  "wires",
]);
const meterModes = [
  { label: "V⎓", angle: -64.4 },
  { label: "Ω", angle: -21.6 },
  { label: "A⎓", angle: 21.2 },
  { label: "OFF", angle: -150 },
];
// Volume 00…20 sweeps the knob over its 270° scale.
const volMax = 20;
const volAngle = (v: number) => -135 + (270 * v) / volMax;
const welcomeMs = 1400;
const volShowMs = 1500;

/** Split text into eight 14-segment cells plus a colon or point after each. */
function cellsOf(text: string) {
  const cells: string[] = [];
  const marks: string[] = [];
  for (const ch of text) {
    if ((ch === ":" || ch === ".") && cells.length)
      marks[cells.length - 1] = ch;
    else cells.push(ch === " " ? "!" : ch);
  }
  const pad = Math.max(0, 8 - cells.length);
  return {
    cells: [...Array(pad).fill("!"), ...cells].slice(-8),
    marks: [
      ...Array(pad).fill(""),
      ...Array.from(cells, (_, i) => marks[i] ?? ""),
    ].slice(-8),
  };
}
const sub = (a: Point3, b: Point3): Point3 => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
];
const two = (n: number) => String(n).padStart(2, "0");
const fract = (n: number) => n - Math.floor(n);

export function prepareSignalUnit(host: HTMLElement) {
  const one = <T extends Element = SVGElement>(s: string) =>
    host.querySelector<T>(s);
  const all = (s: string) => [...host.querySelectorAll<SVGElement>(s)];
  const drops = all("[data-su-drop]").map((node) => ({
    node,
    name: node.dataset.suDrop as DropName,
  }));
  const cables = {
    usb: all('[data-su-cable="usb"]'),
    lead0: all('[data-su-cable="lead-0"]'),
    lead1: all('[data-su-cable="lead-1"]'),
  };
  const plugs = {
    usb: one('[data-su-plug="usb"]'),
    lead0: one('[data-su-plug="lead-0"]'),
    lead1: one('[data-su-plug="lead-1"]'),
  };
  const usbBody = cables.usb[1] as SVGPathElement;
  const packets = [0, 1, 2].map((i) => one(`[data-su-packet="${i}"]`));
  const ackPacket = one('[data-su-packet="ack"]');
  const leds = Object.fromEntries(
    all("[data-su-led]").map((n) => [n.dataset.suLed!, n]),
  );
  const ring = all("[data-su-ring]");
  const lcdCells = all("[data-su-lcd-cell]");
  const lcdMarks = all("[data-su-lcd-mark]");
  const lcdTag = one("[data-su-lcd-tag]");
  const lcdGlass = one("[data-su-lcd-glass]");
  const rocker = one("[data-su-rocker]");
  const knob = one("[data-su-knob]");
  const buttons = all("[data-su-button]");
  const spins = all("[data-su-spin]");
  const meterText = one("[data-su-meter]");
  const meterMode = one("[data-su-meter-mode]");
  const meterKnob = one("[data-su-meter-knob]");
  const views = Object.fromEntries(
    all("[data-su-view]").map((n) => [n.dataset.suView!, n]),
  );
  const progress = one("[data-su-progress]");
  const progressText = one("[data-su-progress-text]");
  const flashLine = one("[data-su-flash-line]");
  const ackLine = one("[data-su-ack-line]");
  const ping = one("[data-su-ping]");
  const enter = one("[data-su-enter]");
  const laptopClock = one("[data-su-clock-laptop]");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");

  const usbSeated = usbPlugAt(1);
  const leadSeated = [leadPlugAt(0, 1), leadPlugAt(1, 1)];
  let lastUsb = -1;
  const lastLead = [-1, -1];

  // Interactive state, kept across scrolling.
  let p = 0;
  let pose: AssemblyPose = assemblyPose(0);
  let userPower = true;
  let bootAt = -1e9;
  let mode = 0;
  let meterIndex = 0;
  let volume = 12;
  let volAt = -1e9;
  let drag: { x: number; v: number; id: number } | null = null;
  let knobAngle = -135;
  let pingLive = true;
  let meterAngle = meterModes[0].angle;
  let pingAt = -1e9;
  let lastAck = "";
  const pressAt = [-1e9, -1e9, -1e9, -1e9];
  let fanAngle = 0;
  let fanSpeed = 0;
  let last = 0;
  let frame = 0;
  let visible = false;

  const set = (n: Element | null, k: string, v: string) => {
    if (n && n.getAttribute(k) !== v) n.setAttribute(k, v);
  };
  const text = (n: Element | null, v: string) => {
    if (n && n.textContent !== v) n.textContent = v;
  };
  const move = (n: Element | null, d: Point3) =>
    set(n, "transform", translateAlong(P, d));
  const packetAt = (n: Element | null, share: number, alpha: number) => {
    if (!n || !usbBody) return;
    const length = usbBody.getTotalLength();
    const pt = usbBody.getPointAtLength(
      length * Math.max(0, Math.min(1, share)),
    );
    set(n, "cx", pt.x.toFixed(2));
    set(n, "cy", pt.y.toFixed(2));
    set(n, "opacity", alpha.toFixed(3));
  };

  function scroll(progressValue: number) {
    p = progressValue;
    pose = assemblyPose(p);
    for (const { node, name } of drops) {
      const fall = pose.fall[name];
      move(node, [0, 0, fall.z]);
      if (cableDrops.has(name)) set(node, "opacity", fall.o.toFixed(3));
    }
    if (pose.usb !== lastUsb) {
      lastUsb = pose.usb;
      const d = cablePath(usbCable(pose.usb), P, 8);
      cables.usb.forEach((n) => set(n, "d", d));
      move(plugs.usb, sub(usbPlugAt(pose.usb), usbSeated));
    }
    [0, 1].forEach((i) => {
      if (pose.leads === lastLead[i]) return;
      lastLead[i] = pose.leads;
      const d = cablePath(leadCable(i, pose.leads), P, 8);
      (i ? cables.lead1 : cables.lead0).forEach((n) => set(n, "d", d));
      move(
        i ? plugs.lead1 : plugs.lead0,
        sub(leadPlugAt(i, pose.leads), leadSeated[i]),
      );
    });
    // Laptop: editor → flasher → online card.
    set(views.code, "opacity", p < 0.6 ? "1" : "0");
    set(views.flash, "opacity", p < 0.6 ? "0" : "1");
    set(views.online, "opacity", pose.confirmed ? "1" : "0");
    set(progress, "width", (98 * pose.flash).toFixed(2));
    text(progressText, `${Math.round(48 * pose.flash)} / 48 kB`);
    text(
      flashLine,
      pose.flash >= 1
        ? pose.confirmed
          ? "ack received · fw 1.4 running"
          : pose.ack > 0
            ? "booted · waiting for ack…"
            : "verify OK · booting…"
        : "writing fw.bin…",
    );
    set(enter, "transform", p > 0.6 && p < 0.63 ? "translate(0 0.7)" : "");
    if (pose.boot < 1) knobAngle = -135 + (volAngle(volume) + 135) * pose.knob;
    host.dataset.suLive = String(pose.live);
    host.dataset.reading = pose.power && userPower ? "12.04" : "0";
    render(performance.now());
    wake();
  }

  function render(now: number) {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    const powered = pose.power && userPower;
    const booting = now - bootAt < welcomeMs;
    const booted = powered && pose.boot >= 1 && !booting;
    const clock = new Date();
    const hms = `${two(clock.getHours())}:${two(clock.getMinutes())}:${two(clock.getSeconds())}`;
    set(rocker, "data-on", String(userPower));
    set(leds.power, "data-on", String(powered));
    set(leds.run, "data-on", String(booted));
    const since = now - pingAt;
    const pinging = since < (pingLive ? 900 : 450);
    const flicker = pose.streaming && fract(p * 260) < 0.5;
    set(
      leds.data,
      "data-on",
      String(powered && (flicker || (pinging && fract(now / 90) < 0.5))),
    );
    set(
      leds.link,
      "data-on",
      String(powered && pose.confirmed && !(pinging && fract(now / 120) < 0.5)),
    );
    set(leds.laptop, "data-on", "true");
    set(lcdGlass, "data-on", String(powered));

    // Device LCD: eight 14-segment cells.
    let main = "";
    let tag = "";
    if (!powered) main = "";
    else if (pose.flash <= 0) [main, tag] = ["NO FW", "WAIT"];
    else if (pose.flash < 1)
      [main, tag] = [`LOAD ${two(Math.round(pose.flash * 99))}`, "USB"];
    else if (pose.boot < 1 || booting) [main, tag] = ["WELCOME", "HI"];
    else if (now - volAt < volShowMs)
      [main, tag] = [volume ? `VOL ${two(volume)}` : "MUTE", "VOL"];
    else if (mode === 0) [main, tag] = [hms, "TIME"];
    else if (mode === 1)
      [main, tag] = [
        `${(12.04 + (fract(now / 2400) > 0.5 ? 0.01 : 0)).toFixed(2)}V`,
        "VOLT",
      ];
    else if (mode === 2)
      [main, tag] = [`SIG-${40 + Math.round(4 * Math.sin(now / 700))}`, "dBm"];
    else [main, tag] = ["DIAG OK", "DIAG"];
    const { cells, marks } = cellsOf(main);
    lcdCells.forEach((n, i) => text(n, cells[i]));
    lcdMarks.forEach((n, i) => set(n, "data-mark", marks[i] ?? ""));
    text(lcdTag, tag || " ");

    // The knob only sets the volume; the ring lights up to its pointer,
    // except in DIAG, which runs a chase.
    const target = pose.boot < 1 ? knobAngle : volAngle(volume);
    knobAngle += (target - knobAngle) * (dt ? Math.min(1, dt / 0.06) : 1);
    set(knob, "transform", `rotate(${knobAngle.toFixed(2)})`);
    const chase =
      booted && mode === 3 && now - volAt >= volShowMs
        ? Math.floor(now / 110) % 11
        : -1;
    const pointer = booting
      ? -135 + 270 * Math.min(1, (now - bootAt) / welcomeMs)
      : knobAngle;
    ring.forEach((n, i) => {
      const angle = -135 + 27 * i;
      const on =
        powered && pose.boot > 0
          ? chase >= 0
            ? i === chase || i === (chase + 5) % 11
            : (booting || volume > 0) && angle <= pointer + 1
          : false;
      set(n, "data-on", String(on));
    });
    buttons.forEach((n, i) =>
      set(n, "transform", now - pressAt[i] < 160 ? "translate(0 0.7)" : ""),
    );

    // Multimeter on the +12 V post.
    const m = meterModes[meterIndex];
    meterAngle += (m.angle - meterAngle) * (dt ? Math.min(1, dt / 0.08) : 1);
    set(meterKnob, "transform", `rotate(${meterAngle.toFixed(2)} 28 67)`);
    text(meterMode, m.label === "OFF" ? " " : m.label);
    const plugged = pose.leads >= 1;
    text(
      meterText,
      m.label === "OFF"
        ? " "
        : m.label === "Ω"
          ? "0.L"
          : m.label === "A⎓"
            ? powered && plugged
              ? "0.38"
              : "0.00"
            : powered && plugged
              ? (
                  pose.volts + (booted && fract(now / 3100) > 0.7 ? 0.01 : 0)
                ).toFixed(2)
              : "0.00",
    );

    // Program stream to the unit, then the acknowledgement back.
    packets.forEach((n, i) => {
      if (pose.streaming) {
        const s = fract(pose.flash * 14 + i / 3);
        packetAt(n, 1 - s, Math.min(1, Math.sin(Math.PI * s) * 3));
      } else if (i === 0 && since < 450) {
        const s = since / 450;
        packetAt(n, 1 - s, Math.min(1, Math.sin(Math.PI * s) * 3));
      } else set(n, "opacity", "0");
    });
    if (pose.ack > 0 && pose.ack < 1)
      packetAt(
        ackPacket,
        pose.ack,
        Math.min(1, Math.sin(Math.PI * pose.ack) * 3),
      );
    else if (pingLive && since >= 450 && since < 900) {
      const s = (since - 450) / 450;
      packetAt(ackPacket, s, Math.min(1, Math.sin(Math.PI * s) * 3));
    } else set(ackPacket, "opacity", "0");
    set(ping, "data-on", String(pinging || (!pingLive && since < 1450)));
    // A ping to a unit switched off waits a second, then says so.
    set(
      views.noconn,
      "opacity",
      !pingLive && since > 1450 && since < 4200 ? "1" : "0",
    );
    text(ackLine, lastAck || "ack · 23 ms");

    // Fans: real time, eased spin-up and run-down.
    const want = powered && !reduced.matches ? 1 : 0;
    fanSpeed += (want - fanSpeed) * Math.min(1, dt * (want ? 1.6 : 0.7));
    fanAngle = (fanAngle + fanSpeed * 1100 * dt) % 360;
    spins.forEach((n, i) =>
      set(n, "transform", `rotate(${(fanAngle * (i ? 1 : 1.7)).toFixed(1)})`),
    );

    text(laptopClock, `${two(clock.getHours())}:${two(clock.getMinutes())}`);
  }

  function loop(now: number) {
    frame = 0;
    render(now);
    if (visible && !document.hidden) frame = requestAnimationFrame(loop);
  }
  function wake() {
    if (!frame && visible && !document.hidden)
      frame = requestAnimationFrame(loop);
  }

  // The meter works from the start; the unit's controls stay dead until
  // the story has brought it fully up.
  const frontReady = () => pose.live;
  const unitReady = (now: number) =>
    pose.live && userPower && now - bootAt >= welcomeMs;

  function onClick(event: Event) {
    const target = (event.target as Element).closest("[data-su-click]");
    if (!target) return;
    const what = target.getAttribute("data-su-click")!;
    const now = performance.now();
    if (what === "meter") meterIndex = (meterIndex + 1) % meterModes.length;
    else if (what === "power" && frontReady()) {
      userPower = !userPower;
      if (userPower) bootAt = now;
    } else if (what.startsWith("button-") && unitReady(now)) {
      const i = Number(what.slice(7));
      mode = i;
      pressAt[i] = now;
      volAt = -1e9;
    } else if (what === "ping" && pose.live && now - pingAt > 900) {
      pingAt = now;
      pingLive = userPower;
      const c = new Date();
      if (pingLive)
        lastAck = `ack · ${18 + Math.round(Math.random() * 12)} ms · ${two(c.getHours())}:${two(c.getMinutes())}:${two(c.getSeconds())}`;
    } else return;
    render(now);
    wake();
  }
  function onDown(event: PointerEvent) {
    const target = (event.target as Element).closest('[data-su-click="knob"]');
    if (!target || !unitReady(performance.now())) return;
    event.preventDefault();
    getSelection()?.removeAllRanges();
    drag = { x: event.clientX, v: volume, id: event.pointerId };
    (target as Element).setPointerCapture?.(event.pointerId);
  }
  function onMove(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.id) return;
    const next = Math.max(
      0,
      Math.min(volMax, Math.round(drag.v + (event.clientX - drag.x) / 7)),
    );
    if (next !== volume || performance.now() - volAt > volShowMs * 0.6) {
      volume = next;
      volAt = performance.now();
    }
    wake();
  }
  function onUp(event: PointerEvent) {
    if (drag && event.pointerId === drag.id) drag = null;
  }
  host.addEventListener("pointerdown", onDown);
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerup", onUp);
  host.addEventListener("pointercancel", onUp);
  host.addEventListener("click", onClick);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) wake();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  observer.observe(host);

  return Object.assign(scroll, {
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      host.removeEventListener("click", onClick);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
    },
  });
}
