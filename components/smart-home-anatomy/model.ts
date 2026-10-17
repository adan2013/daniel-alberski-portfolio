import type { Locale } from "@/lib/projects";
const ease = (p: number, a: number, b: number) => {
  const t = Math.max(0, Math.min(1, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
export const homeStops = [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.84, 1] as const;
export const homeStepDurations = [
  1600, 1300, 1600, 2200, 1300, 2600, 2200,
] as const;
export function homePose(p: number) {
  return {
    stage:
      p < 0.01
        ? 0
        : p <= 0.14
          ? 1
          : p <= 0.28
            ? 2
            : p <= 0.42
              ? 3
              : p <= 0.56
                ? 4
                : p <= 0.7
                  ? 5
                  : p <= 0.84
                    ? 6
                    : 7,
    command: ease(p, 0.005, 0.135),
    processing: ease(p, 0.15, 0.27),
    homeAssistant: ease(p, 0.29, 0.415),
    usb: ease(p, 0.425, 0.48),
    radio: ease(p, 0.485, 0.555),
    socket: ease(p, 0.575, 0.69),
    feedback: ease(p, 0.705, 0.835),
    fanout: ease(p, 0.845, 0.94),
    confirmed: ease(p, 0.945, 0.96),
    notification: ease(p, 0.96, 0.995),
  };
}
export const homeCopy: Record<
  Locale,
  {
    title: string;
    hint: string;
    control: string;
    description: string;
    phases: string[];
    labels: string[];
    request: string;
    state: string;
    notificationTitle: string;
    notificationBody: string;
  }
> = {
  pl: {
    title: "Od polecenia do potwierdzenia",
    hint: "Prześledź przepływ strzałkami lub suwakiem",
    control: "Przepływ danych smart home",
    description:
      "Graf przepływu danych: telefon i autorski tablet ścienny łączą się z backendem Node.js. Backend przekazuje polecenie do Home Assistanta, który steruje gniazdkiem przez dongle USB Zigbee. Potwierdzenie wraca tą samą drogą do obu dashboardów.",
    phases: [
      "Połączenia systemu",
      "Polecenie z telefonu",
      "Własny backend",
      "Home Assistant",
      "USB i Zigbee",
      "Gniazdko włączone",
      "Powrót stanu",
      "Dwa zgodne dashboardy",
    ],
    labels: [
      "Telefon",
      "Tablet ścienny",
      "Własny backend",
      "Home Assistant",
      "Dongle USB Zigbee",
      "Gniazdko Zigbee",
    ],
    notificationTitle: "Powiadomienia",
    notificationBody: "Potwierdzono ON",
    request: "POLECENIE",
    state: "POTWIERDZENIE",
  },
  en: {
    title: "From command to confirmed state",
    hint: "Follow the flow with arrows or slider",
    control: "Smart home data flow",
    description:
      "Data-flow graph: a phone and custom wall tablet connect to the Node.js backend. The backend passes a command to Home Assistant, which controls a smart socket through a USB Zigbee dongle. Confirmed state returns along the same route to both dashboards.",
    phases: [
      "System connections",
      "Phone command",
      "Custom backend",
      "Home Assistant",
      "USB and Zigbee",
      "Socket switched on",
      "State returns",
      "Two synchronized dashboards",
    ],
    labels: [
      "Phone",
      "Wall tablet",
      "Custom backend",
      "Home Assistant",
      "USB Zigbee dongle",
      "Zigbee smart socket",
    ],
    notificationTitle: "Notifications",
    notificationBody: "Confirmed ON",
    request: "COMMAND",
    state: "CONFIRMED STATE",
  },
};
