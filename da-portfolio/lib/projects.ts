import type { Locale } from "./i18n";

export type { Locale } from "./i18n";
export type Localized = Record<Locale, string>;
export type Track = "software" | "hardware" | "ai" | "3d";
export type Media = {
  label: Localized;
  ratio: "16/10" | "16/9" | "1/1";
  src?: string;
  alt?: Localized;
};
export type Project = {
  slug: string;
  name: string;
  nameEn?: string;
  date: string;
  tracks: Track[];
  priority: "main" | "secondary";
  tags: string[];
  cardLinkCount?: number;
  summary: Localized;
  premise: Localized;
  role: Localized;
  media: Media[];
  links: { label: Localized; url: string }[];
  caseStudy?: string;
  video?: string;
};
const l = (pl: string, en: string): Localized => ({ pl, en });
const media = (
  pl: string,
  en: string,
  ratio: Media["ratio"] = "16/10",
): Media => ({ label: l(pl, en), ratio });
const link = (pl: string, en: string, url: string) => ({
  label: l(pl, en),
  url,
});
export const tracks: { id: Track; name: Localized; description: Localized }[] =
  [
    {
      id: "software",
      name: l("Programowanie", "Software"),
      description: l(
        "Od interfejsu do backendu. Łączę części w działający system.",
        "From interface to backend. I bring the parts together into a working system.",
      ),
    },
    {
      id: "hardware",
      name: l("Hardware", "Hardware"),
      description: l(
        "Kod spotyka elektronikę i ograniczenia fizycznego świata.",
        "Code meets electronics and the constraints of the physical world.",
      ),
    },
    {
      id: "ai",
      name: l("AI", "AI"),
      description: l(
        "Nowe narzędzia, własne decyzje. Od specyfikacji po code review.",
        "New tools, my decisions. From specifications to code review.",
      ),
    },
    {
      id: "3d",
      name: l("Projektowanie i druk 3D", "3D design & printing"),
      description: l(
        "Od parametrycznego modelu do części, którą trzymam w dłoni.",
        "From a parametric model to a part I can hold in my hand.",
      ),
    },
  ];
