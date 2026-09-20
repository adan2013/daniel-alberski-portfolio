import type { Locale } from "./i18n";

export type { Locale } from "./i18n";
export type Localized = Record<Locale, string>;
export type Track = "software" | "hardware" | "ai" | "3d";
export type Media = {
  label: Localized;
  ratio: "16/10" | "16/9" | "1/1";
  fit?: "cover" | "contain";
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
      "Na tym remasterze aplikacji z 2019 roku przetestowałem workflow z AI: od specyfikacji i szybkiego startu po pracę etapami. Sam podejmowałem decyzje architektoniczne i robiłem końcowe code review.",
      "I used this remaster of my 2019 application to test an AI workflow, from the specification and a quick start through staged development. I made the architectural decisions and conducted the final code review myself.",
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
      {
        label: l(
          "Gauge Generator — widok edytora",
          "Gauge Generator — editor view",
        ),
        ratio: "16/10" as const,
        fit: "contain" as const,
        src: "/projects/gauge-generator.jpg",
      },
      {
        label: l(
          "Edycja wskazówki za pomocą właściwości i uchwytów na podglądzie",
          "Editing a needle with properties and on-canvas handles",
        ),
        ratio: "16/10" as const,
        fit: "contain" as const,
        src: "/projects/gauge-generator-layer-properties.png",
      },
      {
        label: l(
          "Gauge Generator 1.0 — desktopowy interfejs z 2019 roku",
          "Gauge Generator 1.0 — 2019 desktop interface",
        ),
        ratio: "16/10" as const,
        fit: "contain" as const,
        src: "/projects/gauge-generator-legacy.png",
      },
      {
        label: l("Wybór typów warstw wizualnych", "Visual layer type picker"),
        ratio: "16/10" as const,
        fit: "contain" as const,
        src: "/projects/gauge-generator-layer-picker.png",
      },
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
      {
        label: l(
          "PiGuard — obudowa na ścianie",
          "PiGuard — wall-mounted enclosure",
        ),
        ratio: "16/10" as const,
        src: "/projects/piguard.jpg",
      },
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
      "Razem z siostrą zrobiliśmy ten generator w dwa dni. Skrypt OpenSCAD pozwala zmieniać geometrię i układ paletki, a następnie wygenerować model gotowy do druku. AI pomogło przy kodzie i modelowaniu.",
      "My sister and I built this generator in two days. The OpenSCAD script lets users change the palette geometry and layout, then generate a printable model. AI helped with the code and modelling.",
    ),
    premise: l(
      "Parametryczny model gotowy do druku.",
      "A parametric, printable model.",
    ),
    role: l("Modelowanie z AI", "AI-assisted modelling"),
    media: [
      {
        label: l("Paletki — gotowe wydruki", "Palettes — finished prints"),
        ratio: "16/10" as const,
        src: "/projects/palettes.jpg",
      },
    ],
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
      "Retro magnetowid został przebudowany na komputer multimedialny. Podzespoły laptopa trzeba było rozmieścić na kilku poziomach w ciasnej obudowie i dopasować mechanicznie oraz elektrycznie. Polutowany ręcznie sterownik ESP8266 komunikuje się z aplikacją Windows i obsługuje wyświetlacz oraz pilot. Urządzenie działa do dziś.",
      "A retro VCR was rebuilt as a media PC. The laptop components had to fit on several levels inside the compact enclosure and work together mechanically and electrically. A hand-soldered ESP8266 controller communicates with a Windows application and operates the display and remote. The device remains in use today.",
    ),
    premise: l(
      "Komputer wewnątrz retro magnetowidu.",
      "A computer inside a retro VCR.",
    ),
    role: l(
      "Planowanie przestrzenne, konstrukcja, lutowanie elektroniki i integracja ESP8266 z Windowsem",
      "Spatial planning, mechanical design, soldered electronics and ESP8266–Windows integration",
    ),
    media: [
      {
        label: l(
          "VHS HTPC — obudowa magnetowidu i podzespoły",
          "VHS HTPC — VCR enclosure and components",
        ),
        ratio: "16/10" as const,
        src: "/projects/vhs-htpc.jpg",
      },
      {
        label: l(
          "VHS HTPC — montaż płyty głównej laptopa",
          "VHS HTPC — laptop motherboard installation",
        ),
        ratio: "16/10" as const,
        src: "/projects/vhs-htpc-motherboard-install.jpg",
      },
      {
        label: l(
          "VHS HTPC — jednostka sterująca z ESP8266",
          "VHS HTPC — ESP8266 control unit",
        ),
        ratio: "16/9" as const,
        src: "/projects/vhs-htpc-control-unit.jpg",
      },
      {
        label: l(
          "VHS HTPC — sterownik wyświetlacza segmentowego",
          "VHS HTPC — segment display driver",
        ),
        ratio: "16/9" as const,
        src: "/projects/vhs-htpc-lcd-driver.jpg",
      },
    ],
    video: "vgGN3KrSJ-c",
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
      "Własny system do codziennej obsługi domu przez tablet, telefony i fizyczne piloty. Frontend w Reakcie komunikuje się z testowanym backendem Node.js, który obsługuje ponad 300 encji Home Assistanta, automatyzacje, powiadomienia i monitoring urządzeń.",
      "A custom system for everyday home control from a tablet, phones and physical remotes. The React frontend communicates with a tested Node.js backend that handles more than 300 Home Assistant entities, automations, notifications and device monitoring.",
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
      {
        label: l(
          "Smart home — tablet zamontowany na ścianie",
          "Smart home — wall-mounted tablet",
        ),
        ratio: "16/10" as const,
        src: "/projects/smart-home-tablet.jpg",
      },
      {
        label: l(
          "Przepływ danych między dashboardem, backendem i Home Assistantem",
          "Data flow between the dashboard, backend and Home Assistant",
        ),
        ratio: "16/9" as const,
        fit: "contain" as const,
        src: "/projects/smart-home-data-flow.png",
      },
      {
        label: l(
          "Dashboard — pogoda, aktywne powiadomienie i skróty do sekcji",
          "Dashboard — weather, an active notification and section shortcuts",
        ),
        ratio: "16/9" as const,
        fit: "contain" as const,
        src: "/projects/smart-home.jpg",
      },
      {
        label: l(
          "Smart home — sześcioprzyciskowy pilot oświetlenia w salonie",
          "Smart home — six-button living-room lighting remote",
        ),
        ratio: "16/9" as const,
        src: "/projects/smart-home-remote.jpg",
      },
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
      "Dedykowany czytnik audiobooków powstał dla starszej, niedowidzącej osoby, dla której standardowe urządzenia były zbyt skomplikowane. Duże fizyczne przyciski ułatwiają samodzielną obsługę, a Raspberry Pi z aplikacją w Pythonie i układem ATtiny85 odpowiada za bezpieczne włączanie i wyłączanie.",
      "A dedicated audiobook player created for an older, visually impaired person who found standard devices too complicated. Large physical buttons make it easier to use independently, while a Raspberry Pi running a Python application and an ATtiny85 circuit handle safe startup and shutdown.",
    ),
    premise: l(
      "Audiobooki z prostą obsługą.",
      "Audiobooks with simple controls.",
    ),
    role: l("Software i elektronika", "Software and electronics"),
    media: [
      {
        label: l(
          "Czytnik audiobooków — urządzenie i przyciski",
          "Audiobook player — device and controls",
        ),
        ratio: "16/10" as const,
        src: "/projects/book-reader.jpg",
      },
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
      "Fizyczne zegary samochodowe pokazują telemetrię z ETS2 i ATS. Całość obejmuje ręcznie wykonaną elektronikę i tarcze, aplikację C#/WPF z generatorem tarcz (Gauge Generator) oraz firmware Arduino w C++. Ograniczenia sprzętowe wymusiły optymalizację całego systemu.",
      "Physical vehicle gauges display telemetry from ETS2 and ATS. The project includes handmade electronics and gauge faces, a C#/WPF application with the Gauge Generator, and Arduino firmware written in C++. Hardware constraints required optimisation across the entire system.",
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
      {
        label: l(
          "Arduino Dashboard — kompletny zestaw zegarów",
          "Arduino Dashboard — complete gauge assembly",
        ),
        ratio: "16/10" as const,
        src: "/projects/arduino-dashboard.jpg",
      },
      {
        label: l(
          "Arduino Dashboard — interpreter telemetrii w C#",
          "Arduino Dashboard — telemetry interpreter in C#",
        ),
        ratio: "16/9" as const,
        src: "/projects/arduino-dashboard-telemetry-interpreter.jpg",
      },
      {
        label: l(
          "Arduino Dashboard — ekrany komputera pokładowego",
          "Arduino Dashboard — onboard computer screens",
        ),
        ratio: "1/1" as const,
        fit: "contain" as const,
        src: "/projects/arduino-dashboard-lcd-screens.jpg",
      },
      {
        label: l(
          "Arduino Dashboard — schemat elektryczny projektu",
          "Arduino Dashboard — project electrical diagram",
        ),
        ratio: "16/9" as const,
        fit: "contain" as const,
        src: "/projects/arduino-dashboard-wiring-diagram.jpg",
      },
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
      "Prywatny MVP dla streamera prowadzącego transmisje IRL. Aplikacja w React Native i Expo przesyłała lokalizację z telefonu do widżetu mapy oraz odbierała pomiar tętna przez Bluetooth LE, aby oba dane były widoczne na streamie.",
      "A private MVP for an IRL streamer. The React Native and Expo application sent phone location data to a map widget and received heart-rate readings over Bluetooth LE, making both visible on the stream.",
    ),
    premise: l(
      "Lokalizacja i tętno na transmisji.",
      "Location and heart rate on a live stream.",
    ),
    role: l("Aplikacja mobilna i integracja", "Mobile app and integration"),
    media: [
      {
        label: l(
          "IRL Tracker — aplikacja i mapa transmisji",
          "IRL Tracker — app and stream map",
        ),
        ratio: "16/10" as const,
        src: "/projects/irl-tracker.jpg",
      },
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
      "Blog technologiczny, na którym dzielę się wiedzą i dokumentuję własne projekty. W 2020 roku przeniosłem około 80 artykułów z WordPressa do Gatsby i MDX, zachowując ich adresy i przygotowując serwis pod SEO. Napisałem też narzędzia do migracji, kontroli linków i publikowania strony.",
      "A technology blog where I share knowledge and document my projects. In 2020, I moved around 80 articles from WordPress to Gatsby and MDX, preserving their URLs and preparing the site for search engines. I also wrote tools for the migration, link checking and deployment.",
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
      {
        label: l("Redark — strona główna bloga", "Redark — blog homepage"),
        ratio: "16/10" as const,
        src: "/projects/redark.jpg",
      },
      {
        label: l(
          "Pierwsza wersja Redarka — własny motyw WordPress",
          "The first Redark version — a custom WordPress theme",
        ),
        ratio: "1/1",
        src: "/projects/redark-wordpress.jpg",
      },
      {
        label: l(
          "Artykuł w Markdownie i jego podgląd",
          "A Markdown article and its preview",
        ),
        ratio: "16/9",
        src: "/projects/redark-markdown.jpg",
      },
      {
        label: l(
          "Pipeline Redarka w Buddy Works",
          "Redark pipeline in Buddy Works",
        ),
        ratio: "16/9",
        src: "/projects/redark-buddy.jpg",
      },
      {
        label: l(
          "Własny proces wdrożenia — konsola i raport e-mail",
          "Custom deployment process — console and email report",
        ),
        ratio: "16/9",
        src: "/projects/redark-deployment.jpg",
      },
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
