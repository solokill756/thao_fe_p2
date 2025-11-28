import React from 'react';
import Skeleton from '@/app/components/sekeleton/Skeleton';

export default function TourHeroSkeleton() {
  return (
    <div className="relative h-96 bg-gray-300">
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white px-4 w-full max-w-4xl">
          <Skeleton
            variant="text"
            width="80%"
            height={60}
            className="mx-auto mb-4 bg-white/20"
          />
          <div className="flex justify-center items-center space-x-4 flex-wrap gap-2">
            <Skeleton
              variant="rectangular"
              width={150}
              height={24}
              className="bg-white/20 rounded-full"
            />
            <Skeleton
              variant="rectangular"
              width={200}
              height={24}
              className="bg-white/20 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
