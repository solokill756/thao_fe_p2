export default function PaymentSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header Skeleton */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Skeleton */}
        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-8"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: PAYMENT FORM SKELETON */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Info Skeleton */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center py-3">
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Payment Method Skeleton */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>

              {/* Payment Method Options Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
                <div className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
              </div>

              {/* Form Skeleton */}
              <div className="space-y-4">
                <div className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
                  <div className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
              </div>

              {/* Submit Button Skeleton */}
              <div className="mt-8">
                <div className="h-14 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY SKELETON */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
              {/* Tour Image & Title Skeleton */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Price Details Skeleton */}
              <div className="border-t border-gray-100 py-4 space-y-3">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex justify-between">
                  <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Total Skeleton */}
              <div className="border-t border-gray-100 pt-4 mt-2">
                <div className="flex justify-between items-center">
                  <div className="h-7 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Info Box Skeleton */}
              <div className="mt-6 h-20 bg-gray-100 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
