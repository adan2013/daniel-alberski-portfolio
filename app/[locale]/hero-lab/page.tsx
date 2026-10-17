import type { Metadata } from "next";
import Link from "next/link";
import { HeroLabArt } from "@/components/hero-lab/art";
import { HeroLabScene } from "@/components/hero-lab/live";
import { PortraitArt } from "@/components/hero-lab/portrait";
import { PageShell } from "@/components/ui/page-shell";
import { getRequestI18n } from "@/lib/request-i18n";
import { localizedPath } from "@/lib/localized-routes";
import "@/components/hero-lab/hero-lab.css";

export const metadata: Metadata = {
  title: "Hero — Animation Lab",
  robots: { index: false, follow: false },
};

export default async function HeroLab({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await getRequestI18n(params);
  const pl = locale === "pl";
  return (
    <PageShell as="main" id="main" className="hero-lab">
      <header className="hl-intro">
        <div className="hl-eyebrow">
          <span />
          {pl ? "Pracownia / koncepcje hero" : "Lab / hero concepts"}
        </div>
        <h1>
          {pl
            ? "Trzy pomysły. Ten sam charakter."
            : "Three ideas. One visual language."}
        </h1>
        <div className="hl-intro-row">
          <p>
            {pl
              ? "Przewijaj stronę, aby wprawić sceny w ruch. Cofnij scroll, aby odwrócić animację."
              : "Scroll to move each scene. Scroll back to reverse it."}
          </p>
          <nav
            className="hl-nav"
            aria-label={pl ? "Koncepcje animacji" : "Animation concepts"}
          >
            <a href="#bench">01 / {pl ? "Stanowisko" : "Workbench"}</a>
            <a href="#plotter">02 / {pl ? "Ploter" : "Plotter"}</a>
            <a href="#portrait">03 / {pl ? "Portret" : "Portrait"}</a>
          </nav>
        </div>
      </header>
      <HeroLabScene concept="bench" locale={locale}>
        <HeroLabArt key="bench" concept="bench" />
      </HeroLabScene>
      <HeroLabScene concept="plotter" locale={locale}>
        <HeroLabArt key="plotter" concept="plotter" />
      </HeroLabScene>
      <HeroLabScene concept="portrait" locale={locale}>
        <PortraitArt key="portrait" />
      </HeroLabScene>
      <section
        className="hl-comparison"
        id="comparison"
        aria-labelledby="comparison-title"
      >
        <div className="hl-eyebrow">
          <span />
          {pl ? "Trzy kierunki" : "Three directions"}
        </div>
        <h2 id="comparison-title">
          {pl
            ? "Co ma opowiadać pierwsze wrażenie?"
            : "What should the first impression say?"}
        </h2>
        <div className="hl-comparison-grid">
          <a href="#bench">
            <h3>
              01 /{" "}
              {pl ? "Łączę części w system." : "I connect parts into a system."}
            </h3>
            <p>
              {pl
                ? "Stanowisko opowiada o integracji: od aplikacji, przez elektronikę, po działające urządzenie."
                : "The workbench tells a story of integration: from the application through electronics to a working device."}
            </p>
          </a>
          <a href="#plotter">
            <h3>
              02 / {pl ? "Buduję z precyzją." : "I build with precision."}
            </h3>
            <p>
              {pl
                ? "Ploter opowiada o procesie: od struktury, przez komponenty, po dopracowany interfejs."
                : "The plotter tells a story of process: from structure through components to a finished interface."}
            </p>
          </a>
          <a href="#portrait">
            <h3>
              03 /{" "}
              {pl ? "Osoba za projektami." : "The person behind the projects."}
            </h3>
            <p>
              {pl
                ? "Portret wyłania się z kolorowych fragmentów. Osobiste przywitanie z rytmem cyfrowej układanki."
                : "A portrait emerges from colored fragments. A personal introduction through a digital puzzle."}
            </p>
          </a>
        </div>
        <Link className="hl-back" href={localizedPath(locale)}>
          {pl ? "← Wróć do portfolio" : "← Back to portfolio"}
        </Link>
      </section>
    </PageShell>
  );
}
