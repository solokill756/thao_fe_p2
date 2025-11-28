import { create } from 'zustand';
import { SEARCH_TOURS_CONSTANTS } from '../constants';

interface SearchFilterState {
  // Price filter
  minPrice: number;
  maxPrice: number;

  // Category filter
  selectedCategories: number[];

  // Sort
  sortBy: string;

  // Pagination
  page: number;

  // Search params (from URL)
  destination?: number;
  date?: string;
  guests?: number;

  // Actions
  setMinPrice: (minPrice: number) => void;
  setMaxPrice: (maxPrice: number) => void;
  setPriceRange: (min: number, max: number) => void;
  toggleCategory: (categoryId: number) => void;
  setSelectedCategories: (categories: number[]) => void;
  setSortBy: (sortBy: string) => void;
  setPage: (page: number) => void;
  setSearchParams: (params: {
    destination?: number;
    date?: string;
    guests?: number;
  }) => void;
  resetFilters: () => void;
  resetPriceFilter: () => void;
  resetCategoryFilter: () => void;
}

const initialState = {
  minPrice: SEARCH_TOURS_CONSTANTS.DEFAULT_MIN_PRICE,
  maxPrice: SEARCH_TOURS_CONSTANTS.DEFAULT_MAX_PRICE,
  selectedCategories: [] as number[],
  sortBy: 'priceAsc',
  page: 1,
  destination: undefined,
  date: undefined,
  guests: undefined,
};

export const useSearchFilterStore = create<SearchFilterState>((set) => ({
  ...initialState,

  setMinPrice: (minPrice) => set({ minPrice }),

  setMaxPrice: (maxPrice) => set({ maxPrice }),

  setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max }),

  toggleCategory: (categoryId) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(categoryId)
        ? state.selectedCategories.filter((id) => id !== categoryId)
        : [...state.selectedCategories, categoryId],
    })),

  setSelectedCategories: (categories) =>
    set({ selectedCategories: categories }),

  setSortBy: (sortBy) => set({ sortBy, page: 1 }),

  setPage: (page) => set({ page }),

  setSearchParams: (params) => set({ ...params, page: 1 }),

  resetFilters: () => set(initialState),

  resetPriceFilter: () =>
    set({
      minPrice: SEARCH_TOURS_CONSTANTS.DEFAULT_MIN_PRICE,
      maxPrice: SEARCH_TOURS_CONSTANTS.DEFAULT_MAX_PRICE,
    }),

  resetCategoryFilter: () => set({ selectedCategories: [] }),
}));
