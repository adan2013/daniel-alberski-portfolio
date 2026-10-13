/** One timeline shared by scroll, the slider and the figure's readout. */
export const WEIGHT_KG = 2;
export const CAPACITY_KG = 10;
export const scaleAngle = (kilograms: number) =>
  (kilograms / CAPACITY_KG) * 300;
export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export function segment(progress: number, start: number, end: number) {
  const t = clamp((progress - start) / (end - start));
  return t * t * (3 - 2 * t);
}

export function scalePose(progress: number) {
  const open = segment(progress, 0.28, 0.46);
  const drop = segment(progress, 0.44, 0.62);
  const turn = segment(progress, 0.62, 0.76);
  return {
    mass: WEIGHT_KG * (1 - segment(progress, 0.055, 0.18)),
    weightLift: 90 * segment(progress, 0.055, 0.24),
    weightOpacity: 1 - segment(progress, 0.13, 0.18),
    open,
    drop,
    turn,
    bodyOpacity: 1 - segment(progress, 0.58, 0.72),
    dialX: 280 - 62 * turn,
    dialY: 295 + 130 * drop - 132 * turn,
    dialScale: 0.9 + 0.1 * turn,
    // Projection of the upright face resolves to a front elevation.
    dialSkew: 0.13 * (1 - turn),
    phase:
      progress < 0.055
        ? 0
        : progress < 0.28
          ? 1
          : progress < 0.46
            ? 2
            : progress < 0.62
              ? 3
              : progress < 0.76
                ? 4
                : 5,
    layers: Array.from({ length: 6 }, (_, i) =>
      segment(progress, 0.76 + i * 0.032, 0.84 + i * 0.032),
    ),
  };
}

export const scaleCopy = {
  pl: {
    title: "Anatomia tarczy",
    hint: "Przewijaj, aby rozłożyć wagę",
    control: "Etap demontażu wagi",
    description:
      "Stara waga sklepowa z odważnikiem 2 kg. Skala zaczyna się od zera na górze i rośnie w prawo. Odważnik unosi się, a czerwona wskazówka wraca do zera. Następnie obudowa otwiera się, tarcza wysuwa w dół i obraca frontem. Sześć połączeń wskazuje części tarczy odpowiadające warstwom edytora.",
    phases: [
      "Waga sklepowa",
      "Zdjęcie odważnika",
      "Otwarcie obudowy",
      "Wyjęcie tarczy",
      "Obrót tarczy",
      "Warstwy tarczy",
    ],
    layers: [
      "Skala liniowa",
      "Skala cyfrowa",
      "Wskazówka",
      "Łuk ostrzegawczy",
      "Własne etykiety",
      "Ikony",
    ],
    layersTitle: "WARSTWY",
    still: "Widok warstw · ruch ograniczony",
  },
  en: {
    title: "Anatomy of a dial",
    hint: "Scroll to take the scale apart",
    control: "Scale disassembly stage",
    description:
      "A vintage shop scale carrying a 2 kg weight. The dial starts at zero at the top and increases clockwise. The weight lifts and the red needle returns to zero. Then the housing opens, the dial slides down and turns to face you. Six connections identify the dial elements that correspond to editor layers.",
    phases: [
      "Shop scale",
      "Lifting the weight",
      "Opening the housing",
      "Removing the dial",
      "Turning the dial",
      "Dial layers",
    ],
    layers: [
      "Linear scale",
      "Numeric scale",
      "Needle",
      "Warning arc",
      "Custom labels",
      "Icons",
    ],
    layersTitle: "LAYERS",
    still: "Layer view · reduced motion",
  },
} as const;
