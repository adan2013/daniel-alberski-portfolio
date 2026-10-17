import { cameraOf, iso, type Projection } from "../anatomy/iso-kit";

/** Stable poses reached by the scene controls, from a blank dial to a loaded scale. */
export const scaleStops = [
  0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.78, 0.9, 1,
] as const;
export const scaleProjection: Projection = {
  origin: [310, 454],
  scale: 0.94,
  azimuth: 66,
  elevation: 18,
};
export const scaleWorld = {
  front: 66,
  back: -55,
  panel: 74,
  bottom: 20,
  top: 238,
  dial: 128,
} as const;
const dialCenter = iso([0, scaleWorld.panel, scaleWorld.dial], scaleProjection);
const camera = cameraOf(scaleProjection);
const dialWorldScale = 0.69;
export const mountedDial = {
  x: dialCenter[0],
  y: dialCenter[1],
  scale: camera.sinA * camera.k * dialWorldScale,
  skew: camera.cosA * camera.sinE * camera.k * dialWorldScale,
  verticalScale: camera.cosE * camera.k * dialWorldScale,
};
export const WEIGHT_KG = 2;
export const CAPACITY_KG = 10;
export const scaleAngle = (kilograms: number) =>
  (kilograms / CAPACITY_KG) * 300;
export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export function segment(progress: number, start: number, end: number) {
  const t = clamp((progress - start) / (end - start));
  return t * t * (3 - 2 * t);
}

export function scalePose(progress: number, secondsSinceLanding?: number) {
  const install = segment(progress, 0.78, 0.9);
  const open = 1 - segment(progress, 0.8, 0.9);
  const bodyOpacity = segment(progress, 0.61, 0.67);
  const load = segment(progress, 0.92, 1);
  const settleTime = Math.max(0, secondsSinceLanding ?? 1.6);
  const settling = progress === 1 && settleTime < 1.6;
  const spring = settling
    ? Math.sin(settleTime * Math.PI * 6) *
      Math.exp(-2.8 * settleTime) *
      (1 - segment(settleTime, 1.1, 1.6))
    : 0;
  const trayY = 10 * load + 3 * spring;
  const weightLift = 90 * (1 - load);
  const spread = segment(progress, 0.6, 0.78);
  const calloutOpacity =
    segment(progress, 0, 0.06) * (1 - segment(progress, 0.62, 0.7));
  const layers = [
    segment(progress, 0.02, 0.12), // Scale ticks
    segment(progress, 0.14, 0.24), // Numbers
    segment(progress, 0.5, 0.6), // Needle
    segment(progress, 0.26, 0.36), // Warning range
    segment(progress, 0.38, 0.48), // Labels
    segment(progress, 0.4, 0.48), // Calibration icon
  ];
  return {
    mass: WEIGHT_KG * load + 0.45 * spring,
    settling,
    weightLift,
    weightOpacity: segment(progress, 0.9, 0.94),
    open,
    bodyOpacity,
    bodyX: 120 * (1 - install),
    bodyY: (1 - bodyOpacity) * 25,
    trayY,
    weightY: -weightLift + trayY,
    weightShadowY: trayY,
    dialX: 280 - 135 * spread + (mountedDial.x - 145) * install,
    dialY: mountedDial.y,
    dialScale: 1 + (mountedDial.scale - 1) * install,
    dialSkew: mountedDial.skew * install,
    dialVerticalScale: 1 + (mountedDial.verticalScale - 1) * install,
    calloutOpacity,
    layers,
  };
}

export const scaleCopy = {
  pl: {
    title: "Od tarczy do produktu",
    hint: "Wybierz scenę strzałkami lub suwakiem",
    control: "Etap budowy tarczy i wagi",
    description:
      "Tarcza wagi powstaje kolejno ze skali, liczb, zakresu ostrzegawczego, etykiet, ikony kalibracji i wskazówki. Następnie pojawia się głęboka obudowa z widocznym mechanizmem sprężynowym. Obudowa i tarcza łączą się na środku, a na szalce staje odważnik 2 kg i wskazówka wychyla się do wartości 2.",
    phases: [
      "Pusta tarcza",
      "Skala",
      "Liczby",
      "Zakres ostrzegawczy",
      "Etykiety i ikony",
      "Wskazówka",
      "Przed montażem",
      "Montaż tarczy",
      "Odważnik",
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
  },
  en: {
    title: "From dial to product",
    hint: "Choose a scene with the arrows or slider",
    control: "Dial and scale assembly stage",
    description:
      "A scale dial is assembled from ticks, numbers, a warning range, labels, a calibration icon and a needle. A deep housing reveals its spring mechanism beside the completed dial. The two parts join in the center, then a 2 kg weight lands on the tray and the needle points to 2.",
    phases: [
      "Blank dial",
      "Scale ticks",
      "Numbers",
      "Warning range",
      "Labels and icon",
      "Needle",
      "Before installation",
      "Install the dial",
      "Place the weight",
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
  },
} as const;
