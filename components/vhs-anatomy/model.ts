import type { Locale } from "@/lib/projects";

export const vhsProjection = {
  origin: [325, 358] as [number, number],
  scale: 0.94,
  azimuth: 70,
  elevation: 28,
};
const a = (vhsProjection.azimuth * Math.PI) / 180;
const e = (vhsProjection.elevation * Math.PI) / 180;
const k = vhsProjection.scale * Math.sqrt(1.6);
// Project movement with the exact camera used to construct the server art.
export const vhsTranslation = (x: number, y: number, z: number) =>
  `translate(${(x * Math.sin(a) - y * Math.cos(a)) * k} ${((x * Math.cos(a) + y * Math.sin(a)) * Math.sin(e) - z * Math.cos(e)) * k})`;

const ease = (p: number, from: number, to: number) => {
  const t = Math.max(0, Math.min(1, (p - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

// Scroll is a narrative timeline, not elapsed assembly or boot time.
export function vhsPose(p: number) {
  return {
    powerOff: ease(p, 0.045, 0.105),
    explode: ease(p, 0.12, 0.25),
    discard: ease(p, 0.28, 0.39),
    chassis: ease(p, 0.37, 0.49),
    shuffle: ease(p, 0.49, 0.55),
    board: ease(p, 0.55, 0.65),
    disk: ease(p, 0.57, 0.67),
    ports: ease(p, 0.59, 0.69),
    extras: ease(p, 0.63, 0.73),
    lid: ease(p, 0.74, 0.82),
    cassette: ease(p, 0.83, 0.94),
    cassetteVisible: ease(p, 0.81, 0.835),
    power: ease(p, 0.945, 0.975),
    desktop: ease(p, 0.965, 1),
  };
}

export const vhsPhase = (p: number) =>
  p < 0.12
    ? 0
    : p < 0.37
      ? 1
      : p < 0.55
        ? 2
        : p < 0.74
          ? 3
          : p < 0.83
            ? 4
            : p < 0.945
              ? 5
              : 6;

export const vhsCopy: Record<
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
    title: "VHS HTPC",
    hint: "Przewiń lub przesuń suwak",
    control: "Przemiana laptopa w VHS HTPC",
    description:
      "Laptop z uszkodzoną baterią wyłącza ekran i rozkłada się na części. Płyta główna, SSD i panel portów trafiają do otwartej obudowy magnetowidu razem z dodatkowymi modułami sterowania. Pokrywa zamyka obudowę. Kaseta WINDOWS wsuwa się w slot, wyświetlacz pokazuje godzinę, a telewizor pulpit systemu.",
    phases: [
      "Stary laptop",
      "Demontaż",
      "Nowa obudowa",
      "Montaż",
      "Pokrywa",
      "System operacyjny",
      "Uruchomienie",
    ],
  },
  en: {
    title: "VHS HTPC",
    hint: "Scroll or drag the slider",
    control: "Laptop to VHS HTPC transformation",
    description:
      "A laptop with a failed battery turns off and separates into parts. Its motherboard, SSD and ports move into an open VCR enclosure with extra control modules. The lid closes. A WINDOWS cassette slides into the slot, the display shows the time and the television shows a desktop.",
    phases: [
      "Old laptop",
      "Disassembly",
      "New enclosure",
      "Assembly",
      "Cover",
      "Operating system",
      "Power on",
    ],
  },
};
