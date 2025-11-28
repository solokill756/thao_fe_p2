'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Star } from 'lucide-react';
import type { Tour } from '@/app/lib/types/tourTypes';
import {
  SEARCH_TOURS_CONSTANTS,
  TRENDING_PACKAGES_SECTION_CONSTANTS,
  HERO_SECTION_CONSTANTS,
} from '@/app/lib/constants';
import { DictType } from '@/app/lib/types';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';

interface TourCardProps {
  tour: Tour;
  locale: string;
  dictionary: DictType;
}

export default function TourCard({ tour, locale, dictionary }: TourCardProps) {
  const destinationName =
    tour.destinations && tour.destinations.length > 0
      ? tour.destinations[0].destination.name
      : dictionary.homepage?.unknownDestination ||
        SEARCH_TOURS_CONSTANTS.UNKNOWN_DESTINATION;

  const { isPending, push } = useNavigationLoading();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row transition duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-100">
      {/* Image */}
      <div className="relative w-full md:w-1/3 h-56 md:h-auto shrink-0">
        <Image
          src={tour.cover_image_url || SEARCH_TOURS_CONSTANTS.DEFAULT_IMAGE}
          alt={tour.title}
          className="w-full h-full object-cover"
          width={400}
          height={300}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-5 md:p-6 grow">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/${locale}/tours/${tour.tour_id}`}>
            <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 cursor-pointer transition">
              {tour.title}
            </h3>
          </Link>
          <div className="text-yellow-500 flex items-center text-sm ml-4 shrink-0">
            <Star className="w-4 h-4 fill-yellow-500 mr-1" />{' '}
            {tour.averageRating.toFixed(1)}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {tour.description}
        </p>

        <div className="flex items-center space-x-4 text-gray-500 text-sm mb-4">
          <span className="flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-blue-500" /> {destinationName}
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-blue-500" />{' '}
            {tour.duration_days}{' '}
            {tour.duration_days === 1
              ? dictionary.homepage?.day || HERO_SECTION_CONSTANTS.DAY
              : dictionary.homepage?.days || SEARCH_TOURS_CONSTANTS.DAYS}
          </span>
        </div>

        {/* Price and Button */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-2xl font-extrabold text-blue-600">
            ${tour.price_per_person.toFixed(2)}
          </span>
          {tour.start_date && tour.start_date > new Date() ? (
            <p className="text-gray-500 text-sm">
              {dictionary.trendingPackages?.comingSoon ||
                TRENDING_PACKAGES_SECTION_CONSTANTS.COMING_SOON}
            </p>
          ) : (
            <button
              onClick={() => push(`/${locale}/tours/${tour.tour_id}`)}
              className={`bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-5 rounded-lg transition duration-200 shadow-md ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isPending
                ? `${dictionary.trendingPackages?.bookNow || TRENDING_PACKAGES_SECTION_CONSTANTS.BOOK_NOW}...`
                : dictionary.trendingPackages?.bookNow ||
                  TRENDING_PACKAGES_SECTION_CONSTANTS.BOOK_NOW}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
