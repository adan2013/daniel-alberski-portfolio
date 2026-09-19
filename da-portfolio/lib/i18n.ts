import en from "@/locales/en.json";
import pl from "@/locales/pl.json";

export const locales = ["pl", "en"] as const;
export type Locale = (typeof locales)[number];
export type TranslationParams = Record<string, string | number>;
export type Translator = (key: string, params?: TranslationParams) => string;

const dictionaries = { pl, en } as const;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

function resolve(locale: Locale, key: string): unknown {
  return key.split(".").reduce<unknown>((value, segment) => {
    if (!value || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[segment];
  }, dictionaries[locale]);
}

function translate(
  locale: Locale,
  key: string,
  params: TranslationParams = {},
) {
  const value = resolve(locale, key);
  if (typeof value !== "string") {
    throw new Error(`Missing i18n string for ${locale}.${key}`);
  }

  return value.replace(/{{(\w+)}}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

export function createTranslator(locale: Locale): Translator {
  return (key, params) => translate(locale, key, params);
}

export function getTranslationList(locale: Locale, key: string) {
  const value = resolve(locale, key);
  if (
    !Array.isArray(value) ||
    !value.every((item) => typeof item === "string")
  ) {
    throw new Error(`Missing i18n string list for ${locale}.${key}`);
  }
  return value;
}
