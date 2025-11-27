import Skeleton from '@/app/components/sekeleton/Skeleton';

export default function BookingsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4"
        >
          {/* Tour Image Skeleton */}
          <Skeleton
            variant="rectangular"
            width={80}
            height={80}
            className="rounded-lg shrink-0"
          />

          {/* Content Skeleton */}
          <div className="grow w-full">
            <div className="flex justify-between items-start mb-3">
              <div className="space-y-2 flex-1">
                {/* Tour Title */}
                <Skeleton variant="text" width="60%" height={24} />
                {/* Booking ID */}
                <Skeleton variant="text" width="40%" height={16} />
              </div>
              {/* Status Badge */}
              <Skeleton
                variant="rectangular"
                width={100}
                height={28}
                className="rounded-full"
              />
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="70%" height={20} />
              <Skeleton variant="text" width="60%" height={20} />
            </div>
          </div>

          {/* Actions Skeleton */}
          <div className="flex flex-col gap-2 w-full md:w-auto mt-2 md:mt-0">
            <Skeleton
              variant="rectangular"
              width={120}
              height={36}
              className="rounded-lg"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
