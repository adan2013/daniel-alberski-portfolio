import "server-only";

import { notFound } from "next/navigation";
import { createTranslator, isLocale, type Locale } from "./i18n";

type LocaleParam = { locale: string };

export async function getRequestI18n<Params extends LocaleParam>(
  params: Promise<Params>,
) {
  const resolved = await params;
  if (!isLocale(resolved.locale)) notFound();

  return {
    ...resolved,
    locale: resolved.locale as Locale,
    t: createTranslator(resolved.locale),
  };
}
