import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enLocale from './locales/en.json';
import plLocale from './locales/pl.json';

const locales = {
  en: {
    translation: enLocale
  },
  pl: {
    translation: plLocale
  }
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: locales,
    supportedLngs: ['en', 'pl'],
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
