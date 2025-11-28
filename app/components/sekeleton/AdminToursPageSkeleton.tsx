import React from 'react';
import Skeleton from './Skeleton';

export default function AdminToursPageSkeleton() {
  return (
    <>
      {/* Header Skeleton */}
      <header className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-20 px-8 py-4 flex justify-between items-center">
        <Skeleton variant="rectangular" width={200} height={28} />
        <div className="flex items-center space-x-4">
          <Skeleton
            variant="rectangular"
            width={256}
            height={40}
            className="hidden md:block rounded-lg"
          />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton
            variant="circular"
            width={40}
            height={40}
            className="lg:hidden"
          />
        </div>
      </header>

      <main className="p-8">
        {/* Action Bar Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <Skeleton
            variant="rectangular"
            width={150}
            height={40}
            className="rounded-lg"
          />
          <Skeleton
            variant="rectangular"
            width={150}
            height={40}
            className="rounded-lg"
          />
        </div>

        {/* Table Skeleton */}
        <div className="bg-white shadow-sm rounded-xl border border-slate-100 overflow-hidden">
          {/* Table Header */}
          <div className="bg-slate-50 p-4 border-b border-slate-100">
            <div className="grid grid-cols-6 gap-4">
              <Skeleton variant="text" width="80%" height={16} />
              <Skeleton variant="text" width="70%" height={16} />
              <Skeleton variant="text" width="60%" height={16} />
              <Skeleton variant="text" width="50%" height={16} />
              <Skeleton variant="text" width="40%" height={16} />
              <Skeleton
                variant="text"
                width="30%"
                height={16}
                className="ml-auto"
              />
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="p-4">
                <div className="grid grid-cols-6 gap-4 items-center">
                  {/* Tour Info */}
                  <div className="flex items-center gap-3">
                    <Skeleton
                      variant="rectangular"
                      width={64}
                      height={48}
                      className="rounded"
                    />
                    <div className="space-y-2">
                      <Skeleton variant="text" width={160} height={20} />
                      <Skeleton variant="text" width={100} height={16} />
                    </div>
                  </div>
                  {/* Location */}
                  <Skeleton variant="text" width={120} height={16} />
                  {/* Price & Duration */}
                  <div className="space-y-2">
                    <Skeleton variant="text" width={80} height={20} />
                    <Skeleton variant="text" width={100} height={16} />
                  </div>
                  {/* Category */}
                  <Skeleton
                    variant="rectangular"
                    width={100}
                    height={24}
                    className="rounded-full"
                  />
                  {/* Bookings */}
                  <div className="space-y-2">
                    <Skeleton variant="text" width={40} height={16} />
                    <Skeleton variant="text" width={60} height={14} />
                  </div>
                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
