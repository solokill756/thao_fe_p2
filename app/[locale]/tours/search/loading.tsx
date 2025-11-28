import { TourCardSkeletonList } from '@/app/components/sekeleton/TourCardSkeleton';
import Skeleton from '@/app/components/sekeleton/Skeleton';

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton variant="text" width="40%" height={48} className="mb-4" />
          <div className="space-y-2">
            <Skeleton variant="text" width="30%" height={20} />
            <Skeleton variant="text" width="25%" height={20} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
              <Skeleton variant="text" width="60%" height={24} />
              <div className="space-y-4">
                <Skeleton variant="rectangular" width="100%" height={40} />
                <Skeleton variant="rectangular" width="100%" height={40} />
                <Skeleton variant="rectangular" width="100%" height={40} />
              </div>
            </div>
          </div>

          {/* Tour Cards Skeleton */}
          <div className="lg:col-span-3">
            <TourCardSkeletonList count={5} />
          </div>
        </div>
      </div>
    </div>
  );
}
