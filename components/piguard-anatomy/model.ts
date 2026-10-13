import type { Locale } from "@/lib/projects";

export const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (p: number, a: number, b: number) => {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// Narrative timing, not measured sensor latency or SMS delivery time.
export function guardPose(p: number) {
  return {
    intruder: ease(p, 0.08, 0.23),
    detection: ease(p, 0.23, 0.28),
    alarm: ease(p, 0.28, 0.34) * (1 - ease(p, 0.51, 0.57)),
    fear: ease(p, 0.32, 0.4),
    departure: ease(p, 0.4, 0.54),
    outgoing: ease(p, 0.38, 0.43) * (1 - ease(p, 0.51, 0.58)),
    firstScene: 1 - ease(p, 0.55, 0.62),
    recipient: ease(p, 0.62, 0.69),
    arrival: ease(p, 0.67, 0.83),
    incoming: ease(p, 0.67, 0.71) * (1 - ease(p, 0.81, 0.87)),
    phone: ease(p, 0.78, 0.88),
    message: ease(p, 0.87, 0.94),
    shock: ease(p, 0.93, 0.985),
  };
}
export const guardPhase = (p: number) =>
  p < 0.08 ? 0 : p < 0.25 ? 1 : p < 0.38 ? 2 : p < 0.62 ? 3 : p < 0.93 ? 4 : 5;

export const guardCopy: Record<
  Locale,
  {
    title: string;
    hint: string;
    control: string;
    description: string;
    phases: string[];
    message: string[];
    now: string;
  }
> = {
  pl: {
    title: "PiGuard GSM",
    hint: "Przewiń lub przesuń suwak",
    control: "Przebieg alarmu PiGuard",
    description:
      "PiGuard czuwa z migającą czerwoną diodą. Z prawej strony wchodzi złodziej. Czujnik PIR zapala czerwoną diodę i pojawia się wykrzyknik. Alarm wibruje, a przestraszony intruz widzi wysyłany sygnał GSM. Właściciel wyjmuje telefon, odczytuje SMS o ruchu w pomieszczeniu i reaguje zaskoczeniem.",
    phases: [
      "Czuwanie",
      "Intruz",
      "Alarm",
      "Wysyłanie SMS",
      "Odbiór SMS",
      "Powiadomienie",
    ],
    message: ["Wykryto ruch", "w tym pomieszczeniu."],
    now: "teraz",
  },
  en: {
    title: "PiGuard GSM",
    hint: "Scroll or drag the slider",
    control: "PiGuard alarm sequence",
    description:
      "PiGuard is armed with a blinking red LED. A burglar enters from the right. The PIR sensor lights red and an exclamation mark appears. The alarm shakes, and the startled intruder sees a GSM signal being sent. The owner takes out a phone, reads a motion alert and looks shocked.",
    phases: [
      "Armed",
      "Intruder",
      "Alarm",
      "Sending SMS",
      "Receiving SMS",
      "Notification",
    ],
    message: ["Motion detected", "in this room."],
    now: "now",
  },
};
