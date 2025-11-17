import 'server-only';

type Locale = 'en' | 'vi';

const dictionaries = {
  en: () =>
    import('../../dictionaries/en.json').then((module) => module.default),
  vi: () =>
    import('../../dictionaries/vi.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  const loader = dictionaries[locale] || dictionaries.en;
  return loader();
};