export const projects: Project[] = [
  {
    slug: "gauge-generator",
    name: "Gauge Generator 2.0",
    date: "2026-08",
    tracks: ["software", "ai"],
    priority: "main",
    tags: ["React", "SVG", "PDF", "AI workflow", "Graphics"],
    cardLinkCount: 2,
    caseStudy: "gauge-generator",
    summary: l(
      "Remaster mojej aplikacji z 2019 roku, który posłużył mi do przetestowania pełnego workflow z AI: od przygotowania specyfikacji, przez szybki start i realizację projektu etapami, po własne code review.",
      "A remaster of my 2019 application that I used to test a complete AI workflow: from writing the specification, through rapidly starting and delivering the project in stages, to conducting my own code review.",
    ),
    premise: l(
      "Od aplikacji desktopowej do edytora w przeglądarce.",
      "From a desktop application to a browser-based editor.",
    ),
    role: l(
      "Specyfikacja, architektura, implementacja z AI i code review",
      "Specifications, architecture, AI-assisted implementation and code review",
    ),
    media: [
      media("Gauge Generator — widok edytora", "Gauge Generator — editor view"),
      media(
        "Warstwy, podgląd i eksport — zbliżenie interfejsu",
        "Layers, preview and export — interface detail",
        "16/9",
      ),
    ],
    links: [
      link(
        "Landing page",
        "Landing page",
        "https://gauge-generator.adanit.pl/",
      ),
      link("GitHub", "GitHub", "https://github.com/adan2013/Gauge-Generator"),
      link(
        "Dokumentacja",
        "Documentation",
        "https://gauge-generator.adanit.pl/docs/en",
      ),
      link(
        "Wypróbuj aplikację",
        "Try the app",
        "https://gauge-generator.adanit.pl/app",
      ),
    ],
  },
  {
    slug: "piguard",
    name: "PiGuard GSM",
    date: "2025-12",
    tracks: ["software", "hardware", "ai", "3d"],
    priority: "main",
    tags: ["Node.js", "Python", "Raspberry Pi", "GSM"],
    caseStudy: "piguard",
    summary: l(
      "Autonomiczna centralka alarmowa oparta na Raspberry Pi, która łączy oprogramowanie, elektronikę i drukowaną obudowę. AI wsparło konfigurację Linuksa oraz rozpracowanie słabo udokumentowanej komunikacji z modemem Huawei. Urządzenie działa do dziś i chroni jedną z nieruchomości.",
      "A self-contained Raspberry Pi alarm controller combining software, electronics and a 3D-printed enclosure. AI assisted with the Linux configuration and understanding the poorly documented communication with a Huawei modem. The device remains in operation today, protecting one of the properties.",
    ),
    premise: l(
      "Od czujki do SMS-a. Własny alarm, który działa na co dzień.",
      "From sensor to text message. A home-built alarm in daily use.",
    ),
    role: l(
      "Elektronika, integracja modemu, oprogramowanie z AI i obudowa 3D",
      "Electronics, modem integration, AI-assisted software and 3D enclosure",
    ),
    media: [
      media(
        "PiGuard — obudowa i wnętrze",
        "PiGuard — enclosure and internal components",
      ),
      media(
        "PiGuard — elektronika i połączenia",
        "PiGuard — electronics and connections",
      ),
      media(
        "PiGuard — panel konfiguracji i stan czujek",
        "PiGuard — settings panel and sensor status",
        "16/9",
      ),
    ],
    links: [link("GitHub", "GitHub", "https://github.com/adan2013/PiGuard")],
  },
  {
    slug: "palettes",
    name: "Generator paletek · OpenSCAD",
    nameEn: "Eyeshadow palettes · OpenSCAD",
    date: "2025-05",
    tracks: ["software", "ai", "3d"],
    priority: "secondary",
    tags: ["OpenSCAD", "3D modeling"],
    summary: l(
      "Parametryczny generator paletek do cieni powstał jako wspólny projekt rodzeństwa. AI wsparło tworzenie skryptu OpenSCAD oraz precyzyjne przełożenie geometrii i układu elementów na model 3D. W ciągu dwóch dni powstała działająca wersja, opublikowana w internecie i gotowa do wydrukowania.",
      "A parametric eyeshadow-palette generator created as a sibling collaboration. AI supported the OpenSCAD scripting process and the precise translation of geometry and component layouts into a 3D model. A working version was completed and published online within two days, ready to be printed.",
    ),
    premise: l(
      "Parametryczny model gotowy do druku.",
      "A parametric, printable model.",
    ),
    role: l("Modelowanie z AI", "AI-assisted modelling"),
    media: [media("Paletki — gotowe wydruki", "Palettes — finished prints")],
    links: [
      link(
        "MakerWorld",
        "MakerWorld",
        "https://makerworld.com/en/models/1420749-customizable-magnetic-eyeshadow-palette#profileId-1476063",
      ),
      link(
        "GitHub",
        "GitHub",
        "https://github.com/adan2013/eyeshadow-palette-openscad",
      ),
    ],
  },
  {
    slug: "vhs-htpc",
    name: "VHS HTPC",
    date: "2023-08",
    tracks: ["software", "hardware", "3d"],
    priority: "main",
    tags: ["ESP8266", "C#", "Druk 3D"],
    cardLinkCount: 2,
    caseStudy: "vhs-htpc",
    summary: l(
      "Celem projektu było zachowanie rodzinnego magnetowidu i nadanie mu nowej funkcji jako komputera multimedialnego. Największym wyzwaniem było wielopoziomowe rozplanowanie podzespołów laptopa w ciasnej obudowie oraz rozwiązanie problemów z ich mechaniczną i elektroniczną kompatybilnością. Własnoręcznie polutowany sterownik oparty na ESP8266 komunikuje się z aplikacją Windows, łącząc wyświetlacz, pilot i komputer w jeden system. Urządzenie działa do dziś.",
      "The goal was to preserve the family VCR and give it a new purpose as a media PC. The main challenge was planning a multi-level arrangement of laptop components inside the compact enclosure and resolving their mechanical and electronic compatibility issues. A hand-soldered ESP8266-based controller communicates with a Windows application, connecting the display, remote and computer into one system. The device remains in use today.",
    ),
    premise: l(
      "Komputer wewnątrz rodzinnego magnetowidu.",
      "A computer inside our family VCR.",
    ),
    role: l(
      "Planowanie przestrzenne, konstrukcja, lutowanie elektroniki i integracja ESP8266 z Windowsem",
      "Spatial planning, mechanical design, soldered electronics and ESP8266–Windows integration",
    ),
    media: [
      media(
        "VHS HTPC — działający komputer w obudowie magnetowidu",
        "VHS HTPC — working computer in a VCR enclosure",
      ),
      media(
        "VHS HTPC — trzy warstwy podzespołów",
        "VHS HTPC — three layers of components",
      ),
      media(
        "Wyświetlacz segmentowy — menu sterowane pilotem",
        "Segment display — remote-controlled menu",
        "16/9",
      ),
    ],
    links: [
      link(
        "Artykuł",
        "Article (PL only)",
        "https://redark.pl/vhs-htpc-project",
      ),
      link("GitHub", "GitHub", "https://github.com/adan2013/vhs-htpc"),
    ],
  },
  {
    slug: "smart-home",
    name: "System smart home",
    nameEn: "Smart home system",
    date: "2023-07",
    tracks: ["software"],
    priority: "main",
    tags: ["React", "Node.js", "Home Assistant", "Zigbee", "Docker"],
    cardLinkCount: 2,
    caseStudy: "smart-home",
    summary: l(
      "Dedykowany system smart home do codziennej obsługi domu i automatyzacji dopasowanych do indywidualnych potrzeb. Łączy React, Node.js i Home Assistant, uwzględniając ograniczenia zewnętrznych narzędzi oraz integrację różnych urządzeń smart. Przeniesienie złożonej logiki z Node-RED do backendu uporządkowało architekturę, a testy, logi i monitoring zapewniają stabilne działanie.",
      "A dedicated smart home system for everyday home control and automations tailored to individual needs. It combines React, Node.js and Home Assistant while accounting for external-tool constraints and integrations with different smart devices. Moving complex logic from Node-RED into the backend simplified the architecture, while tests, logs and monitoring keep it stable.",
    ),
    premise: l(
      "Kompletny system. Od interfejsu na tablecie po urządzenia w domu.",
      "A complete system. From a tablet interface to devices around the house.",
    ),
    role: l(
      "Frontend, architektura backendu, automatyzacje i integracje",
      "Frontend, backend architecture, automations and integrations",
    ),
    media: [
      media(
        "Smart home — interfejs na tablecie",
        "Smart home — tablet interface",
      ),
      media(
        "Smart home — szczegóły panelu sterowania",
        "Smart home — control-panel detail",
        "16/9",
      ),
    ],
    links: [
      link("Frontend", "Frontend", "https://github.com/adan2013/HA-Dashboard"),
      link("Backend", "Backend", "https://github.com/adan2013/HA-Backend"),
    ],
  },
  {
    slug: "book-reader",
    name: "Raspberry Book Reader",
    date: "2021-10",
    tracks: ["software", "hardware"],
    priority: "secondary",
    tags: ["Raspberry Pi", "Python", "ATtiny85", "Audio", "Accessibility"],
    summary: l(
      "Dedykowany czytnik audiobooków powstał dla osoby starszej i niedowidzącej, dla której standardowe urządzenia były zbyt skomplikowane. Proste fizyczne sterowanie ułatwia samodzielną obsługę, a Raspberry Pi z aplikacją w Pythonie i układem ATtiny85 zapewnia bezpieczne włączanie oraz wyłączanie. Punktem wyjścia były potrzeby konkretnego użytkownika, nie lista funkcji.",
      "A dedicated audiobook player designed for an older, visually impaired person who found standard devices too complicated. Simple physical controls enable independent use, while a Raspberry Pi running a Python application and an ATtiny85 circuit provide safe startup and shutdown. The project began with a specific user’s needs, not a feature list.",
    ),
    premise: l(
      "Audiobooki z prostą obsługą.",
      "Audiobooks with simple controls.",
    ),
    role: l("Software i elektronika", "Software and electronics"),
    media: [
      media(
        "Czytnik audiobooków — urządzenie i przyciski",
        "Audiobook player — device and controls",
      ),
    ],
    links: [
      link(
        "GitHub",
        "GitHub",
        "https://github.com/adan2013/RaspberryBookReader",
      ),
      link(
        "Artykuł",
        "Article (PL only)",
        "https://redark.pl/diy-raspberry-book-reader",
      ),
      link("Demo wideo", "Video demo", "https://youtu.be/_oJZlEEj5N0"),
    ],
  },
  {
    slug: "arduino-dashboard",
    name: "DIY Arduino Dashboard",
    date: "2021-06",
    tracks: ["software", "hardware"],
    priority: "main",
    tags: ["Arduino", "C++", "C# / WPF", "SPI", "Gaming"],
    cardLinkCount: 3,
    caseStudy: "arduino-dashboard",
    video: "KW6sZINNi9Y",
    summary: l(
      "Celem było przeniesienie telemetrii z ETS2 i ATS na fizyczne zegary samochodowe. Kompletny system połączył ręcznie wykonaną elektronikę i tarcze, interpreter telemetrii oraz generator tarcz (Gauge Generator) w C#/WPF, a także firmware Arduino w C++. Ograniczenia sprzętowe wymagały dużej dbałości o wydajność i optymalizację całego rozwiązania.",
      "The goal was to bring telemetry from ETS2 and ATS to physical vehicle gauges. The complete system combined handmade electronics and gauge faces, a C#/WPF telemetry interpreter and gauge-face generator (Gauge Generator), and Arduino firmware written in C++. Hardware constraints required careful attention to performance and optimisation across the entire system.",
    ),
    premise: l(
      "Fizyczne zegary dla wirtualnej ciężarówki.",
      "Physical gauges for a virtual truck.",
    ),
    role: l(
      "Elektronika, tarcze, telemetria C#/WPF i firmware C++",
      "Electronics, gauge faces, C#/WPF telemetry and C++ firmware",
    ),
    media: [
      media(
        "Arduino Dashboard — kompletny zestaw zegarów",
        "Arduino Dashboard — complete gauge assembly",
      ),
      media(
        "Arduino Dashboard — elektronika i ręcznie wykonane tarcze",
        "Arduino Dashboard — electronics and handmade gauge faces",
      ),
    ],
    links: [
      link(
        "GitHub",
        "GitHub",
        "https://github.com/adan2013/DIY-Arduino-Dashboard",
      ),
      link(
        "Artykuł",
        "Article (PL/EN)",
        "https://redark.pl/diy-arduino-dashboard-ets-ats",
      ),
      link("Demo wideo", "Video demo", "https://youtu.be/KW6sZINNi9Y"),
    ],
  },
  {
    slug: "irl-tracker",
    name: "IRL Tracker",
    date: "2020-07",
    tracks: ["software"],
    priority: "secondary",
    tags: ["React Native", "Expo", "Mobile", "Bluetooth LE"],
    summary: l(
      "Prywatny MVP powstał dla streamera prowadzącego transmisje IRL, aby połączyć dane z telefonu i sensorów z warstwą graficzną streamu. Aplikacja przesyłała lokalizację do widżetu mapy i odbierała pomiar tętna przez Bluetooth LE. Projekt pozwolił sprawdzić React Native i Expo w rzeczywistym scenariuszu transmisji mobilnej.",
      "A private MVP created for an IRL streamer to connect phone and sensor data with the stream’s visual layer. The application sent location data to a map widget and received heart-rate readings over Bluetooth LE. The project tested React Native and Expo in a real mobile-streaming scenario.",
    ),
    premise: l(
      "Lokalizacja i tętno na transmisji.",
      "Location and heart rate on a live stream.",
    ),
    role: l("Aplikacja mobilna i integracja", "Mobile app and integration"),
    media: [
      media(
        "IRL Tracker — aplikacja i mapa transmisji",
        "IRL Tracker — app and stream map",
      ),
    ],
    links: [],
  },
  {
    slug: "redark",
    name: "Redark",
    date: "2018-09",
    tracks: ["software"],
    priority: "main",
    tags: ["React", "Gatsby", "Next.js", "MDX", "PHP / WordPress", "SEO"],
    caseStudy: "redark",
    summary: l(
      "Blog technologiczny powstał jako miejsce do dzielenia się wiedzą i dokumentowania projektów. Migracja z autorskiego motywu WordPress do Reacta, Gatsby i MDX ograniczyła nakład pracy związany z utrzymaniem oraz usunęła zależność od wtyczek, zachowując adresy artykułów i SEO. Dodatkowa wersja w Next.js posłużyła jako eksperyment technologiczny.",
      "A technology blog created as a place to share knowledge and document projects. Migrating from a custom WordPress theme to React, Gatsby and MDX reduced maintenance work and removed plugin dependencies while preserving article URLs and SEO. An additional Next.js version served as a technology experiment.",
    ),
    premise: l(
      "Mniej utrzymania. Więcej miejsca na dzielenie się wiedzą.",
      "Less maintenance. More room for sharing knowledge.",
    ),
    role: l(
      "Motyw, migracja, frontend, treści i weryfikacja SEO",
      "Theme, migration, frontend, content and SEO verification",
    ),
    media: [
      media("Redark — strona główna bloga", "Redark — blog homepage"),
      media(
        "Redark — widok artykułu i nawigacja",
        "Redark — article and navigation",
        "16/9",
      ),
    ],
    links: [
      link("Otwórz blog", "Open blog", "https://redark.pl"),
      link(
        "GitHub · Gatsby",
        "GitHub · Gatsby",
        "https://github.com/adan2013/Redark-Gatsby-Blog",
      ),
      link(
        "GitHub · Next.js",
        "GitHub · Next.js",
        "https://github.com/adan2013/redark-next",
      ),
    ],
  },
];
export function projectDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "pl" ? "pl-PL" : "en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date + "-01T12:00:00Z"));
}

export function projectName(project: Project, locale: Locale) {
  return locale === "en" ? (project.nameEn ?? project.name) : project.name;
}
export function tagLabel(tag: string, locale: Locale) {
  if (locale === "pl") return tag;
  return (
    (
      {
        "Druk 3D": "3D printing",
      } as Record<string, string>
    )[tag] ?? tag
  );
}
