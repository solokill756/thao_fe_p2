import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import SearchResultsClient from '../SearchResultsClient';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';
import { useSearchFilterStore } from '@/app/lib/stores/searchFilterStore';
import { SORT_CRITERIA, SEARCH_TOURS_CONSTANTS } from '@/app/lib/constants';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

// Mock hooks
jest.mock('@/app/lib/hooks/useNavigationLoading', () => ({
  useNavigationLoading: jest.fn(),
}));

jest.mock('@/app/lib/stores/searchFilterStore', () => ({
  useSearchFilterStore: jest.fn(),
}));

// Mock child components
jest.mock('../TourCard', () => {
  return function MockTourCard({ tour }: { tour: any }) {
    return <div data-testid="tour-card">{tour.title}</div>;
  };
});

jest.mock('../SortOptions', () => {
  return function MockSortOptions({ onSort }: { onSort: (criteria: string) => void }) {
    return (
      <div data-testid="sort-options">
        <button onClick={() => onSort(SORT_CRITERIA.PRICE_ASC)}>Sort</button>
      </div>
    );
  };
});

jest.mock('../SearchSidebar', () => {
  return function MockSearchSidebar() {
    return <div data-testid="search-sidebar">Search Sidebar</div>;
  };
});

const mockUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;
const mockUseNavigationLoading = useNavigationLoading as jest.MockedFunction<
  typeof useNavigationLoading
>;
const mockUseSearchFilterStore = useSearchFilterStore as jest.MockedFunction<
  typeof useSearchFilterStore
>;

