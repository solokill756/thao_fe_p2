'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import type { DictType } from '@/app/lib/types/dictType';
import { useSubmitReview } from '@/app/lib/hooks/useSubmitReview';
import { REVIEW_CONSTANTS } from '@/app/lib/constants';
import { toast } from 'react-hot-toast';

interface ReviewFormProps {
  bookingId: number;
  dictionary: DictType;
  existingReview?: {
    rating: number;
    comment: string | null;
  } | null;
}

const MAX_CHAR = 1000;

export default function ReviewForm({
  bookingId,
  dictionary,
  existingReview,
}: ReviewFormProps) {
  const reviewDict = dictionary.review || {};
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment ?? '');
  const submitReview = useSubmitReview();

  useEffect(() => {
    setRating(existingReview?.rating ?? 0);
    setComment(existingReview?.comment ?? '');
  }, [existingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error(
        reviewDict.selectRating || REVIEW_CONSTANTS.SELECT_RATING || ''
      );
      return;
    }

    try {
      const result = await submitReview.mutateAsync({
        bookingId,
        rating,
        comment: comment.trim() ? comment.trim() : undefined,
      });

      if (result.success) {
        toast.success(reviewDict.success || REVIEW_CONSTANTS.SUCCESS);
      } else {
        toast.error(result.error || REVIEW_CONSTANTS.ERROR);
      }
    } catch (error) {
      toast.error(reviewDict.error || REVIEW_CONSTANTS.ERROR);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= (hoverRating || rating);
      return (
        <button
          key={starValue}
          type="button"
          className="p-2"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
        >
          <Star
            className={`w-8 h-8 ${
              isActive ? 'text-yellow-400 fill-yellow-300' : 'text-gray-300'
            }`}
          />
        </button>
      );
    });
  };

  const renderStaticStars = (value: number) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= value;
        return (
          <Star
            key={starValue}
            className={`w-6 h-6 ${
              isActive ? 'text-yellow-400 fill-yellow-300' : 'text-gray-300'
            }`}
          />
        );
      })}
    </div>
  );

  if (existingReview) {
    return (
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg p-3">
          {reviewDict.existingReviewNote || REVIEW_CONSTANTS.SUCCESS}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            {reviewDict.ratingLabel || REVIEW_CONSTANTS.RATING_LABEL}
          </p>
          {renderStaticStars(existingReview.rating)}
        </div>
        {existingReview.comment ? (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              {reviewDict.commentLabel || REVIEW_CONSTANTS.COMMENT_LABEL}
            </p>
            <p className="text-gray-700 whitespace-pre-line bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm">
              {existingReview.comment}
            </p>
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-semibold text-gray-700">
            {reviewDict.ratingLabel || REVIEW_CONSTANTS.RATING_LABEL}
          </label>
          <div className="flex items-center gap-2 mt-2">{renderStars()}</div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 flex justify-between items-center">
            <span>
              {reviewDict.commentLabel || REVIEW_CONSTANTS.COMMENT_LABEL}{' '}
              <span className="text-gray-400 text-xs">
                ({reviewDict.optional || REVIEW_CONSTANTS.OPTIONAL})
              </span>
            </span>
            <span className="text-xs text-gray-400">
              {comment.length}/{MAX_CHAR}
            </span>
          </label>
          <textarea
            className="w-full mt-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition p-4 text-sm text-gray-700 min-h-[140px]"
            placeholder={
              reviewDict.commentPlaceholder ||
              REVIEW_CONSTANTS.COMMENT_PLACEHOLDER
            }
            maxLength={MAX_CHAR}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={submitReview.isPending}
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white text-sm font-semibold transition bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitReview.isPending
            ? REVIEW_CONSTANTS.PROCESSING || 'Submitting...'
            : reviewDict.submit || REVIEW_CONSTANTS.SUBMIT}
        </button>
      </form>
    </section>
  );
}
