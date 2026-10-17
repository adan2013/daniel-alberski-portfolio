export type Concept = "bench" | "plotter" | "portrait";
export type XY = readonly [number, number];

export const camera = {
  origin: [350, 335] as [number, number],
  scale: 1.13,
  azimuth: 66,
  elevation: 28,
};

export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export function interval(p: number, start: number, end: number) {
  return clamp((p - start) / (end - start));
}
export function ease(p: number) {
  const t = clamp(p);
  return t * t * (3 - 2 * t);
}
export function offset(x: number, y: number, z = 0) {
  const a = (camera.azimuth * Math.PI) / 180;
  const e = (camera.elevation * Math.PI) / 180;
  const k = camera.scale * Math.sqrt(1.6);
  return [
    (x * Math.sin(a) - y * Math.cos(a)) * k,
    ((x * Math.cos(a) + y * Math.sin(a)) * Math.sin(e) - z * Math.cos(e)) * k,
  ];
}

export function benchPose(p: number) {
  return {
    boardLift: 62 * (1 - ease(interval(p, 0.08, 0.35))),
    panelOut: 44 * (1 - ease(interval(p, 0.35, 0.53))),
    ui: ease(interval(p, 0.18, 0.4)),
    command: interval(p, 0.55, 0.72),
    response: interval(p, 0.78, 0.94),
    device: ease(interval(p, 0.72, 0.79)),
    confirmed: ease(interval(p, 0.94, 1)),
  };
}

// Every drawn stroke and every pen-up move uses the same physical XY path.
const rect = (x: number, y: number, w: number, h: number): XY[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
  [x, y],
];
export const drawing: readonly (readonly XY[])[] = [
  rect(-105, -64, 210, 143),
  [
    [-105, -42],
    [105, -42],
  ],
  rect(-93, -56, 7, 6),
  rect(-80, -56, 7, 6),
  rect(-67, -56, 7, 6),
  rect(-91, -28, 42, 91),
  [
    [-82, -17],
    [-58, -17],
  ],
  [
    [-82, -5],
    [-64, -5],
  ],
  [
    [-82, 7],
    [-60, 7],
  ],
  [
    [-82, 19],
    [-67, 19],
  ],
  rect(-36, -28, 127, 37),
  [
    [-25, -15],
    [61, -15],
  ],
  [
    [-25, -5],
    [37, -5],
  ],
  rect(-36, 22, 57, 41),
  rect(34, 22, 57, 41),
  [
    [-27, 53],
    [-16, 43],
    [-4, 48],
    [11, 32],
  ],
  [
    [44, 53],
    [53, 43],
    [64, 46],
    [80, 32],
  ],
];

type Segment = {
  from: XY;
  to: XY;
  start: number;
  length: number;
  stroke: number;
};
const segments: Segment[] = [];
let distance = 0;
let previous: XY = [-119, -62];
export const strokeLengths: number[] = [];
for (const [stroke, points] of drawing.entries()) {
  let ink = 0;
  for (const [index, to] of points.entries()) {
    const length = Math.hypot(to[0] - previous[0], to[1] - previous[1]);
    segments.push({
      from: previous,
      to,
      start: distance,
      length,
      stroke: index ? stroke : -1,
    });
    distance += length;
    if (index) ink += length;
    previous = to;
  }
  strokeLengths.push(ink);
}
const park: XY = [120, 75];
segments.push({
  from: previous,
  to: park,
  start: distance,
  length: Math.hypot(park[0] - previous[0], park[1] - previous[1]),
  stroke: -1,
});
const totalDistance = distance + segments.at(-1)!.length;

