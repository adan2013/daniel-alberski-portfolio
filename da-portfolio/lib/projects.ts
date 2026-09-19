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
    tags: ["React", "SVG", "PDF", "AI"],
    caseStudy: "gauge-generator",
    summary: l(
      "W 2019 roku napisałem desktopowy edytor tarcz zegarów. Teraz zbudowałem go od nowa w przeglądarce, z pomocą AI. Podzieliłem pracę na małe etapy, przygotowałem specyfikacje i sam robiłem code review. Efekt: edytor bez instalacji, z warstwami, undo/redo i eksportem do SVG, PDF oraz PNG.",
      "In 2019, I wrote a desktop gauge-face editor. I have now rebuilt it for the browser with AI assistance. I split the work into small stages, wrote specifications and reviewed the code myself. The result: an editor that needs no installation, with layers, undo/redo and SVG, PDF and PNG export.",
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
        "Otwórz aplikację",
        "Open application",
        "https://gauge-generator.adanit.pl/",
      ),
      link(
        "Dokumentacja",
        "Documentation",
        "https://gauge-generator.adanit.pl/docs/en",
      ),
      link(
        "Wersja z 2019 roku",
        "2019 version",
        "https://github.com/adan2013/Gauge-Generator",
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
      "Zbudowałem własną centralkę alarmową, która wysyła SMS-y przez modem GSM. Musiałem poradzić sobie ze skąpą dokumentacją i komendami AT. AI wsparło mnie w oprogramowaniu i konfiguracji Linuxa, a ja mogłem poświęcić więcej uwagi elektronice i drukowanej obudowie. Alarm działa przez dziesiątki dni bez przerwy.",
      "I built an alarm controller that sends text messages through a GSM modem. I had to work with sparse documentation and AT commands. AI helped with the software and Linux configuration, freeing more time for electronics and the printed enclosure. The alarm runs for dozens of days without interruption.",
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
    links: [
      link(
        "Repozytorium PiGuard",
        "PiGuard repository",
        "https://github.com/adan2013/PiGuard",
      ),
    ],
  },
  {
    slug: "palettes",
    name: "Generator paletek · OpenSCAD",
    nameEn: "Eyeshadow palettes · OpenSCAD",
    date: "2025-05",
    tracks: ["software", "ai", "3d"],
    priority: "secondary",
    tags: ["OpenSCAD", "Modelowanie parametryczne"],
    summary: l(
      "Razem z siostrą stworzyłem parametryczny generator paletek do cieni. Wykorzystałem AI do pisania skryptu OpenSCAD, ucząc się precyzyjnie opisywać geometrię i układ elementów. W dwa dni powstała działająca wersja, którą udostępniliśmy w internecie — od kodu do przedmiotu gotowego do wydrukowania.",
      "Together with my sister, I created a parametric eyeshadow-palette generator. I used AI to help write an OpenSCAD script while learning to describe geometry and spatial arrangements precisely. We published a working version within two days — from code to a printable object.",
    ),
    premise: l(
      "Parametryczny model gotowy do druku.",
      "A parametric, printable model.",
    ),
    role: l("Modelowanie z AI", "AI-assisted modelling"),
    media: [media("Paletki — gotowe wydruki", "Palettes — finished prints")],
    links: [
      link(
        "Model na MakerWorld",
        "Model on MakerWorld",
        "https://makerworld.com/en/models/1420749-customizable-magnetic-eyeshadow-palette#profileId-1476063",
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
    caseStudy: "vhs-htpc",
    summary: l(
      "Dałem rodzinnemu magnetowidowi drugie życie: zamknąłem w nim komputer do oglądania wideo. Podzespoły starego laptopa rozmieściłem w trzech warstwach, korzystając z części wydrukowanych w 3D. Napisałem też własny sterownik wyświetlacza segmentowego i menu obsługiwane pilotem. Urządzenie nadal działa.",
      "I gave our family VCR a second life by turning it into a media PC. I arranged an old laptop’s components in three layers using 3D-printed parts. I also wrote a segment-display driver and a remote-controlled menu. The device is still in use.",
    ),
    premise: l(
      "Komputer wewnątrz rodzinnego magnetowidu.",
      "A computer inside our family VCR.",
    ),
    role: l(
      "Konstrukcja, elektronika, sterownik i aplikacja C#",
      "Mechanical design, electronics, display driver and C# application",
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
        "Artykuł i zdjęcia",
        "Article and photos",
        "https://redark.pl/vhs-htpc-project",
      ),
      link(
        "Kod i schemat",
        "Code and circuit diagram",
        "https://github.com/adan2013/vhs-htpc",
      ),
    ],
  },
  {
    slug: "smart-home",
    name: "System smart home",
    nameEn: "Smart home system",
    date: "2023-07",
    tracks: ["software"],
    priority: "main",
    tags: ["React", "Node.js", "Home Assistant", "Zigbee"],
    caseStudy: "smart-home",
    summary: l(
      "Zaprojektowałem system, z którego korzystam na co dzień: interfejs w React na tablet, własny backend Node.js i integrację urządzeń przez Home Assistant. Gdy automatyzacje w Node-RED stały się zbyt złożone, przeniosłem logikę do kodu. Testy, logi i monitoring pomagają mi utrzymać stabilność całego rozwiązania.",
      "I designed a system I use every day: a React interface for a tablet, a custom Node.js backend and device integration through Home Assistant. When Node-RED automations grew too complex, I moved the logic into code. Tests, logs and monitoring help me keep the whole system stable.",
    ),
    premise: l(
      "Własny system. Od interfejsu na tablecie po urządzenia w domu.",
      "My own system. From a tablet interface to devices around the house.",
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
      link(
        "Frontend i zrzuty ekranu",
        "Frontend and screenshots",
        "https://github.com/adan2013/HA-Dashboard",
      ),
      link("Backend", "Backend", "https://github.com/adan2013/HA-Backend"),
    ],
  },
  {
    slug: "book-reader",
    name: "Raspberry Book Reader",
    date: "2021-10",
    tracks: ["software", "hardware"],
    priority: "secondary",
    tags: ["Raspberry Pi", "Python", "ATtiny85"],
    summary: l(
      "Przygotowałem dla babci czytnik audiobooków z prostą obsługą, dostosowaną do potrzeb osoby starszej lub niedowidzącej. Oprogramowanie napisałem w Pythonie na Raspberry Pi, a ATtiny85 odpowiadał za bezpieczne włączanie i wyłączanie. Punktem wyjścia był konkretny użytkownik, nie lista funkcji.",
      "I made an audiobook player for my grandmother, with simple controls suited to an older or visually impaired user. I wrote the software in Python on a Raspberry Pi, with an ATtiny85 handling safe power-on and shutdown. I started with a particular person’s needs, rather than a feature list.",
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
        "Repozytorium czytnika",
        "Player repository",
        "https://github.com/adan2013/RaspberryBookReader",
      ),
      link(
        "Artykuł o budowie",
        "Build article",
        "https://redark.pl/diy-raspberry-book-reader",
      ),
      link(
        "Film z działania",
        "Video demonstration",
        "https://youtu.be/_oJZlEEj5N0",
      ),
    ],
  },
  {
    slug: "arduino-dashboard",
    name: "DIY Arduino Dashboard",
    date: "2021-06",
    tracks: ["software", "hardware"],
    priority: "main",
    tags: ["Arduino", "C++", "C# / WPF", "SPI"],
    caseStudy: "arduino-dashboard",
    video: "KW6sZINNi9Y",
    summary: l(
      "Zbudowałem fizyczne zegary samochodowe do ETS2 i ATS — od elektroniki i ręcznie wykonanych tarcz po oprogramowanie. To były moje pierwsze kroki w elektronice, poprzedzone miesiącami nauki bez AI. Ograniczenia Arduino i SPI rozwiązałem przez odświeżanie ekranu segmentami i interfejs z prostych prymitywów.",
      "I built physical vehicle gauges for ETS2 and ATS, from electronics and handmade gauge faces to the software. These were my first steps in electronics, following months of learning without AI. I addressed Arduino and SPI limitations by updating the screen in segments and building the interface from simple primitives.",
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
        "Repozytorium Dashboard",
        "Dashboard repository",
        "https://github.com/adan2013/DIY-Arduino-Dashboard",
      ),
      link(
        "Dokumentacja budowy",
        "Build documentation",
        "https://redark.pl/diy-arduino-dashboard-ets-ats",
      ),
      link(
        "Film na YouTube",
        "Video on YouTube",
        "https://youtu.be/KW6sZINNi9Y",
      ),
    ],
  },
  {
    slug: "irl-tracker",
    name: "IRL Tracker",
    date: "2020-07",
    tracks: ["software"],
    priority: "secondary",
    tags: ["Expo", "Mobile", "Bluetooth LE"],
    summary: l(
      "Zbudowałem prywatny MVP dla jednego streamera, żeby poznać Expo i rozwiązać jego konkretną potrzebę. Aplikacja przesyłała lokalizację telefonu do widżetu mapy na transmisji i obsługiwała sensory tętna przez Bluetooth LE.",
      "I built a private MVP for one streamer to learn Expo and meet a specific need. The app sent the phone’s location to a map widget on the stream and supported heart-rate sensors over Bluetooth LE.",
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
    tags: ["React", "Gatsby", "MDX", "SEO"],
    caseStudy: "redark",
    summary: l(
      "Założyłem blog, żeby dzielić się wiedzą i dokumentować własne projekty. Zacząłem od WordPressa z własnym motywem, a w 2020 roku przeniosłem stronę na React i Gatsby. Usunąłem zależność od WordPressa i wtyczek, zachowując adresy artykułów. Treści utrzymuję w MDX, a kod jest publiczny.",
      "I started a blog to share what I learned and document my projects. It began with a custom WordPress theme; in 2020, I migrated it to React and Gatsby. I removed the dependency on WordPress and its plugins while keeping article URLs intact. Content lives in MDX and the code is public.",
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
      link("Czytaj blog", "Read the blog", "https://redark.pl"),
      link(
        "Kod bloga Gatsby",
        "Gatsby blog source",
        "https://github.com/adan2013/Redark-Gatsby-Blog",
      ),
      link(
        "Eksperyment Next.js",
        "Next.js experiment",
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
        "Modelowanie parametryczne": "Parametric modelling",
      } as Record<string, string>
    )[tag] ?? tag
  );
}
