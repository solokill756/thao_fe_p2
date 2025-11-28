import React from 'react';
import Skeleton from './Skeleton';

export default function DestinationCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton variant="rectangular" width="100%" height={200} />

      {/* Content */}
      <div className="p-4">
        <Skeleton variant="text" width="70%" height={24} className="mb-2" />
        <Skeleton variant="text" width="50%" height={16} className="mb-3" />
        <Skeleton variant="text" width="100%" height={14} className="mb-1" />
        <Skeleton variant="text" width="80%" height={14} />
      </div>
    </div>
  );
}

export function DestinationCardSkeletonGrid({
  count = 6,
}: {
  count?: number;
}): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <DestinationCardSkeleton key={index} />
      ))}
    </div>
  );
}
