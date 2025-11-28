'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Tour } from '@/app/lib/types/tourTypes';
import { DictType } from '@/app/lib/types';
import {
  SEARCH_TOURS_CONSTANTS,
  HERO_SECTION_CONSTANTS,
  SORT_CRITERIA,
} from '@/app/lib/constants';
import TourCard from './TourCard';
import SortOptions from './SortOptions';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';
import { useSearchFilterStore } from '@/app/lib/stores/searchFilterStore';

interface SearchResultsClientProps {
  tours: Tour[];
  sortBy: string;
  locale: string;
  dictionary: DictType;
}

export default function SearchResultsClient({
  tours,
  locale,
  dictionary,
}: SearchResultsClientProps) {
  const { push } = useNavigationLoading();
  const searchParams = useSearchParams();

  const {
    sortBy,
    page: currentPage,
    setSortBy,
    setPage,
  } = useSearchFilterStore();

  // Sort tours
  const sortedTours = useMemo(() => {
    const sorted = [...tours];
    switch (sortBy) {
      case SORT_CRITERIA.PRICE_ASC:
        sorted.sort(
          (a, b) => Number(a.price_per_person) - Number(b.price_per_person)
        );
        break;
      case SORT_CRITERIA.PRICE_DESC:
        sorted.sort(
          (a, b) => Number(b.price_per_person) - Number(a.price_per_person)
        );
        break;
      case SORT_CRITERIA.NAME_ASC:
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    return sorted;
  }, [tours, sortBy]);

  // Pagination
  const totalPages = Math.ceil(
    sortedTours.length / SEARCH_TOURS_CONSTANTS.ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * SEARCH_TOURS_CONSTANTS.ITEMS_PER_PAGE;
  const paginatedTours = sortedTours.slice(
    startIndex,
    startIndex + SEARCH_TOURS_CONSTANTS.ITEMS_PER_PAGE
  );

  const handleSort = (criteria: string) => {
    setSortBy(criteria);
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', criteria);
    params.set('page', '1');
    push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    push(`?${params.toString()}`);
  };

  return (
    <>
      {/* Sort Options */}
      <SortOptions
        sortBy={sortBy}
        onSort={handleSort}
        dictionary={dictionary}
      />

      {/* List of Tours */}
      <div className="space-y-6">
        {paginatedTours.map((tour) => (
          <TourCard
            key={tour.tour_id}
            tour={tour}
            locale={locale}
            dictionary={dictionary}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <nav className="flex space-x-1" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {dictionary.homepage?.previous || HERO_SECTION_CONSTANTS.PREVIOUS}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 leading-tight rounded-lg ${
                  currentPage === page
                    ? 'z-10 text-white bg-blue-600 border border-blue-600'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {dictionary.homepage?.next || HERO_SECTION_CONSTANTS.NEXT}
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
