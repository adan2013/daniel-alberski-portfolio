"use client";

import { createContext, useContext, useMemo } from "react";
import {
  createTranslator,
  getTranslationList,
  type Locale,
  type Translator,
} from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  t: Translator;
  tList: (key: string) => string[];
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const value = useMemo(
    () => ({
      locale,
      t: createTranslator(locale),
      tList: (key: string) => getTranslationList(locale, key),
    }),
    [locale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}

export function useTranslations() {
  return useI18n().t;
}
