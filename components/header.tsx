"use client";

import { useTranslations } from "@/components/i18n-provider";
import { Action } from "@/components/ui/action";
import { PageShell } from "@/components/ui/page-shell";
import { localizedPath } from "@/lib/localized-routes";
import type { Locale } from "@/lib/projects";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const path = usePathname();
  const home = localizedPath(locale);
  const publicPath =
    locale === "pl"
      ? path.replace(/^\/pl(?=\/|$)/, "") || "/"
      : path.replace(/^\/en(?=\/|$)/, "") || "/";
  const other = localizedPath(locale === "pl" ? "en" : "pl", publicPath);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(path);
  const links = [
    { href: `${home}#about`, label: t("navigation.about") },
    { href: `${home}#projects`, label: t("navigation.projects") },
    { href: `${home}#github`, label: t("navigation.github") },
    { href: `${home}#contact`, label: t("navigation.contact") },
  ];

  if (menuPath !== path) {
    setMenuPath(path);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 601px)");
    const reset = () => desktop.matches && setMenuOpen(false);
    window.addEventListener("keydown", close);
    desktop.addEventListener("change", reset);
    return () => {
      window.removeEventListener("keydown", close);
      desktop.removeEventListener("change", reset);
    };
  }, [menuOpen]);

  return (
    <header className="site-header sticky top-0 z-30 border-b border-line bg-page/95 backdrop-blur-lg print:hidden">
      <PageShell className="header-inner flex h-21.75 items-center justify-between gap-6 max-tablet:h-19 max-mobile:h-17.5 max-mobile:gap-2.5">
        <Link
          className="brand flex items-center gap-3 text-[18px] font-semibold tracking-[-0.04em] max-tablet:text-[16px] max-mobile:gap-1.75 max-mobile:text-[13px]"
          href={home}
          aria-label={t("navigation.brandLabel")}
        >
          <span
            className="brand-mark mr-0.75 grid size-5.5 rotate-[-8deg] grid-cols-[9px_9px] gap-0.5 [&>i]:bg-ink [&>i:last-child]:col-start-2 [&>i:last-child]:bg-accent max-mobile:mr-px max-mobile:size-4.25 max-mobile:grid-cols-[7px_7px]"
            aria-hidden="true"
          >
            <i />
            <i />
            <i />
          </span>
          Daniel Alberski
          <span className="brand-dot -ml-3 text-accent max-mobile:-ml-1.75">
            .
          </span>
        </Link>
        <nav
          className="flex shrink-0 items-center gap-5.5 text-[14px] max-tablet:gap-3 max-tablet:text-[13px] max-mobile:gap-1 max-mobile:text-[11px]"
          aria-label={t("navigation.main")}
        >
          {links.map((link) => (
            <Action
              key={link.href}
              className="max-mobile:hidden"
              href={link.href}
            >
              {link.label}
            </Action>
          ))}
          <Link
            className={`language relative ml-4 flex min-h-8 w-16 shrink-0 overflow-hidden rounded-none border border-field bg-page text-[12px] leading-4 font-medium transition-colors before:pointer-events-none before:absolute before:inset-0 before:bg-[#203d66] before:content-[''] hover:border-[#203d66] max-tablet:ml-0 max-mobile:w-14 max-mobile:text-[10px] ${locale === "pl" ? "before:[clip-path:polygon(0_0,55%_0,45%_100%,0_100%)]" : "before:[clip-path:polygon(55%_0,100%_0,100%_100%,45%_100%)]"}`}
            href={other}
            hrefLang={locale === "pl" ? "en" : "pl"}
            aria-label={t("navigation.switchLanguage")}
          >
            {(["pl", "en"] as const).map((language) => (
              <span
                key={language}
                lang={language}
                aria-hidden="true"
                className={`relative flex flex-1 items-center justify-center py-1.5 ${locale === language ? "text-white" : "text-muted"}`}
              >
                {language.toUpperCase()}
              </span>
            ))}
          </Link>
          <button
            type="button"
            className="menu-toggle relative ml-2 grid size-11 place-items-center border border-field bg-page text-ink transition-colors hover:border-ink mobile:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={t(
              menuOpen ? "navigation.closeMenu" : "navigation.openMenu",
            )}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span
              className="relative block h-3 w-4.5 [&>i]:absolute [&>i]:left-0 [&>i]:h-[1.5px] [&>i]:w-full [&>i]:bg-current [&>i]:transition-transform [&>i]:duration-220 [&>i]:ease-out"
              aria-hidden="true"
            >
              <i className={menuOpen ? "top-1.25 rotate-45" : "top-0"} />
              <i className={menuOpen ? "top-1.25 -rotate-45" : "top-2.5"} />
            </span>
          </button>
        </nav>
      </PageShell>
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="mobile-menu border-t border-line bg-page shadow-[0_12px_24px_-16px_rgb(20_36_59/0.35)] mobile:hidden"
      >
        <PageShell as="div" className="flex flex-col py-2">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => {
                setMenuOpen(false);
                if (path !== home) return;
                // Closing the menu shifts the layout and cancels the browser's
                // hash scroll, so scroll once the menu has collapsed.
                event.preventDefault();
                const hash = link.href.slice(link.href.indexOf("#"));
                requestAnimationFrame(() => {
                  history.pushState(null, "", hash);
                  document.querySelector(hash)?.scrollIntoView();
                });
              }}
              className="flex min-h-14 items-center justify-between border-b border-line text-[20px] font-medium tracking-tight text-ink last:border-b-0"
            >
              {link.label}
              <span className="text-[11px] tracking-[0.13em] text-muted tabular-nums">
                0{index + 1}
              </span>
            </Link>
          ))}
        </PageShell>
      </div>
    </header>
  );
}
