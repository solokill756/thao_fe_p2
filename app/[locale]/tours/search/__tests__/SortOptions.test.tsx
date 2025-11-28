import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SortOptions from '../SortOptions';
import { HERO_SECTION_CONSTANTS, SORT_CRITERIA } from '@/app/lib/constants';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  ArrowUp: () => <div data-testid="arrow-up-icon" />,
  ArrowDown: () => <div data-testid="arrow-down-icon" />,
}));

describe('SortOptions Component', () => {
  const mockOnSort = jest.fn();
  const mockDictionary = {
    homepage: {
      sortBy: 'Sort By',
      priceLow: 'Price (Low)',
      priceHigh: 'Price (High)',
      nameAZ: 'Name (A-Z)',
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render sort options', () => {
      render(
        <SortOptions
          sortBy={SORT_CRITERIA.PRICE_ASC}
          onSort={mockOnSort}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText('Sort By')).toBeInTheDocument();
    });

    it('should render all sort buttons', () => {
      render(
        <SortOptions
          sortBy={SORT_CRITERIA.PRICE_ASC}
          onSort={mockOnSort}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText('Price (Low)')).toBeInTheDocument();
      expect(screen.getByText('Price (High)')).toBeInTheDocument();
      expect(screen.getByText('Name (A-Z)')).toBeInTheDocument();
    });
  });

  describe('Sort Button Selection', () => {
    it('should highlight active sort option', () => {
      render(
        <SortOptions
          sortBy={SORT_CRITERIA.PRICE_ASC}
          onSort={mockOnSort}
          dictionary={mockDictionary}
        />
      );
      const priceLowButton = screen.getByText('Price (Low)').closest('button');
      expect(priceLowButton).toHaveClass('bg-blue-600', 'text-white');
    });

    it('should call onSort when sort button is clicked', () => {
      render(
        <SortOptions
          sortBy={SORT_CRITERIA.PRICE_ASC}
          onSort={mockOnSort}
          dictionary={mockDictionary}
        />
      );
      const priceHighButton = screen.getByText('Price (High)').closest('button');
      fireEvent.click(priceHighButton!);
      expect(mockOnSort).toHaveBeenCalledWith(SORT_CRITERIA.PRICE_DESC);
    });
  });

  describe('Icons', () => {
    it('should render arrow up icon for ascending sorts', () => {
      render(
        <SortOptions
          sortBy={SORT_CRITERIA.PRICE_ASC}
          onSort={mockOnSort}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByTestId('arrow-up-icon')).toBeInTheDocument();
    });

    it('should render arrow down icon for descending sorts', () => {
      render(
        <SortOptions
          sortBy={SORT_CRITERIA.PRICE_DESC}
          onSort={mockOnSort}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByTestId('arrow-down-icon')).toBeInTheDocument();
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', () => {
      const incompleteDict = { homepage: {} } as any;
      render(
        <SortOptions
          sortBy={SORT_CRITERIA.PRICE_ASC}
          onSort={mockOnSort}
          dictionary={incompleteDict}
        />
      );
      expect(
        screen.getByText(HERO_SECTION_CONSTANTS.SORT_BY)
      ).toBeInTheDocument();
      expect(
        screen.getByText(HERO_SECTION_CONSTANTS.PRICE_LOW)
      ).toBeInTheDocument();
    });
  });
});

