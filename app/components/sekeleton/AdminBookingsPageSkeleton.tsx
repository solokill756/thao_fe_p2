import React from 'react';
import Skeleton from './Skeleton';

export default function AdminBookingsPageSkeleton() {
  return (
    <>
      {/* Header Skeleton */}
      <header className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-20 px-8 py-4 flex justify-between items-center">
        <Skeleton variant="rectangular" width={200} height={28} />
        <div className="flex items-center space-x-4">
          <Skeleton variant="rectangular" width={256} height={40} className="hidden md:block rounded-lg" />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={40} height={40} className="lg:hidden" />
        </div>
      </header>

      <main className="p-8">
        {/* Stats Overview Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <Skeleton variant="text" width={120} height={16} />
                <Skeleton variant="circular" width={48} height={48} />
              </div>
              <Skeleton variant="text" width={80} height={32} className="mb-2" />
              <div className="flex items-center gap-2">
                <Skeleton variant="text" width={60} height={14} />
                <Skeleton variant="text" width={100} height={14} />
              </div>
            </div>
          ))}
        </div>

        {/* Filters Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="flex items-center gap-4">
            <Skeleton variant="text" width={100} height={16} />
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width={100}
                height={36}
                className="rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white shadow-sm rounded-b-xl overflow-hidden border border-slate-100">
          {/* Table Header */}
          <div className="bg-slate-50 p-4 border-b border-slate-100">
            <div className="grid grid-cols-7 gap-4">
              <Skeleton variant="text" width="70%" height={16} />
              <Skeleton variant="text" width="60%" height={16} />
              <Skeleton variant="text" width="50%" height={16} />
              <Skeleton variant="text" width="40%" height={16} />
              <Skeleton variant="text" width="50%" height={16} />
              <Skeleton variant="text" width="40%" height={16} />
              <Skeleton variant="text" width="30%" height={16} className="ml-auto" />
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="p-4">
                <div className="grid grid-cols-7 gap-4 items-center">
                  {/* Booking ID */}
                  <Skeleton variant="text" width={80} height={16} />
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <Skeleton variant="circular" width={32} height={32} />
                    <div className="space-y-2">
                      <Skeleton variant="text" width={120} height={16} />
                      <Skeleton variant="text" width={100} height={14} />
                    </div>
                  </div>
                  {/* Tour Details */}
                  <div className="flex items-center gap-3">
                    <Skeleton variant="rectangular" width={48} height={32} className="rounded" />
                    <Skeleton variant="text" width={120} height={16} />
                  </div>
                  {/* Dates & Guests */}
                  <div className="space-y-2">
                    <Skeleton variant="text" width={100} height={16} />
                    <Skeleton variant="text" width={80} height={14} />
                  </div>
                  {/* Total & Payment */}
                  <div className="space-y-2">
                    <Skeleton variant="text" width={80} height={16} />
                    <Skeleton variant="text" width={100} height={14} />
                  </div>
                  {/* Status */}
                  <Skeleton variant="rectangular" width={100} height={24} className="rounded-full" />
                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <Skeleton variant="text" width={150} height={16} />
            <div className="flex gap-2">
              <Skeleton variant="rectangular" width={80} height={32} className="rounded" />
              <Skeleton variant="rectangular" width={80} height={32} className="rounded" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

