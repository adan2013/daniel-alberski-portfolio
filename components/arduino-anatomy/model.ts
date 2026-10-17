import type { Locale } from "@/lib/projects";

export const arduinoProjection = {
  origin: [330, 420] as [number, number],
  scale: 0.98,
  azimuth: 72,
  elevation: 24,
};
const a = (arduinoProjection.azimuth * Math.PI) / 180;
const e = (arduinoProjection.elevation * Math.PI) / 180;
const k = arduinoProjection.scale * Math.sqrt(1.6);
export const arduinoTranslation = (x: number, y: number, z: number) =>
  `translate(${(x * Math.sin(a) - y * Math.cos(a)) * k} ${((x * Math.cos(a) + y * Math.sin(a)) * Math.sin(e) - z * Math.cos(e)) * k})`;
const ease = (p: number, from: number, to: number) => {
  const t = Math.max(0, Math.min(1, (p - from) / (to - from)));
  return t * t * (3 - 2 * t);
};
export const arduinoStops = [0, 0.19, 0.4, 0.57, 0.75, 0.88, 1] as const;
export const arduinoStepDurations = [
  1400, 1400, 1300, 1400, 1100, 1400,
] as const;
// All parts reach their physical mount before the next assembly operation starts.
export function arduinoPose(p: number) {
  return {
    oldNeedles: 1 - ease(p, 0.02, 0.19),
    shellGone: ease(p, 0.24, 0.34),
    oldFaces: ease(p, 0.22, 0.4),
    newFaces: ease(p, 0.42, 0.52),
    newNeedles: ease(p, 0.535, 0.57),
    openEnclosure: ease(p, 0.59, 0.65),
    electronics: ease(p, 0.62, 0.66),
    electronicsSeated: ease(p, 0.66, 0.75),
    enclosure: ease(p, 0.77, 0.88),
    monitor: ease(p, 0.89, 0.95),
    running: ease(p, 0.94, 1),
  };
}
export function arduinoTelemetry(time: number, still: boolean) {
  const speed = still ? 80 : 80 + 8 * Math.sin(time * 0.45);
  const rpm = still ? 1400 : 1400 + 160 * Math.sin(time * 0.45);
  return { speed, rpm, gear: 12 };
}
export const arduinoCopy: Record<
  Locale,
  {
    title: string;
    hint: string;
    control: string;
    description: string;
    phases: string[];
  }
> = {
  pl: {
    title: "Z Golfa IV do kabiny ciężarówki",
    hint: "Wybierz scenę strzałkami lub suwakiem",
    control: "Budowa DIY Arduino Dashboard",
    description:
      "Wymontowany zestaw zegarów Volkswagena Golfa IV. Najpierw zdjęte zostają wskazówki, następnie oryginalne tarcze. Oryginalne tarcze ustępują własnym skalom ciężarówki. Silniki i wskazówki trafiają do obudowy ze sklejki z Arduino, ekspanderem kontrolek i ekranem LCD. W finale reagują na przykładową telemetrię ETS2.",
    phases: [
      "Zegary z Golfa IV",
      "Demontaż wskazówek",
      "Demontaż tarcz",
      "Własne skale ciężarówki",
      "Otwarta obudowa i elektronika",
      "Zamknięcie obudowy",
      "Jazda w ETS2",
    ],
  },
  en: {
    title: "From a Golf IV to a truck cockpit",
    hint: "Choose a scene with the arrows or slider",
    control: "Building the DIY Arduino Dashboard",
    description:
      "A removed Volkswagen Golf IV instrument cluster. The pointers come off first, followed by the original faces. Original faces are replaced with custom truck scales. The motors and pointers receive a plywood enclosure, Arduino, an indicator expander and an LCD. Finally, they respond to sample ETS2 telemetry.",
    phases: [
      "Golf IV instrument cluster",
      "Removing the pointers",
      "Removing the faces",
      "Custom truck scales",
      "Open enclosure and electronics",
      "Closing the enclosure",
      "Driving in ETS2",
    ],
  },
};

/** The server SVG and live paths share one unpowered/powered ink source. */
export function arduinoNeedleInk(running: number) {
  const blend = (dark: number[], bright: number[]) =>
    `rgb(${dark.map((v, i) => Math.round(v + (bright[i] - v) * running)).join(" ")})`;
  return {
    body: blend([96, 66, 58], [239, 96, 77]),
    edge: blend([74, 54, 48], [165, 66, 55]),
    highlight: blend([110, 78, 68], [255, 168, 128]),
  };
}
