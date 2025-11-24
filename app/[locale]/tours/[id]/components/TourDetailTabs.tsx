'use client';

import { useState } from 'react';
import { Tour } from '@/app/lib/types/tourTypes';
import { MapPin, Star, Clock, Users, CheckCircle } from 'lucide-react';
import TourPlan from './TourPlan';
import GoogleMap from './GoogleMap';
import TourReviews from './TourReviews';
import { DictType } from '@/app/lib/types';
import { TAB_IDS, DEFAULT_VALUES } from '@/app/lib/constants';

interface TourDetailTabsProps {
  tour: Tour;
  dictionary: DictType;
  locale: 'en' | 'vi';
}

export default function TourDetailTabs({
  tour,
  dictionary,
  locale,
}: TourDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<
    (typeof TAB_IDS)[keyof typeof TAB_IDS]
  >(TAB_IDS.INFORMATION);
  const tourDetailDict = dictionary.tourDetail;

  const renderContent = () => {
    switch (activeTab) {
      case TAB_IDS.INFORMATION:
        return (
          <div className="text-gray-700">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              {tourDetailDict?.aboutTheTour || 'About the Tour'}
            </h3>
            <p className="mb-6 leading-relaxed">{tour.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center text-blue-700 font-semibold">
                <Clock className="w-5 h-5 mr-2" />{' '}
                {tourDetailDict?.duration || 'Duration'}: {tour.duration_days}{' '}
                {tour.duration_days === 1
                  ? tourDetailDict?.day || 'Day'
                  : tourDetailDict?.days || 'Days'}
              </div>
              <div className="flex items-center text-blue-700 font-semibold">
                <MapPin className="w-5 h-5 mr-2" />{' '}
                {tourDetailDict?.destination || 'Destination'}:{' '}
                {tour.destinations.map((d) => d.destination.name).join(', ') ||
                  DEFAULT_VALUES.NOT_AVAILABLE}
              </div>
              <div className="flex items-center text-blue-700 font-semibold">
                <Star className="w-5 h-5 mr-2 fill-blue-700 text-blue-700" />{' '}
                {tourDetailDict?.rating || 'Rating'}:{' '}
                {tour.averageRating.toFixed(1)} ({tour._count.reviews}{' '}
                {tourDetailDict?.reviews || 'reviews'})
              </div>
              <div className="flex items-center text-blue-700 font-semibold">
                <Users className="w-5 h-5 mr-2" />{' '}
                {tourDetailDict?.maxGuests || 'Max Guests'}: {tour.max_guests}
              </div>
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-3">
              {tourDetailDict?.whatsIncluded || "What's Included"}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-none">
              {tour.what_included &&
                typeof tour.what_included === 'object' &&
                Array.isArray(tour.what_included) &&
                (tour.what_included as string[]).map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                    {item}
                  </li>
                ))}
            </ul>
            {tour.what_not_included &&
              typeof tour.what_not_included === 'object' &&
              Array.isArray(tour.what_not_included) &&
              (tour.what_not_included as string[]).length > 0 && (
                <>
                  <h4 className="text-2xl font-bold text-gray-800 mb-3 mt-6">
                    {tourDetailDict?.whatsNotIncluded || "What's Not Included"}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-none">
                    {(tour.what_not_included as string[]).map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-700"
                      >
                        <span className="w-5 h-5 text-red-500 mr-2 shrink-0">
                          ✗
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
          </div>
        );

      case TAB_IDS.TOUR_PLAN:
        return <TourPlan plans={tour.plans} dictionary={dictionary} />;

      case TAB_IDS.LOCATION:
        return (
          <div className="mt-10">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              {tourDetailDict?.locationDetails || 'Location Details'}
            </h3>
            <p className="text-gray-700 mb-6">
              {tourDetailDict?.locationDescription ||
                DEFAULT_VALUES.LOCATION_DESCRIPTION}{' '}
              <strong>
                {tour.destinations.map((d) => d.destination.name).join(', ') ||
                  DEFAULT_VALUES.NOT_AVAILABLE}
              </strong>
              . {tourDetailDict?.locationNote || DEFAULT_VALUES.LOCATION_NOTE}
            </p>
            {/* Google Maps */}
            <GoogleMap tour={tour} dictionary={dictionary} />
          </div>
        );

      case TAB_IDS.GALLERY:
        return (
          <div className="mt-10">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              {tourDetailDict?.gallery || 'Gallery'}
            </h3>
            {tour.gallery && tour.gallery.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {tour.gallery.map((img) => (
                  <div
                    key={img.image_id}
                    className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition duration-300"
                  >
                    <img
                      src={img.image_url}
                      alt={img.caption || `Gallery image ${img.image_id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                {tourDetailDict?.noGalleryImages ||
                  DEFAULT_VALUES.NO_GALLERY_IMAGES}
              </p>
            )}
          </div>
        );

      case TAB_IDS.REVIEWS:
        return (
          <TourReviews tour={tour} dictionary={dictionary} locale={locale} />
        );

      default:
        return null;
    }
  };

  const tabs = [
    {
      id: TAB_IDS.INFORMATION,
      label: tourDetailDict?.information || 'Information',
    },
    { id: TAB_IDS.TOUR_PLAN, label: tourDetailDict?.tourPlan || 'Tour Plan' },
    { id: TAB_IDS.LOCATION, label: tourDetailDict?.location || 'Location' },
    { id: TAB_IDS.GALLERY, label: tourDetailDict?.gallery || 'Gallery' },
    { id: TAB_IDS.REVIEWS, label: reviewDictLabel() },
  ];

  function reviewDictLabel() {
    return (
      tourDetailDict?.reviewsHeading || tourDetailDict?.reviews || 'Reviews'
    );
  }

  return (
    <>
      {/* Navigation Tabs */}
      <div className="flex justify-center space-x-6 mb-8 border-b border-gray-200">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 font-semibold transition duration-200 ${
                isActive
                  ? 'text-blue-600 border-b-4 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:border-b-4 hover:border-blue-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {renderContent()}
    </>
  );
}
