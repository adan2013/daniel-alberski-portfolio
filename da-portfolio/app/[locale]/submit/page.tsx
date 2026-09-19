import { Action } from "@/components/ui/action";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PageShell } from "@/components/ui/page-shell";
import { getRequestI18n } from "@/lib/request-i18n";
import { localizedPath } from "@/lib/localized-routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { t } = await getRequestI18n(params);
  return { title: t("submit.title"), robots: { index: false } };
}

export default async function Submit({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getRequestI18n(params);
  const home = localizedPath(locale);

  return (
    <PageShell
      as="main"
      id="main"
      className="submit-page min-h-[60vh] py-25 [&_h1]:mb-6 [&_h1]:text-[48px] [&_h1]:leading-[1.2] [&_p]:mb-6.25 max-mobile:py-15 max-mobile:[&_h1]:text-[38px]"
    >
      <Eyebrow>{t("submit.eyebrow")}</Eyebrow>
      <h1>{t("submit.heading")}</h1>
      <p>{t("submit.description")}</p>
      <Action href={home} variant="primary">
        {t("submit.back")}
      </Action>
    </PageShell>
  );
}
