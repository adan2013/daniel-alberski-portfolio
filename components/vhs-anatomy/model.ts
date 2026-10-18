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

export const vhsStops = [0, 0.36, 0.54, 0.73, 0.82, 0.94, 1] as const;
export const vhsStepDurations = [1000, 1000, 1000, 1000, 1800, 1000] as const;

// Narrative timing, not elapsed assembly or boot time. Each scene stop holds
// complete parts in their settled positions; fades only run between stops.
export function vhsPose(p: number) {
  return {
    powerOff: ease(p, 0.045, 0.105),
    explode: ease(p, 0.12, 0.25),
    discard: ease(p, 0.28, vhsStops[1]),
    chassis: ease(p, 0.37, 0.43),
    shuffle: ease(p, 0.39, 0.43),
    // Seat the salvaged parts in scene 3; scene 4 adds only the extra modules.
    board: ease(p, 0.43, 0.52),
    disk: ease(p, 0.44, 0.53),
    ports: ease(p, 0.45, vhsStops[2]),
    extras: ease(p, 0.55, vhsStops[3]),
    lid: ease(p, 0.74, 0.82),
    // Reveal the stationary tape first, then soften its final entry into the slot.
    cassette: ease(p, 0.85, vhsStops[5]),
    cassetteVisible: ease(p, vhsStops[4], 0.85) * (1 - ease(p, 0.9, 0.925)),
    power: ease(p, 0.945, 0.975),
    desktop: ease(p, 0.965, 1),
  };
}

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
    title: "Drugie życie laptopa i VHS-a",
    hint: "Wybierz scenę strzałkami lub suwakiem",
    control: "Przemiana laptopa w VHS HTPC",
    description:
      "Laptop z uszkodzoną baterią wyłącza ekran i rozkłada się na części. Płyta główna, SSD i panel portów trafiają do otwartej obudowy magnetowidu. Następnie dołączają dodatkowe moduły sterowania. Pokrywa zamyka obudowę. Kaseta WINDOWS wsuwa się w slot, wyświetlacz pokazuje godzinę, a telewizor pulpit systemu.",
    phases: [
      "Stary laptop",
      "Demontaż",
      "Obudowa i podzespoły",
      "Dodatkowe moduły",
      "Pokrywa",
      "System operacyjny",
      "Uruchomienie",
    ],
  },
  en: {
    title: "A second life for a laptop and VCR",
    hint: "Choose a scene with the arrows or slider",
    control: "Laptop to VHS HTPC transformation",
    description:
      "A laptop with a failed battery turns off and separates into parts. Its motherboard, SSD and ports move into an open VCR enclosure. Extra control modules are then added. The lid closes. A WINDOWS cassette slides into the slot, the display shows the time and the television shows a desktop.",
    phases: [
      "Old laptop",
      "Disassembly",
      "Enclosure and components",
      "Extra modules",
      "Cover",
      "Operating system",
      "Power on",
    ],
  },
};
