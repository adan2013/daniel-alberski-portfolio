import type { Locale } from "@/lib/projects";

export const redarkProjection = {
  origin: [320, 367] as [number, number],
  scale: 0.95,
  azimuth: 70,
  elevation: 29,
};
const a = (redarkProjection.azimuth * Math.PI) / 180;
const e = (redarkProjection.elevation * Math.PI) / 180;
const k = redarkProjection.scale * Math.sqrt(1.6);
export const redarkTranslation = (x: number, y = 0, z = 0) =>
  `translate(${(x * Math.sin(a) - y * Math.cos(a)) * k} ${((x * Math.cos(a) + y * Math.sin(a)) * Math.sin(e) - z * Math.cos(e)) * k})`;
const ease = (p: number, from: number, to: number) => {
  const t = Math.max(0, Math.min(1, (p - from) / (to - from)));
  return t * t * (3 - 2 * t);
};
export const redarkStops = [0, 0.14, 0.28, 0.43, 0.57, 0.71, 0.86, 1] as const;
export const redarkStepDurations = [
  1500, 1400, 1200, 1200, 1600, 1500, 1000,
] as const;
// Story timing, not measured migration or import duration.
export function redarkPose(p: number) {
  const printed = ease(p, 0.01, 0.14);
  const scanned = ease(p, 0.15, 0.28);
  const corrected = ease(p, 0.29, 0.43);
  const structured = ease(p, 0.44, 0.57);
  const transported = ease(p, 0.58, 0.71);
  const imported = ease(p, 0.72, 0.86);
  return {
    printed,
    scanned,
    corrected,
    structured,
    transported,
    imported,
    published: ease(p, 0.87, 1),
    travel: 105 * printed + 57 * scanned + 99 * transported + 115 * imported,
    scan: ease(p, 0.15, 0.25),
  };
}
export const redarkCopy: Record<
  Locale,
  {
    title: string;
    control: string;
    description: string;
    phases: string[];
  }
> = {
  pl: {
    title: "Migracja artykułów",
    control: "Migracja artykułów Redarka",
    description:
      "Komputer z logo WordPress drukuje artykuł na taśmę. Skaner wskazuje uszkodzony link i grafikę. Na tym samym arkuszu pojawia się poprawiona grafika, naprawiony link i uporządkowany MDX. Taśma wprowadza dokument do komputera z logo Next.js; na ekranie powstaje gotowa strona.",
    phases: [
      "Archiwum WordPressa",
      "Wydruk artykułu",
      "Wykrywanie błędów",
      "Naprawione linki i media",
      "Struktura MDX",
      "Transport dokumentu",
      "Import",
      "Gotowa strona",
    ],
  },
  en: {
    title: "Migrating the articles",
    control: "Redark article migration",
    description:
      "A computer with the WordPress logo prints an article onto a conveyor. A scanner identifies a broken link and image. The same sheet gains a repaired image, working link and structured MDX. The conveyor feeds the document into a Next.js computer, which renders the finished page.",
    phases: [
      "WordPress archive",
      "Printing an article",
      "Detecting errors",
      "Repaired links and media",
      "MDX structure",
      "Document transport",
      "Import",
      "Finished page",
    ],
  },
};
