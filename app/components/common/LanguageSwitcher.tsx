'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { i18nConfig } from '@/app/lib/i18n-config';
import { DictType } from '@/app/lib/types/dictType';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';

interface LanguageSwitcherProps {
  dictionary?: DictType;
}

export default function LanguageSwitcher({
  dictionary,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const { push, isPending } = useNavigationLoading();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
    const locale = pathname.split('/')[1];
    setTimeout(() => {
      setCurrentLocale(locale);
    }, 0);
  }, [pathname]);

  const handleChange = (newLocale: string) => {
    if (currentLocale === newLocale || isPending) {
      return;
    }

    const segments = pathname.split('/').filter(Boolean);

    if (i18nConfig.locales.includes(segments[0])) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }

    const newPath = '/' + segments.join('/');
    push(newPath);
  };

  if (!mounted) {
    return null;
  }

  const label = dictionary?.languageSwitcher?.label || 'Switch Language';

  return (
    <div className="rounded-lg border border-gray-300 p-3">
      <strong className="font-semibold">{label}</strong>
      {i18nConfig.locales.map((locale) => (
        <button
          key={`lang-${locale}`}
          onClick={() => handleChange(locale)}
          disabled={currentLocale === locale || isPending}
          className={`
            ml-2
            rounded-md
            px-3
            py-1
            text-sm
            transition-colors
            ${
              currentLocale === locale
                ? 'font-bold bg-blue-500 text-white'
                : 'font-normal text-gray-700 hover:bg-gray-100'
            }
            disabled:opacity-50
            disabled:cursor-not-allowed
          `}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
