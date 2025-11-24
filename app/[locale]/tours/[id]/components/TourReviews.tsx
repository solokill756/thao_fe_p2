'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import type { Tour } from '@/app/lib/types/tourTypes';
import type { DictType } from '@/app/lib/types';
import { LOCALE_CODES, PLACEHOLDER_IMAGE_URLS } from '@/app/lib/constants';

interface TourReviewsProps {
  tour: Tour;
  dictionary: DictType;
  locale: 'en' | 'vi';
}

export default function TourReviews({
  tour,
  dictionary,
  locale,
}: TourReviewsProps) {
  const reviewDict = dictionary.tourDetail || {};
  const totalReviews = tour._count.reviews;
  const ratingBreakdown = tour.ratingBreakdown;
  const recentReviews = tour.reviews.slice(0, 6);

  const localeCode =
    locale === 'vi' ? LOCALE_CODES.VIETNAMESE : LOCALE_CODES.ENGLISH;

  const formatDate = (date: Date | string | null) => {
    if (!date) return '--';
    const parsed = typeof date === 'string' ? new Date(date) : date;
    if (Number.isNaN(parsed.getTime())) return '--';
    return new Intl.DateTimeFormat(localeCode, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(parsed);
  };

  const renderStars = (value: number, size: 'sm' | 'lg' = 'sm') => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= value;
      const className = size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';
      return (
        <Star
          key={starValue}
          className={`${className} ${
            isActive ? 'text-yellow-400 fill-yellow-300' : 'text-gray-300'
          }`}
        />
      );
    });
  };

  if (totalReviews === 0) {
    return (
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">
          {reviewDict.reviewsHeading || 'Guest Reviews'}
        </h3>
        <p className="text-gray-600">
          {reviewDict.noReviewsYet || 'No reviews yet.'}
        </p>
        <p className="text-gray-500 text-sm">
          {reviewDict.beFirstReview ||
            'Be the first to share your experience once the tour is completed.'}
        </p>
      </section>
    );
  }

  const breakdownEntries = [5, 4, 3, 2, 1].map((rating) => {
    const count = ratingBreakdown[rating as keyof typeof ratingBreakdown];
    const percent = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
    return { rating, count, percent };
  });

  return (
    <section className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500 mb-2">
            {reviewDict.overallRating || 'Overall Rating'}
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold text-gray-900">
              {tour.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-500">
              / 5 · {totalReviews} {reviewDict.reviews || 'reviews'}
            </span>
          </div>
          <div className="flex gap-1 mt-3">
            {renderStars(Math.round(tour.averageRating), 'lg')}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">
            {reviewDict.ratingBreakdown || 'Rating Breakdown'}
          </p>
          <div className="space-y-2">
            {breakdownEntries.map(({ rating, count, percent }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-gray-600 w-12">
                  <span>{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-12 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">
          {reviewDict.recentReviews || 'Recent Reviews'}
        </h3>
        <div className="space-y-4">
          {recentReviews.map((review) => (
            <div
              key={review.review_id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={review.user?.avatar_url || PLACEHOLDER_IMAGE_URLS.USER}
                  alt={review.user?.full_name || 'Guest avatar'}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {review.user?.full_name || 'Guest'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(review.created_at)}
                  </p>
                  <div className="flex gap-1 mt-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              {review.comment ? (
                <p className="mt-4 text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
