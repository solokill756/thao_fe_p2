'use client';

import { useState } from 'react';
import { Tour } from '@/app/lib/types/tourTypes';
import { DictType } from '@/app/lib/types';
import {
  DEFAULT_VALUES,
  ERROR_MESSAGES,
  GOOGLE_MAPS,
} from '@/app/lib/constants';

interface GoogleMapProps {
  tour: Tour;
  className?: string;
  dictionary?: DictType;
}

export default function GoogleMap({
  tour,
  className = '',
  dictionary,
}: GoogleMapProps) {
  const [mapError, setMapError] = useState(false);
  const tourDetailDict = dictionary?.tourDetail;

  const getLocationAddress = () => {
    if (tour.destinations && tour.destinations.length > 0) {
      const destinationNames = tour.destinations
        .map((d) => d.destination.name)
        .join(', ');

      if (tour.departure_location) {
        return `${destinationNames}, ${tour.departure_location}`;
      }

      return destinationNames;
    }

    if (tour.departure_location) {
      return tour.departure_location;
    }

    return DEFAULT_VALUES.TRAVEL_DESTINATION;
  };

  const getMapSearchUrl = () => {
    const address = encodeURIComponent(getLocationAddress());
    return `${GOOGLE_MAPS.SEARCH_BASE_URL}${address}`;
  };

  const address = getLocationAddress();

  if (mapError || !address) {
    return (
      <div
        className={`w-full h-96 bg-gray-200 flex flex-col items-center justify-center rounded-xl shadow-inner ${className}`}
      >
        <p className="text-gray-500 font-mono mb-4">
          {mapError
            ? ERROR_MESSAGES.UNABLE_TO_LOAD_MAP
            : ERROR_MESSAGES.NO_LOCATION_INFO}
        </p>
        {address && (
          <a
            href={getMapSearchUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {tourDetailDict?.viewOnGoogleMaps || 'View on Google Maps'}
          </a>
        )}
      </div>
    );
  }

  return (
    <div
      className={`w-full h-96 rounded-xl shadow-inner overflow-hidden ${className}`}
    >
      <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center">
        <a
          href={getMapSearchUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md"
        >
          {tourDetailDict?.viewOnGoogleMaps || 'View on Google Maps'}
        </a>
        <p className="text-gray-400 text-sm mt-2 text-center px-4">{address}</p>
      </div>
    </div>
  );
}
