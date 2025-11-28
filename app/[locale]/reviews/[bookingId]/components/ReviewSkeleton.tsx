'use client';

import type { DictType } from '@/app/lib/types/dictType';
import { REVIEW_CONSTANTS } from '@/app/lib/constants';

interface ReviewSkeletonProps {
  dictionary: DictType;
}

export default function ReviewSkeleton({ dictionary }: ReviewSkeletonProps) {
  const reviewDict = dictionary.review || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-48 bg-gray-200 rounded" />
          <div className="h-10 w-72 bg-gray-200 rounded" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse space-y-4">
          <div className="flex gap-4">
            <div className="w-28 h-28 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-40" />
          <div className="h-14 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-11 bg-gray-200 rounded w-32" />
        </div>

        <p className="text-center text-sm text-gray-500">
          {reviewDict.loading || REVIEW_CONSTANTS.ERROR}
        </p>
      </div>
    </div>
  );
}
