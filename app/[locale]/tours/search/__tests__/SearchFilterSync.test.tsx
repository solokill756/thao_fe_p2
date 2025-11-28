import React from 'react';
import { render } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import SearchFilterSync from '../SearchFilterSync';
import { useSearchFilterStore } from '@/app/lib/stores/searchFilterStore';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

// Mock store
jest.mock('@/app/lib/stores/searchFilterStore', () => ({
  useSearchFilterStore: jest.fn(),
}));

const mockUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;
const mockUseSearchFilterStore = useSearchFilterStore as jest.MockedFunction<
  typeof useSearchFilterStore
>;

describe('SearchFilterSync Component', () => {
  const mockSetMinPrice = jest.fn();
  const mockSetMaxPrice = jest.fn();
  const mockSetSelectedCategories = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue({
      get: jest.fn((key: string) => {
        if (key === 'minPrice') return '100';
        if (key === 'maxPrice') return '1000';
        if (key === 'categories') return '1,2';
        return null;
      }),
      toString: () => '',
    } as any);

    mockUseSearchFilterStore.mockReturnValue({
      minPrice: 0,
      maxPrice: 3600,
      selectedCategories: [],
      setMinPrice: mockSetMinPrice,
      setMaxPrice: mockSetMaxPrice,
      setSelectedCategories: mockSetSelectedCategories,
      toggleCategory: jest.fn(),
    } as any);
  });

  describe('Sync with URL Params', () => {
    it('should sync min price from URL params', () => {
      render(<SearchFilterSync />);
      expect(mockSetMinPrice).toHaveBeenCalledWith(100);
    });

    it('should sync max price from URL params', () => {
      render(<SearchFilterSync />);
      expect(mockSetMaxPrice).toHaveBeenCalledWith(1000);
    });

    it('should sync categories from URL params', () => {
      render(<SearchFilterSync />);
      expect(mockSetSelectedCategories).toHaveBeenCalledWith([1, 2]);
    });
  });

  describe('No URL Params', () => {
    it('should not sync when no URL params', () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn(() => null),
        toString: () => '',
      } as any);

      render(<SearchFilterSync />);
      // Should not call set functions when no params
      expect(mockSetMinPrice).not.toHaveBeenCalled();
    });
  });
});

