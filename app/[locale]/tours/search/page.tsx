import { getDictionary } from '@/app/lib/get-dictionary';
import { searchToursAction } from '@/app/lib/services/tourService.server';
import { getDestinations } from '@/app/lib/services/destinationService.server';
import type { Category, Tour } from '@/app/lib/types/tourTypes';
import Link from 'next/link';
import {
  HERO_SECTION_CONSTANTS,
  SEARCH_TOURS_CONSTANTS,
} from '@/app/lib/constants';
import SearchSidebar from './SearchSidebar';
import SearchResultsClient from './SearchResultsClient';
import SearchFilterSync from './SearchFilterSync';
import { getCategories } from '@/app/lib/services/categoriesService.server';

type Props = {
  params: Promise<{ locale: 'en' | 'vi' }>;
  searchParams: Promise<{
    destination?: string;
    date?: string;
    guests?: string;
    minPrice?: string;
    maxPrice?: string;
    activities?: string;
    sortBy?: string;
    page?: string;
  }>;
};

export default async function RenderSearchToursPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const {
    destination,
    date,
    guests,
    minPrice,
    maxPrice,
    sortBy = 'priceAsc',
  } = await searchParams;

  // Fetch destinations to get names
  const destinations = await getDestinations();
  const destinationId = destination ? parseInt(destination) : undefined;
  const selectedDestination = destinationId
    ? destinations.find((d) => d.destination_id === destinationId)
    : null;

  // Search tours
  let tours: Tour[] = [];
  let error: string | null = null;
  let categories: Category[] = [];
  try {
    tours = await searchToursAction({
      destinationId,
      date: date || undefined,
      guests: guests ? parseInt(guests) : undefined,
      limit: SEARCH_TOURS_CONSTANTS.DEFAULT_LIMIT,
    });
    if (minPrice || maxPrice) {
      tours = tours.filter((tour) => {
        const price = Number(tour.price_per_person);
        const min = minPrice ? parseInt(minPrice) : 0;
        const max = maxPrice ? parseInt(maxPrice) : Infinity;
        return price >= min && price <= max;
      });
    }
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : HERO_SECTION_CONSTANTS.AN_ERROR_OCCURRED;
    console.error('Error searching tours:', {
      error: err,
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    categories = await getCategories();
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : HERO_SECTION_CONSTANTS.AN_ERROR_OCCURRED;
    console.error('Error fetching categories:', {
      error: err,
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchFilterSync />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4 border-b pb-4">
            {dictionary.homepage?.searchResults ||
              HERO_SECTION_CONSTANTS.SEARCH_RESULTS}{' '}
            <span className="text-gray-500 text-xl">
              ({tours.length} {dictionary.homepage?.toursFound || 'tours found'}
              )
            </span>
          </h1>
          {(selectedDestination || date || guests) && (
            <div className="text-gray-600 space-y-1 mt-4">
              {selectedDestination && (
                <p>
                  <span className="font-semibold">
                    {dictionary.homepage?.destinationLabel ||
                      HERO_SECTION_CONSTANTS.DESTINATION_LABEL}
                    :
                  </span>{' '}
                  {selectedDestination.name}
                  {selectedDestination.country &&
                    `, ${selectedDestination.country}`}
                </p>
              )}
              {date && (
                <p>
                  <span className="font-semibold">
                    {dictionary.homepage?.dateLabel ||
                      HERO_SECTION_CONSTANTS.DATE_LABEL}
                    :
                  </span>{' '}
                  {new Date(date).toLocaleDateString(
                    locale === 'vi'
                      ? SEARCH_TOURS_CONSTANTS.LOCALE_VI
                      : SEARCH_TOURS_CONSTANTS.LOCALE_EN
                  )}
                </p>
              )}
              {guests && (
                <p>
                  <span className="font-semibold">
                    {dictionary.homepage?.guestsLabel ||
                      HERO_SECTION_CONSTANTS.GUESTS_LABEL}
                    :
                  </span>{' '}
                  {guests}
                </p>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {tours.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">
              {dictionary.homepage?.noResults ||
                HERO_SECTION_CONSTANTS.NO_RESULTS}
            </p>
            <Link
              href={`/${locale}`}
              className="mt-4 inline-block text-orange-500 hover:text-orange-600"
            >
              {dictionary.homepage?.backToHome ||
                HERO_SECTION_CONSTANTS.BACK_TO_HOME}
            </Link>
          </div>
        )}

        {tours.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <SearchSidebar dictionary={dictionary} categories={categories} />
            </div>

            {/* Tour Listing Area */}
            <div className="lg:col-span-3">
              <SearchResultsClient
                tours={tours}
                sortBy={sortBy}
                locale={locale}
                dictionary={dictionary}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
