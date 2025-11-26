import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import SearchSidebar from '../SearchSidebar';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';
import { useSearchFilterStore } from '@/app/lib/stores/searchFilterStore';

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

// Mock lucide-react
jest.mock('lucide-react', () => ({
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
  Sliders: () => <div data-testid="sliders-icon" />,
}));

const mockUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;
const mockUseNavigationLoading = useNavigationLoading as jest.MockedFunction<
  typeof useNavigationLoading
>;
const mockUseSearchFilterStore = useSearchFilterStore as jest.MockedFunction<
  typeof useSearchFilterStore
>;

describe('SearchSidebar Component', () => {
  const mockPush = jest.fn();
  const mockSetMinPrice = jest.fn();
  const mockSetMaxPrice = jest.fn();
  const mockToggleCategory = jest.fn();

  const mockDictionary = {
    homepage: {
      filterByPrice: 'Filter By Price',
      filterByCategories: 'Filter By Categories',
      applyFilters: 'Apply Filters',
    },
  } as any;

  const mockCategories = [
    { category_id: 1, name: 'Adventure' },
    { category_id: 2, name: 'Cultural' },
  ] as any;

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
      minPrice: 100,
      maxPrice: 3600,
      selectedCategories: [],
      setMinPrice: mockSetMinPrice,
      setMaxPrice: mockSetMaxPrice,
      toggleCategory: mockToggleCategory,
    } as any);
  });

  describe('Basic Rendering', () => {
    it('should render search sidebar', () => {
      const { container } = render(
        <SearchSidebar
          dictionary={mockDictionary}
          categories={mockCategories}
        />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render filter by price section', () => {
      render(
        <SearchSidebar
          dictionary={mockDictionary}
          categories={mockCategories}
        />
      );
      expect(screen.getByText('Filter By Price')).toBeInTheDocument();
    });

    it('should render filter by categories section', () => {
      render(
        <SearchSidebar
          dictionary={mockDictionary}
          categories={mockCategories}
        />
      );
      expect(screen.getByText('Filter By Categories')).toBeInTheDocument();
    });

    it('should render apply filters button', () => {
      render(
        <SearchSidebar
          dictionary={mockDictionary}
          categories={mockCategories}
        />
      );
      expect(screen.getByText('Apply Filters')).toBeInTheDocument();
    });
  });

  describe('Price Range', () => {
    it('should render price range inputs', () => {
      render(
        <SearchSidebar
          dictionary={mockDictionary}
          categories={mockCategories}
        />
      );
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should call setMinPrice when min price changes', () => {
      render(
        <SearchSidebar
          dictionary={mockDictionary}
          categories={mockCategories}
        />
      );
      const minInput = screen.getByDisplayValue('100');
      if (minInput) {
        fireEvent.change(minInput, { target: { value: '200' } });
        expect(mockSetMinPrice).toHaveBeenCalled();
      }
    });
  });

  describe('Category Selection', () => {
    it('should render all categories', () => {
      render(
        <SearchSidebar
          dictionary={mockDictionary}
          categories={mockCategories}
        />
      );
      expect(screen.getByText('Adventure')).toBeInTheDocument();
      expect(screen.getByText('Cultural')).toBeInTheDocument();
    });

    it('should call toggleCategory when category is clicked', () => {
      render(
        <SearchSidebar
          dictionary={mockDictionary}
          categories={mockCategories}
        />
      );
      const adventureCheckbox = screen.getByText('Adventure').closest('label');
      if (adventureCheckbox) {
        fireEvent.click(adventureCheckbox);
        expect(mockToggleCategory).toHaveBeenCalledWith(1);
      }
    });
  });

  describe('Apply Filters', () => {
    it('should call push with updated params when apply filters is clicked', () => {
      render(
        <SearchSidebar
          dictionary={mockDictionary}
          categories={mockCategories}
        />
      );
      const applyButton = screen.getByText('Apply Filters');
      fireEvent.click(applyButton);
      expect(mockPush).toHaveBeenCalled();
    });
  });
});