export function plotterPose(p: number) {
  const travel = interval(p, 0.06, 0.94) * totalDistance;
  const segment =
    segments.find((s) => travel <= s.start + s.length) ?? segments.at(-1)!;
  const local = segment.length
    ? clamp((travel - segment.start) / segment.length)
    : 1;
  const ink = drawing.map(() => 0);
  for (const s of segments) {
    if (s.stroke >= 0)
      ink[s.stroke] += Math.max(0, Math.min(s.length, travel - s.start));
  }
  return {
    x: segment.from[0] + (segment.to[0] - segment.from[0]) * local,
    y: segment.from[1] + (segment.to[1] - segment.from[1]) * local,
    // Lift within each travel segment; continuous at both ends of every stroke.
    lift: segment.stroke < 0 ? 8 * Math.sin(Math.PI * local) : 0,
    ink,
    done: p >= 0.94,
  };
}

export const copy = {
  pl: {
    portrait: {
      title: "Z fragmentów. W całość.",
      subtitle: "Portret / 5 × 5",
      description:
        "Dwadzieścia pięć fragmentów, jeden portret. Przewijaj, aby przywrócić porządek i zobaczyć, kto stoi za projektami.",
      captions: [
        "Pomieszane fragmenty zdjęcia. Kolory strony, przesunięcia obrazu i cyfrowe zakłócenia.",
        "Dwie pary kafelków zamieniają się jednocześnie. W poziomie i w pionie.",
        "Kolejne pary wracają na swoje miejsca. Odstępy pozostają aż do końca.",
        "Wszystkie fragmenty na swoim miejscu. Cześć, jestem Daniel.",
      ],
    },
    bench: {
      title: "Od pomysłu do systemu.",
      subtitle: "Stanowisko prototypowe",
      description:
        "Interfejs, elektronika i wspólny język. Zobacz, jak osobne części zaczynają ze sobą współpracować.",
      captions: [
        "Jeden pomysł. Interfejs na ekranie, otwarty moduł na stole.",
        "Płytka trafia na mocowania. Szkic zamienia się w interfejs.",
        "Polecenie z aplikacji dociera do urządzenia i zmienia jego stan.",
        "Potwierdzenie wraca na ekran. Software i hardware działają razem.",
      ],
    },
    plotter: {
      title: "Precyzja, krok po kroku.",
      subtitle: "Ploter interfejsów",
      description:
        "Od pustej kartki do kompletnego interfejsu. Każdy ruch głowicy zostawia ślad dokładnie tam, gdzie powstaje projekt.",
      captions: [
        "Papier jest zamocowany. Głowica czeka w punkcie startowym.",
        "Powstaje rama aplikacji, nawigacja i układ treści.",
        "Ploter rysuje komponenty, podnosząc pisak między liniami.",
        "Kompletny interfejs pozostaje na papierze. Głowica parkuje.",
      ],
    },
  },
  en: {
    portrait: {
      title: "From fragments. To a whole.",
      subtitle: "Portrait / 5 × 5",
      description:
        "Twenty-five fragments, one portrait. Scroll to restore order and meet the person behind the projects.",
      captions: [
        "Scrambled photo fragments. Brand colors, image shifts and digital interference.",
        "Two pairs swap places at once, mixing horizontal and vertical moves.",
        "The remaining pairs settle into place. Gaps stay open until the end.",
        "Every fragment in place. Hi, I’m Daniel.",
      ],
    },
    bench: {
      title: "From idea to system.",
      subtitle: "Prototype bench",
      description:
        "An interface, electronics, and a shared language. Watch separate parts become a working system.",
      captions: [
        "One idea. An interface on screen and an open module on the bench.",
        "The board seats on its mounts. A sketch becomes an interface.",
        "A command reaches the device and changes its state.",
        "The acknowledgement returns. Software and hardware work together.",
      ],
    },
    plotter: {
      title: "Precision, step by step.",
      subtitle: "Interface plotter",
      description:
        "From a blank sheet to a complete interface. Every movement leaves a mark exactly where the design takes shape.",
      captions: [
        "The paper is clamped. The pen waits at its starting point.",
        "The application frame, navigation and layout take shape.",
        "The plotter draws components, lifting its pen between strokes.",
        "The complete interface stays on the paper. The head parks.",
      ],
    },
  },
};
