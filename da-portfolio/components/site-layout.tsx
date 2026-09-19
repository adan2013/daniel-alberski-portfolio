import { Footer } from "./footer";
import { Header } from "./header";
import { I18nProvider } from "./i18n-provider";
import type { Locale } from "@/lib/projects";
import { createTranslator } from "@/lib/i18n";
import "@/app/globals.css";
import "@/public/fonts/fonts.css";
export function SiteLayout({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const t = createTranslator(locale);
  return (
    <html
      lang={locale}
      className="scroll-smooth scroll-pt-27.5 max-mobile:scroll-pt-24 motion-reduce:scroll-auto"
    >
      <body className="bg-page font-body text-[17px] leading-[1.6] text-ink print:bg-white print:text-black">
        <I18nProvider locale={locale}>
          <a
            className="skip-link fixed top-2.5 left-2.5 z-100 translate-y-[-200%] bg-ink px-5 py-2.5 text-white focus:translate-y-0"
            href="#main"
          >
            {t("site.skipToContent")}
          </a>
          <Header locale={locale} />
          {children}
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
