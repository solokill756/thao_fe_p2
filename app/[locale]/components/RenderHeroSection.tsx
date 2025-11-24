import { findTourAction } from '@/app/actions/home/findTourAction';
import SubmitButton from '@/app/components/common/SubmitButton';
import { HERO_SECTION_CONSTANTS, IMAGE_DIMENSIONS } from '@/app/lib/constants';
import { getDestinations } from '@/app/lib/services/destinationService.server';
import { Destination, DictType } from '@/app/lib/types';
import { MapPin, Search } from 'lucide-react';
import Image from 'next/image';

interface RenderHeroSectionProps {
  dictionary: DictType;
}

export default async function RenderHeroSection({
  dictionary,
}: RenderHeroSectionProps) {
  const homepageDict = dictionary.homepage;

  // Fetch destinations on server
  const destinations = await getDestinations();

  return (
    <div className="relative h-[600px] bg-gray-100 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/home_bg.jpg"
          alt="Hero Section Background"
          className="w-full h-full object-cover brightness-[0.8]"
          width={IMAGE_DIMENSIONS.HERO_WIDTH}
          height={IMAGE_DIMENSIONS.HERO_HEIGHT}
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-24 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate-fadeIn">
          {homepageDict?.title || HERO_SECTION_CONSTANTS.DEFAULT_TITLE}
        </h1>
        <p className="text-xl md:text-2xl font-light mb-10">
          {homepageDict?.greeting || HERO_SECTION_CONSTANTS.DEFAULT_GREETING}
        </p>

        {/* Thanh tìm kiếm */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl max-w-4xl mx-auto">
          <form
            action={findTourAction}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div className="flex items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
              <MapPin className="w-5 h-5 text-blue-500 mr-2 shrink-0" />
              <select
                name="destination"
                className="w-full bg-transparent text-gray-800 focus:outline-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>
                  {HERO_SECTION_CONSTANTS.WHERE_TO_PLACEHOLDER}
                </option>
                {destinations.map((destination: Destination) => (
                  <option
                    key={destination.destination_id}
                    value={destination.destination_id}
                  >
                    {destination.name}
                    {destination.country ? `, ${destination.country}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
              <Search className="w-5 h-5 text-blue-500 mr-2" />
              <input
                type="date"
                name="date"
                placeholder={HERO_SECTION_CONSTANTS.DATE_LABEL}
                className="w-full bg-transparent text-gray-800 focus:outline-none"
              />
            </div>
            <div className="flex items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
              <Search className="w-5 h-5 text-blue-500 mr-2" />
              <input
                type="number"
                name="guests"
                min="1"
                placeholder={HERO_SECTION_CONSTANTS.GUESTS_LABEL}
                className="w-full bg-transparent text-gray-800 focus:outline-none"
              />
            </div>
            <SubmitButton dictionary={dictionary} />
          </form>
        </div>
      </div>
    </div>
  );
}
