import { notFound } from 'next/navigation';
import { MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import { getTourById } from '@/app/lib/services/tourService.server';
import { getDictionary } from '@/app/lib/get-dictionary';
import { DEFAULT_VALUES } from '@/app/lib/constants';

interface TourHeroSectionProps {
  locale: 'en' | 'vi';
  tourId: number;
}

export default async function TourHeroSection({
  locale,
  tourId,
}: TourHeroSectionProps) {
  const tour = await getTourById(tourId);
  const dictionary = await getDictionary(locale);

  if (!tour) {
    notFound();
  }

  const tourDetailDict = dictionary.tourDetail;

  return (
    <div className="relative h-96 bg-cover bg-center">
      {tour.cover_image_url ? (
        <Image
          src={tour.cover_image_url}
          alt={tour.title}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="w-full h-full bg-linear-to-r from-blue-600 to-blue-800" />
      )}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-2">
            {tour.title}
          </h1>
          <div className="flex justify-center items-center space-x-4 text-lg flex-wrap gap-2">
            <span className="flex items-center text-yellow-400">
              <Star className="w-5 h-5 fill-yellow-400 mr-1" />{' '}
              {tour.averageRating.toFixed(1)} ({tour._count.reviews}{' '}
              {tourDetailDict?.reviews || 'reviews'})
            </span>
            <span className="flex items-center">
              <MapPin className="w-5 h-5 mr-1" />{' '}
              {tour.destinations.map((d) => d.destination.name).join(', ') ||
                DEFAULT_VALUES.NOT_AVAILABLE}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
