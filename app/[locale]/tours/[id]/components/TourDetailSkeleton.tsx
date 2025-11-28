import React from 'react';
import Skeleton from '@/app/components/sekeleton/Skeleton';

export default function TourDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content Area (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          {/* Tabs Skeleton */}
          <div className="flex justify-center space-x-6 mb-8 border-b border-gray-200">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width={100}
                height={48}
                className="rounded"
              />
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            <Skeleton variant="text" width="60%" height={36} />
            <div className="space-y-3">
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="95%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
            </div>

            {/* Info Grid Skeleton */}
            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <Skeleton
                    variant="circular"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  <Skeleton variant="text" width="70%" height={20} />
                </div>
              ))}
            </div>

            {/* Included/Not Included Skeleton */}
            <div className="space-y-4">
              <Skeleton variant="text" width="40%" height={32} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton
                      variant="circular"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    <Skeleton variant="text" width="80%" height={20} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar/Booking Form Skeleton (1/3 width on desktop) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            {/* Price Skeleton */}
            <div className="text-center pb-6 border-b border-gray-200">
              <Skeleton
                variant="text"
                width="60%"
                height={40}
                className="mx-auto"
              />
              <Skeleton
                variant="text"
                width="40%"
                height={24}
                className="mx-auto mt-2"
              />
            </div>

            {/* Form Fields Skeleton */}
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton variant="text" width="40%" height={16} />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={40}
                    className="rounded-md"
                  />
                </div>
              ))}
            </div>

            {/* Button Skeleton */}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={48}
              className="rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
