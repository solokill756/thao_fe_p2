'use client';

import Image from 'next/image';
import type { DictType } from '@/app/lib/types/dictType';
import {
  PLACEHOLDER_IMAGE_URLS,
  LOCALE_CODES,
  REVIEW_CONSTANTS,
} from '@/app/lib/constants';
import { Calendar, Clock, Users } from 'lucide-react';

interface ReviewSummaryProps {
  booking: {
    booking_id: number;
    tour_id: number;
    tour_title: string;
    tour_cover_image_url: string | null;
    start_date: Date | null;
    duration_days: number | null;
    booking_date: Date;
    num_guests: number;
    total_price: number;
  };
  dictionary: DictType;
  locale: 'en' | 'vi';
}

export default function ReviewSummary({
  booking,
  dictionary,
  locale,
}: ReviewSummaryProps) {
  const profileDict = dictionary.useProfile || {};
  const tourDict = dictionary.tourDetail || {};

  const formatDate = (date: Date | string | null) => {
    if (!date) return '--';
    const parsed = typeof date === 'string' ? new Date(date) : date;
    const localeCode =
      locale === 'vi' ? LOCALE_CODES.VIETNAMESE : LOCALE_CODES.ENGLISH;
    return parsed.toLocaleDateString(localeCode, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={booking.tour_cover_image_url || PLACEHOLDER_IMAGE_URLS.TOUR}
            alt={booking.tour_title}
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <p className="text-sm text-gray-500">
              {profileDict.bookingId || 'Booking ID'}:{' '}
              <span className="font-mono text-gray-700">
                B{booking.booking_id.toString().padStart(6, '0')}
              </span>
            </p>
            <h2 className="text-2xl font-bold text-gray-900">
              {booking.tour_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs uppercase text-gray-400">
                  {tourDict.departureDate || 'Start date'}
                </p>
                <p className="font-medium">
                  {formatDate(booking.booking_date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs uppercase text-gray-400">
                  {tourDict.duration || 'Duration'}
                </p>
                <p className="font-medium">
                  {booking.duration_days ?? 1}{' '}
                  {tourDict.days || REVIEW_CONSTANTS.DAYS || 'days'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs uppercase text-gray-400">
                  {profileDict.guests || 'Guests'}
                </p>
                <p className="font-medium">{booking.num_guests}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
