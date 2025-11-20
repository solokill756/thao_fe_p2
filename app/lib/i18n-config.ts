export const i18nConfig = {
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  prefixDefault: true,
};

export function getSupportedLocales() {
  return i18nConfig.locales;
}
