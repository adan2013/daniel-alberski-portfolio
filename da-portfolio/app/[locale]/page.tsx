import { Contact } from "@/components/contact";
import { GitHub } from "@/components/github";
import { Portfolio } from "@/components/portfolio";
import { getRequestI18n } from "@/lib/request-i18n";
import { languageAlternates } from "@/lib/localized-routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await getRequestI18n(params);
  return { alternates: languageAlternates(locale) };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await getRequestI18n(params);
  return (
    <main id="main">
      <Portfolio locale={locale} />
      <GitHub locale={locale} />
      <Contact locale={locale} />
    </main>
  );
}
