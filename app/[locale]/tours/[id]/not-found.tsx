import Link from 'next/link';
import { getDictionary } from '@/app/lib/get-dictionary';
import { ROUTES } from '@/app/lib/constants';
import { i18nConfig } from '@/app/lib/i18n-config';

type Props = {
  params?: Promise<{ locale?: string }>;
};

export default async function RenderTourNotFound({ params }: Props) {
  let locale: 'en' | 'vi' = i18nConfig.defaultLocale as 'en' | 'vi';

  if (params) {
    const resolvedParams = await params;
    if (
      resolvedParams?.locale &&
      (resolvedParams.locale === 'en' || resolvedParams.locale === 'vi')
    ) {
      locale = resolvedParams.locale;
    }
  }

  const dictionary = await getDictionary(locale);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {dictionary.tourDetail?.tourNotFound || 'Tour Not Found'}
        </h1>
        <p className="text-gray-600 mb-8">
          {dictionary.tourDetail?.tourNotFoundDescription ||
            "The tour you're looking for doesn't exist or has been removed."}
        </p>
        <Link
          href={`/${locale}${ROUTES.TOURS_SEARCH}`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md"
        >
          {dictionary.tourDetail?.backToTours ||
            dictionary.homepage?.backToHome ||
            'Back to Tours'}
        </Link>
      </div>
    </div>
  );
}
