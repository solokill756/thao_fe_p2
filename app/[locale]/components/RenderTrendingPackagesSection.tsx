import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { DictType } from '../../lib/types/dictType';
import { TRENDING_PACKAGES_SECTION_CONSTANTS } from '../../lib/constants';
import { getTrendingTours } from '../../lib/services/tourService.server';
import type { TrendingTour } from '../../lib/types/tourTypes';
import TourBookingButton from '../../components/common/TourBookingButton';

interface RenderTrendingPackagesSectionProps {
  dictionary: DictType;
  locale: string;
}

export default async function RenderTrendingPackagesSection({
  dictionary,
  locale,
}: RenderTrendingPackagesSectionProps) {
  const trendingPackagesDict = dictionary.trendingPackages;

  // Fetch trending tours on server
  const trendingTours = await getTrendingTours(4);

  if (trendingTours.length === 0) {
    return (
      <section id="packages" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">
            {trendingPackagesDict?.noTrendingTours ||
              TRENDING_PACKAGES_SECTION_CONSTANTS.NO_TRENDING_TOURS}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="packages" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-orange-500 font-semibold mb-2">
          {trendingPackagesDict?.promotion ||
            TRENDING_PACKAGES_SECTION_CONSTANTS.PROMOTION}
        </p>
        <h2 className="text-4xl font-bold text-gray-800 mb-12">
          {trendingPackagesDict?.title ||
            TRENDING_PACKAGES_SECTION_CONSTANTS.DEFAULT_TITLE}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingTours.map((tour: TrendingTour) => (
            <div
              key={tour.tour_id}
              className="bg-white rounded-xl overflow-hidden shadow-xl transition duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={tour.cover_image_url || ''}
                  alt={tour.title || ''}
                  className="w-full h-full object-cover rounded-t-xl"
                  loading="lazy"
                  width={320}
                  height={200}
                />
                <div className="absolute bottom-0 left-0 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-tr-xl">
                  ${tour.price_per_person.toString()}
                </div>
              </div>
              <div className="p-6 text-left">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    {tour.title}
                  </h3>
                  <div className="text-yellow-500 flex items-center text-sm">
                    <FaStar className="w-4 h-4 mr-1" />
                    {tour.averageRating.toFixed(1)}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {tour.description}
                </p>
                <TourBookingButton
                  tourId={tour.tour_id}
                  startDate={tour.start_date}
                  locale={locale}
                  dictionary={dictionary}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
