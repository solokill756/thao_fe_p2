import { notFound } from 'next/navigation';
import { getDictionary } from '@/app/lib/get-dictionary';
import { MapPin, Star } from 'lucide-react';
import TourDetailTabs from './TourDetailTabs';
import BookingForm from './BookingForm';
import Image from 'next/image';
import { getTourById } from '@/app/lib/services/tourService.server';
import { DEFAULT_VALUES } from '@/app/lib/constants';

interface TourDetailContentProps {
  locale: 'en' | 'vi';
  tourId: number;
}

export default async function TourDetailContent({
  locale,
  tourId,
}: TourDetailContentProps) {
  const dictionary = await getDictionary(locale);
  const tour = await getTourById(tourId);

  if (!tour) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <TourDetailTabs tour={tour} dictionary={dictionary} locale={locale} />
        </div>

        <div className="lg:col-span-1">
          <BookingForm tour={tour} locale={locale} dictionary={dictionary} />
        </div>
      </div>
    </div>
  );
}
