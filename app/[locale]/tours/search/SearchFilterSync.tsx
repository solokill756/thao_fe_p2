'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearchFilterStore } from '@/app/lib/stores/searchFilterStore';
import { SEARCH_TOURS_CONSTANTS } from '@/app/lib/constants';

export default function SearchFilterSync() {
  const searchParams = useSearchParams();
  const {
    setMinPrice,
    setMaxPrice,
    setSelectedCategories,
    setSortBy,
    setPage,
    setSearchParams,
  } = useSearchFilterStore();

  useEffect(() => {
    // Sync price filters
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    if (minPrice) {
      setMinPrice(parseInt(minPrice));
    } else {
      setMinPrice(SEARCH_TOURS_CONSTANTS.DEFAULT_MIN_PRICE);
    }

    if (maxPrice) {
      setMaxPrice(parseInt(maxPrice));
    } else {
      setMaxPrice(SEARCH_TOURS_CONSTANTS.DEFAULT_MAX_PRICE);
    }

    // Sync category filters
    const categories = searchParams.get('categories');
    if (categories) {
      setSelectedCategories(categories.split(',').map(Number));
    } else {
      setSelectedCategories([]);
    }

    // Sync sort
    const sortBy = searchParams.get('sortBy');
    if (sortBy) {
      setSortBy(sortBy);
    }

    // Sync page
    const page = searchParams.get('page');
    if (page) {
      setPage(parseInt(page));
    } else {
      setPage(1);
    }

    // Sync search params (destination, date, guests)
    const destination = searchParams.get('destination');
    const date = searchParams.get('date');
    const guests = searchParams.get('guests');

    setSearchParams({
      destination: destination ? parseInt(destination) : undefined,
      date: date || undefined,
      guests: guests ? parseInt(guests) : undefined,
    });
  }, [
    searchParams,
    setMinPrice,
    setMaxPrice,
    setSelectedCategories,
    setSortBy,
    setPage,
    setSearchParams,
  ]);

  return null;
}
