import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";
import { locales } from "@/lib/i18n";
import { getRequestI18n } from "@/lib/request-i18n";
import { socialMetadata } from "@/lib/site-metadata";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale, t } = await getRequestI18n(params);

  return {
    metadataBase: new URL("https://danielalberski.adanit.pl"),
    title: {
      default: t("metadata.title"),
      template: "%s — Daniel Alberski",
    },
    description: t("metadata.description"),
    applicationName: "Daniel Alberski",
    authors: [{ name: "Daniel Alberski" }],
    ...socialMetadata(locale, {
      title: t("metadata.title"),
      description: t("metadata.description"),
    }),
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await getRequestI18n(params);
  return <SiteLayout locale={locale}>{children}</SiteLayout>;
}
