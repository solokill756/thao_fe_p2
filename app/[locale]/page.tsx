import { Suspense } from 'react';
import { getDictionary } from '../lib/get-dictionary';
import RenderHeroSectionSkeleton from '../components/sekeleton/RenderHeroSectionSkeleton';
import TrendingPackagesSkeleton from '../components/sekeleton/TrendingPackagesSkeleton';
import RenderHeroSection from './components/RenderHeroSection';
import RenderServicesSection from './components/RenderServicesSection';
import RenderTrendingPackagesSection from './components/RenderTrendingPackagesSection';

type Props = {
  params: Promise<{ locale: 'en' | 'vi' }>;
};

export default async function RenderHomePage({ params }: Props) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <>
      <Suspense fallback={<RenderHeroSectionSkeleton />}>
        <RenderHeroSection dictionary={dictionary} />
      </Suspense>

      <RenderServicesSection dictionary={dictionary} />

      <Suspense fallback={<TrendingPackagesSkeleton />}>
        <RenderTrendingPackagesSection
          dictionary={dictionary}
          locale={locale}
        />
      </Suspense>
    </>
  );
}
