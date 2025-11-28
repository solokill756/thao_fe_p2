import Skeleton from './Skeleton';

export default function TrendingPackagesSkeleton() {
  return (
    <section id="packages" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Promotion text skeleton */}
        <Skeleton
          variant="text"
          width="20%"
          height={24}
          className="mx-auto mb-2"
        />

        {/* Title skeleton */}
        <Skeleton
          variant="text"
          width="40%"
          height={48}
          className="mx-auto mb-12"
        />

        {/* Tour cards grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-xl"
            >
              {/* Image skeleton */}
              <Skeleton variant="rectangular" width="100%" height={192} />

              {/* Content skeleton */}
              <div className="p-6 text-left">
                <div className="flex justify-between items-center mb-2">
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton
                    variant="rectangular"
                    width={60}
                    height={20}
                    className="rounded-full"
                  />
                </div>
                <Skeleton
                  variant="text"
                  width="100%"
                  height={16}
                  className="mb-1"
                />
                <Skeleton
                  variant="text"
                  width="80%"
                  height={16}
                  className="mb-4"
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={40}
                  className="rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
