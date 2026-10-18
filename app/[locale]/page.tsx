import { Contact } from "@/components/contact";
import { LaserArt } from "@/components/laser/art";
import { LaserCutter } from "@/components/laser/live";
import { GitHub } from "@/components/github";
import { Portfolio } from "@/components/portfolio";
import { SignalUnitArt } from "@/components/signal-unit/art";
import { SignalUnitScene } from "@/components/signal-unit/scene";
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
  const { locale, t } = await getRequestI18n(params);
  return (
    <main id="main">
      <Portfolio
        locale={locale}
        scene={
          <SignalUnitScene
            label={t("portfolio.hero.sceneLabel")}
            hint={t("portfolio.hero.sceneHint")}
            done={t("portfolio.hero.sceneDone")}
            mobile={t("portfolio.hero.desktopNote")}
          >
            <SignalUnitArt />
          </SignalUnitScene>
        }
      />
      <GitHub locale={locale} />
      <Contact
        locale={locale}
        figure={
          <>
            <LaserCutter locale={locale}>
              <LaserArt />
            </LaserCutter>
            <p className="mt-3 hidden text-center text-[13px] text-muted max-mobile:block">
              {t("portfolio.hero.desktopNote")}
            </p>
          </>
        }
      />
    </main>
  );
}
