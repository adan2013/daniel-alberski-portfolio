import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { localizedPath } from "./localized-routes";

// Page-level `openGraph` replaces the layout's object, so each page rebuilds it.
export function socialMetadata(
  locale: Locale,
  {
    title,
    description,
    pathname = "/",
    type = "website",
  }: {
    title: string;
    description: string;
    pathname?: string;
    type?: "website" | "article";
  },
): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      type,
      siteName: "Daniel Alberski",
      title,
      description,
      url: localizedPath(locale, pathname),
      locale: locale === "pl" ? "pl_PL" : "en_US",
      alternateLocale: locale === "pl" ? "en_US" : "pl_PL",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
