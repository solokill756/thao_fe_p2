'use client';

import { I18nextProvider } from 'react-i18next';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { i18nConfig } from '../lib/i18n-config';
import { DictType } from '../lib/types/dictType';

export default function CreateI18nProvider({
  children,
  locale,
  dictionary,
}: {
  children: React.ReactNode;
  locale: string;
  dictionary: DictType;
}) {
  const i18n = createInstance();

  i18n.use(initReactI18next).init({
    resources: {
      [locale]: {
        translation: dictionary,
      },
    },
    lng: locale,
    fallbackLng: i18nConfig.defaultLocale,
    interpolation: {
      escapeValue: false,
    },
  });

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
