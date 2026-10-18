import { createTranslator, isLocale, locales } from "@/lib/i18n";
import { ogCard, ogContentType, ogSize } from "@/lib/og-card";

export const alt = "Daniel Alberski — Software Developer";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = createTranslator(isLocale(locale) ? locale : "pl");
  return ogCard({
    eyebrow: t("portfolio.hero.eyebrow"),
    title: "Daniel Alberski",
    subtitle: `${t("portfolio.hero.lead")} ${t("portfolio.hero.sublead")}`,
    footer: "Software Developer · React & TypeScript",
  });
}
