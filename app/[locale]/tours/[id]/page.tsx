import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import TourDetailContent from './components/TourDetailContent';
import TourDetailSkeleton from './components/TourDetailSkeleton';
import TourHeroSection from './components/TourHeroSection';
import TourHeroSkeleton from './components/TourHeroSkeleton';

type Props = {
  params: Promise<{ locale: 'en' | 'vi'; id: string }>;
};

export default async function TourDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const tourId = parseInt(id);

  if (isNaN(tourId)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <main>
        <Suspense fallback={<TourHeroSkeleton />}>
          <TourHeroSection locale={locale} tourId={tourId} />
        </Suspense>

        <Suspense fallback={<TourDetailSkeleton />}>
          <TourDetailContent locale={locale} tourId={tourId} />
        </Suspense>
      </main>
    </div>
  );
}