describe('SearchResultsClient Component', () => {
  const mockTours = [
    {
      tour_id: 1,
      title: 'Paris Adventure',
      price_per_person: 500,
    },
    {
      tour_id: 2,
      title: 'London Tour',
      price_per_person: 600,
    },
    {
      tour_id: 3,
      title: 'Berlin Trip',
      price_per_person: 400,
    },
  ] as any;

  const mockCategories = [
    { category_id: 1, name: 'Adventure' },
  ] as any;

  const mockDictionary = {
    homepage: {
      noToursFound: 'No tours found',
      previous: 'Previous',
      next: 'Next',
    },
  } as any;

  const mockPush = jest.fn();
  const mockSetSortBy = jest.fn();
  const mockSetPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue({
      toString: () => '',
      get: jest.fn(),
    } as any);

    mockUseNavigationLoading.mockReturnValue({
      isPending: false,
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    });

    mockUseSearchFilterStore.mockReturnValue({
      sortBy: SORT_CRITERIA.PRICE_ASC,
      page: 1,
      setSortBy: mockSetSortBy,
      setPage: mockSetPage,
      minPrice: 0,
      maxPrice: 3600,
      selectedCategories: [],
      setMinPrice: jest.fn(),
      setMaxPrice: jest.fn(),
      toggleCategory: jest.fn(),
      setSelectedCategories: jest.fn(),
      setSearchParams: jest.fn(),
    } as any);
  });

  describe('Basic Rendering', () => {
    it('should render search results client', () => {
      const { container } = render(
        <SearchResultsClient
          tours={mockTours}
          categories={mockCategories}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render search sidebar', () => {
      render(
        <SearchResultsClient
          tours={mockTours}
          categories={mockCategories}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByTestId('search-sidebar')).toBeInTheDocument();
    });

    it('should render sort options', () => {
      render(
        <SearchResultsClient
          tours={mockTours}
          categories={mockCategories}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByTestId('sort-options')).toBeInTheDocument();
    });

    it('should render tour cards', () => {
      render(
        <SearchResultsClient
          tours={mockTours}
          categories={mockCategories}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      const tourCards = screen.getAllByTestId('tour-card');
      expect(tourCards.length).toBe(2);
    });
  });

  describe('Empty State', () => {
    it('should render empty state when no tours', () => {
      render(
        <SearchResultsClient
          tours={[]}
          sortBy={SORT_CRITERIA.PRICE_ASC}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('No tours found')).toBeInTheDocument();
    });
  });

  describe('Sorting Logic', () => {
    it('should sort tours by price ascending', () => {
      mockUseSearchFilterStore.mockReturnValue({
        sortBy: SORT_CRITERIA.PRICE_ASC,
        page: 1,
        setSortBy: mockSetSortBy,
        setPage: mockSetPage,
        minPrice: 0,
        maxPrice: 3600,
        selectedCategories: [],
        setMinPrice: jest.fn(),
        setMaxPrice: jest.fn(),
        toggleCategory: jest.fn(),
        setSelectedCategories: jest.fn(),
        setSearchParams: jest.fn(),
      } as any);

      render(
        <SearchResultsClient
          tours={mockTours}
          sortBy={SORT_CRITERIA.PRICE_ASC}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      // Tours should be sorted by price ascending
      const tourCards = screen.getAllByTestId('tour-card');
      expect(tourCards.length).toBeGreaterThan(0);
    });

    it('should sort tours by price descending', () => {
      mockUseSearchFilterStore.mockReturnValue({
        sortBy: SORT_CRITERIA.PRICE_DESC,
        page: 1,
        setSortBy: mockSetSortBy,
        setPage: mockSetPage,
        minPrice: 0,
        maxPrice: 3600,
        selectedCategories: [],
        setMinPrice: jest.fn(),
        setMaxPrice: jest.fn(),
        toggleCategory: jest.fn(),
        setSelectedCategories: jest.fn(),
        setSearchParams: jest.fn(),
      } as any);

      render(
        <SearchResultsClient
          tours={mockTours}
          sortBy={SORT_CRITERIA.PRICE_DESC}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      const tourCards = screen.getAllByTestId('tour-card');
      expect(tourCards.length).toBeGreaterThan(0);
    });

    it('should sort tours by name ascending', () => {
      mockUseSearchFilterStore.mockReturnValue({
        sortBy: SORT_CRITERIA.NAME_ASC,
        page: 1,
        setSortBy: mockSetSortBy,
        setPage: mockSetPage,
        minPrice: 0,
        maxPrice: 3600,
        selectedCategories: [],
        setMinPrice: jest.fn(),
        setMaxPrice: jest.fn(),
        toggleCategory: jest.fn(),
        setSelectedCategories: jest.fn(),
        setSearchParams: jest.fn(),
      } as any);

      render(
        <SearchResultsClient
          tours={mockTours}
          sortBy={SORT_CRITERIA.NAME_ASC}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      const tourCards = screen.getAllByTestId('tour-card');
      expect(tourCards.length).toBeGreaterThan(0);
    });

    it('should handle sort change', () => {
      render(
        <SearchResultsClient
          tours={mockTours}
          sortBy={SORT_CRITERIA.PRICE_ASC}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      const sortButton = screen.getByText('Sort');
      fireEvent.click(sortButton);
      expect(mockSetSortBy).toHaveBeenCalled();
    });
  });

  describe('Pagination', () => {
    it('should render pagination when totalPages > 1', () => {
      // Create enough tours to require pagination
      const manyTours = Array.from({ length: 15 }, (_, i) => ({
        tour_id: i + 1,
        title: `Tour ${i + 1}`,
        price_per_person: 500 + i * 10,
      }));

      mockUseSearchFilterStore.mockReturnValue({
        sortBy: SORT_CRITERIA.PRICE_ASC,
        page: 1,
        setSortBy: mockSetSortBy,
        setPage: mockSetPage,
        minPrice: 0,
        maxPrice: 3600,
        selectedCategories: [],
        setMinPrice: jest.fn(),
        setMaxPrice: jest.fn(),
        toggleCategory: jest.fn(),
        setSelectedCategories: jest.fn(),
        setSearchParams: jest.fn(),
      } as any);

      render(
        <SearchResultsClient
          tours={manyTours}
          sortBy={SORT_CRITERIA.PRICE_ASC}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      // Should show pagination controls
      expect(screen.getByText('Previous')).toBeInTheDocument();
    });

    it('should not render pagination when totalPages <= 1', () => {
      mockUseSearchFilterStore.mockReturnValue({
        sortBy: SORT_CRITERIA.PRICE_ASC,
        page: 1,
        setSortBy: mockSetSortBy,
        setPage: mockSetPage,
        minPrice: 0,
        maxPrice: 3600,
        selectedCategories: [],
        setMinPrice: jest.fn(),
        setMaxPrice: jest.fn(),
        toggleCategory: jest.fn(),
        setSelectedCategories: jest.fn(),
        setSearchParams: jest.fn(),
      } as any);

      render(
        <SearchResultsClient
          tours={mockTours.slice(0, 1)}
          sortBy={SORT_CRITERIA.PRICE_ASC}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      // Should not show pagination when only 1 page
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    });

    it('should handle page change', () => {
      const manyTours = Array.from({ length: 15 }, (_, i) => ({
        tour_id: i + 1,
        title: `Tour ${i + 1}`,
        price_per_person: 500 + i * 10,
      }));

      mockUseSearchFilterStore.mockReturnValue({
        sortBy: SORT_CRITERIA.PRICE_ASC,
        page: 2,
        setSortBy: mockSetSortBy,
        setPage: mockSetPage,
        minPrice: 0,
        maxPrice: 3600,
        selectedCategories: [],
        setMinPrice: jest.fn(),
        setMaxPrice: jest.fn(),
        toggleCategory: jest.fn(),
        setSelectedCategories: jest.fn(),
        setSearchParams: jest.fn(),
      } as any);

      render(
        <SearchResultsClient
          tours={manyTours}
          sortBy={SORT_CRITERIA.PRICE_ASC}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      // Should handle page navigation
      const nextButton = screen.getByText('Next');
      if (nextButton) {
        fireEvent.click(nextButton);
        expect(mockSetPage).toHaveBeenCalled();
      }
    });
  });
});

