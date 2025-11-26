import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminHeader from '../AdminHeader';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon" />,
  Search: () => <div data-testid="search-icon" />,
  Bell: () => <div data-testid="bell-icon" />,
}));

describe('AdminHeader Component', () => {
  const mockOnSearchChange = jest.fn();
  const mockDictionary = {
    admin: {
      bookings: {
        bookingRequests: 'Booking Requests',
        searchPlaceholder: 'Search bookings...',
      },
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render header', () => {
      const { container } = render(
        <AdminHeader
          dictionary={mockDictionary}
          searchTerm=""
          onSearchChange={mockOnSearchChange}
        />
      );
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should render title', () => {
      render(
        <AdminHeader
          dictionary={mockDictionary}
          searchTerm=""
          onSearchChange={mockOnSearchChange}
        />
      );
      expect(screen.getByText('Booking Requests')).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(
        <AdminHeader
          dictionary={mockDictionary}
          searchTerm=""
          onSearchChange={mockOnSearchChange}
        />
      );
      expect(
        screen.getByPlaceholderText('Search bookings...')
      ).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should call onSearchChange when input value changes', () => {
      render(
        <AdminHeader
          dictionary={mockDictionary}
          searchTerm=""
          onSearchChange={mockOnSearchChange}
        />
      );
      const input = screen.getByPlaceholderText('Search bookings...');
      fireEvent.change(input, { target: { value: 'test' } });
      expect(mockOnSearchChange).toHaveBeenCalledWith('test');
    });

    it('should display search term', () => {
      render(
        <AdminHeader
          dictionary={mockDictionary}
          searchTerm="test search"
          onSearchChange={mockOnSearchChange}
        />
      );
      const input = screen.getByPlaceholderText('Search bookings...');
      expect(input).toHaveValue('test search');
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', () => {
      const incompleteDict = { admin: {} } as any;
      render(<AdminHeader dictionary={incompleteDict} />);
      // Should still render header
      const { container } = render(
        <AdminHeader dictionary={incompleteDict} />
      );
      expect(container.querySelector('header')).toBeInTheDocument();
    });
  });
});

