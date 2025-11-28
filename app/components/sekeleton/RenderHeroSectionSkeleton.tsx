import Skeleton from './Skeleton';

export default function RenderHeroSectionSkeleton() {
  return (
    <div className="relative h-[600px] bg-gray-100 overflow-hidden">
      {/* Background skeleton */}
      <div className="absolute inset-0 bg-gray-200 animate-pulse" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-24 text-center">
        {/* Title skeleton */}
        <Skeleton
          variant="text"
          width="60%"
          height={56}
          className="mx-auto mb-4"
        />
        {/* Subtitle skeleton */}
        <Skeleton
          variant="text"
          width="40%"
          height={32}
          className="mx-auto mb-10"
        />

        {/* Search form skeleton */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton variant="rectangular" width="100%" height={56} />
            <Skeleton variant="rectangular" width="100%" height={56} />
            <Skeleton variant="rectangular" width="100%" height={56} />
            <Skeleton variant="rectangular" width="100%" height={56} />
          </div>
        </div>
      </div>
    </div>
  );
}
