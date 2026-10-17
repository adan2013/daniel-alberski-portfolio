import type { ComponentType } from "react";
import type { Locale } from "@/lib/projects";
import { ScaleAnatomy } from "./scale-anatomy/art";
import { PiGuardAnatomy } from "./piguard-anatomy/art";
import { VhsAnatomy } from "./vhs-anatomy/art";
import { SmartHomeAnatomy } from "./smart-home-anatomy/art";
import { ArduinoAnatomy } from "./arduino-anatomy/art";
import { RedarkAnatomy } from "./redark-anatomy/art";

// Each case study supplies its own server-rendered animation to the shared layout.
export const caseStudyAnimations: Partial<
  Record<string, ComponentType<{ locale: Locale }>>
> = {
  "gauge-generator": ScaleAnatomy,
  piguard: PiGuardAnatomy,
  "vhs-htpc": VhsAnatomy,
  "smart-home": SmartHomeAnatomy,
  "arduino-dashboard": ArduinoAnatomy,
  redark: RedarkAnatomy,
};
