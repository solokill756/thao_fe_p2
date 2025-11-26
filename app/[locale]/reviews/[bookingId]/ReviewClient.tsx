'use client';

import type { DictType } from '@/app/lib/types/dictType';
import { useBookingForReview } from '@/app/lib/hooks/useBookingForReview';
import ReviewSkeleton from './components/ReviewSkeleton';
import ReviewSummary from './components/ReviewSummary';
import ReviewForm from './components/ReviewForm';
import ErrorRetry from '@/app/components/common/ErrorRetry';
import { REVIEW_CONSTANTS } from '@/app/lib/constants';
import Link from 'next/link';

interface ReviewClientProps {
  locale: 'en' | 'vi';
  bookingId: number;
  dictionary: DictType;
}

export default function ReviewClient({
  locale,
  bookingId,
  dictionary,
}: ReviewClientProps) {
  const reviewDict = dictionary.review || {};
  const { data, isLoading, isError, refetch } = useBookingForReview(bookingId);

  if (isLoading) {
    return <ReviewSkeleton dictionary={dictionary} />;
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <ErrorRetry
          message={
            reviewDict.error ||
            REVIEW_CONSTANTS.ERROR ||
            'Unable to load review data'
          }
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!data.success || !data.booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md bg-white p-6 rounded-xl shadow-sm text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {data.error ||
              reviewDict.bookingNotFound ||
              REVIEW_CONSTANTS.BOOKING_NOT_FOUND}
          </h2>
          <Link
            href={`/${locale}/profile`}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            {reviewDict.backToBookings || REVIEW_CONSTANTS.BACK_TO_BOOKINGS}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <div>
          <p className="text-sm text-blue-600 font-medium uppercase tracking-wide mb-2">
            {reviewDict.subtitle || REVIEW_CONSTANTS.SUBTITLE}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {reviewDict.title || REVIEW_CONSTANTS.TITLE}
            </h1>
            <Link
              href={`/${locale}/profile`}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
            >
              {reviewDict.backToBookings || REVIEW_CONSTANTS.BACK_TO_BOOKINGS}
            </Link>
          </div>
        </div>

        <ReviewSummary
          booking={data.booking}
          dictionary={dictionary}
          locale={locale}
        />

        <ReviewForm
          bookingId={data.booking.booking_id}
          dictionary={dictionary}
          existingReview={data.existingReview}
        />
      </div>
    </div>
  );
}
