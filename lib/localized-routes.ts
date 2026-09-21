import type { Locale } from "./i18n";

export function localizedPath(locale: Locale, pathname = "/") {
  const path =
    pathname === "/"
      ? ""
      : pathname.startsWith("/")
        ? pathname
        : `/${pathname}`;
  return locale === "pl" ? path || "/" : `/en${path}`;
}

export function projectPath(locale: Locale, slug: string) {
  return localizedPath(locale, `/projects/${slug}`);
}

export function languageAlternates(locale: Locale, pathname = "/") {
  return {
    canonical: localizedPath(locale, pathname),
    languages: {
      pl: localizedPath("pl", pathname),
      en: localizedPath("en", pathname),
    },
  };
}
