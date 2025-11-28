import React from 'react';
import Skeleton from './Skeleton';

export default function TourCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
      {/* Image Skeleton */}
      <div className="relative w-full md:w-1/3 h-56 md:h-auto shrink-0">
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </div>

      {/* Content Skeleton */}
      <div className="p-5 md:p-6 grow">
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-2">
          <Skeleton variant="text" width="60%" height={28} />
          <Skeleton
            variant="rectangular"
            width={60}
            height={20}
            className="rounded-full"
          />
        </div>

        {/* Description */}
        <div className="mb-4 space-y-2">
          <Skeleton variant="text" width="100%" height={16} />
          <Skeleton variant="text" width="80%" height={16} />
        </div>

        {/* Location and Duration */}
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton variant="rectangular" width={120} height={20} />
          <Skeleton variant="rectangular" width={100} height={20} />
        </div>

        {/* Price and Button */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <Skeleton variant="rectangular" width={100} height={32} />
          <Skeleton
            variant="rectangular"
            width={120}
            height={40}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export function TourCardSkeletonList({
  count = 3,
}: {
  count?: number;
}): React.JSX.Element {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <TourCardSkeleton key={index} />
      ))}
    </div>
  );
}
