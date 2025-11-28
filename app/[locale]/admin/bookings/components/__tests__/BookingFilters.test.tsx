import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookingFilters from '../BookingFilters';
import { ADMIN_BOOKINGS_CONSTANTS } from '@/app/lib/constants';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Filter: () => <div data-testid="filter-icon" />,
  ArrowUpRight: () => <div data-testid="arrow-up-right-icon" />,
}));

describe('BookingFilters Component', () => {
  const mockOnFilterChange = jest.fn();
  const mockDictionary = {
    admin: {
      bookings: {
        all: 'All',
        pending: 'Pending',
        confirmed: 'Confirmed',
        cancelled: 'Cancelled',
        filter: 'Filter',
        export: 'Export',
      },
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render all filter options', () => {
      render(
        <BookingFilters
          dictionary={mockDictionary}
          filterStatus="All"
          onFilterChange={mockOnFilterChange}
        />
      );
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Confirmed')).toBeInTheDocument();
      expect(screen.getByText('Cancelled')).toBeInTheDocument();
    });

    it('should render filter and export buttons', () => {
      render(
        <BookingFilters
          dictionary={mockDictionary}
          filterStatus="All"
          onFilterChange={mockOnFilterChange}
        />
      );
      expect(screen.getByText('Filter')).toBeInTheDocument();
      expect(screen.getByText('Export')).toBeInTheDocument();
    });
  });

  describe('Filter Selection', () => {
    it('should highlight active filter (All)', () => {
      render(
        <BookingFilters
          dictionary={mockDictionary}
          filterStatus="All"
          onFilterChange={mockOnFilterChange}
        />
      );
      const allButton = screen.getByText('All').closest('button');
      expect(allButton).toHaveClass('bg-blue-600', 'text-white');
    });

    it('should highlight active filter (pending)', () => {
      render(
        <BookingFilters
          dictionary={mockDictionary}
          filterStatus="pending"
          onFilterChange={mockOnFilterChange}
        />
      );
      const pendingButton = screen.getByText('Pending').closest('button');
      expect(pendingButton).toHaveClass('bg-blue-600', 'text-white');
    });

    it('should call onFilterChange when filter is clicked', () => {
      render(
        <BookingFilters
          dictionary={mockDictionary}
          filterStatus="All"
          onFilterChange={mockOnFilterChange}
        />
      );
      const pendingButton = screen.getByText('Pending').closest('button');
      fireEvent.click(pendingButton!);
      expect(mockOnFilterChange).toHaveBeenCalledWith('pending');
    });

    it('should call onFilterChange with correct status for each filter', () => {
      render(
        <BookingFilters
          dictionary={mockDictionary}
          filterStatus="All"
          onFilterChange={mockOnFilterChange}
        />
      );

      fireEvent.click(screen.getByText('Confirmed').closest('button')!);
      expect(mockOnFilterChange).toHaveBeenCalledWith('confirmed');

      fireEvent.click(screen.getByText('Cancelled').closest('button')!);
      expect(mockOnFilterChange).toHaveBeenCalledWith('cancelled');

      fireEvent.click(screen.getByText('All').closest('button')!);
      expect(mockOnFilterChange).toHaveBeenCalledWith('All');
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', () => {
      const incompleteDict = { admin: {} } as any;
      render(
        <BookingFilters
          dictionary={incompleteDict}
          filterStatus="All"
          onFilterChange={mockOnFilterChange}
        />
      );
      expect(
        screen.getByText(ADMIN_BOOKINGS_CONSTANTS.ALL)
      ).toBeInTheDocument();
      expect(
        screen.getByText(ADMIN_BOOKINGS_CONSTANTS.FILTER)
      ).toBeInTheDocument();
    });
  });
});

