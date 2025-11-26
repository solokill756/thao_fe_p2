import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RecentBookingsTable from '../RecentBookingsTable';
import type { BookingWithRelations } from '@/app/actions/admin/getBookingsAction';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('RecentBookingsTable Component', () => {
  const mockDictionary = {
    admin: {
      bookings: {
        bookingId: 'Booking ID',
        userInfo: 'Customer',
        tourDetails: 'Tour Package',
        status: 'Status',
      },
      dashboard: {
        latestBookings: 'Latest Bookings',
        viewAllBookings: 'View All Bookings',
        noRecentBookings: 'No recent bookings',
      },
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-12-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Empty State', () => {
    it('should render empty state message when bookings array is empty', () => {
      render(
        <RecentBookingsTable
          bookings={[]}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText('No recent bookings')).toBeInTheDocument();
    });

    it('should show empty state with correct colspan', () => {
      const { container } = render(
        <RecentBookingsTable
          bookings={[]}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      const emptyCell = container.querySelector('td[colspan="6"]');
      expect(emptyCell).toBeInTheDocument();
    });
  });

  describe('Date Formatting - Edge Cases', () => {
    it('should return N/A for null date', () => {
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: null,
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should format date string correctly', () => {
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: '2024-12-15T11:30:00Z',
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      // Should format relative time
      expect(screen.getByText(/ago/i)).toBeInTheDocument();
    });

    it('should format Date object correctly', () => {
      const recentDate = new Date(Date.now() - 30 * 60000); // 30 minutes ago
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: recentDate,
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText(/mins ago/i)).toBeInTheDocument();
    });
  });

  describe('Date Formatting - Relative Time', () => {
    it('should show "Just now" for dates less than 1 minute ago', () => {
      const recentDate = new Date(Date.now() - 30 * 1000); // 30 seconds ago
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: recentDate,
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText('Just now')).toBeInTheDocument();
    });

    it('should show "X min ago" for dates less than 60 minutes', () => {
      const recentDate = new Date(Date.now() - 30 * 60000); // 30 minutes ago
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: recentDate,
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText(/30 mins ago/i)).toBeInTheDocument();
    });

    it('should show "1 min ago" (singular) for 1 minute ago', () => {
      const recentDate = new Date(Date.now() - 1 * 60000); // 1 minute ago
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: recentDate,
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText(/1 min ago/i)).toBeInTheDocument();
    });

    it('should show "X hours ago" for dates less than 24 hours', () => {
      const recentDate = new Date(Date.now() - 5 * 3600000); // 5 hours ago
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: recentDate,
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText(/5 hours ago/i)).toBeInTheDocument();
    });

    it('should show "1 hour ago" (singular) for 1 hour ago', () => {
      const recentDate = new Date(Date.now() - 1 * 3600000); // 1 hour ago
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: recentDate,
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText(/1 hour ago/i)).toBeInTheDocument();
    });

    it('should show "X days ago" for dates less than 7 days', () => {
      const recentDate = new Date(Date.now() - 3 * 86400000); // 3 days ago
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: recentDate,
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText(/3 days ago/i)).toBeInTheDocument();
    });

    it('should show "1 day ago" (singular) for 1 day ago', () => {
      const recentDate = new Date(Date.now() - 1 * 86400000); // 1 day ago
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: recentDate,
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText(/1 day ago/i)).toBeInTheDocument();
    });

    it('should show formatted date for dates older than 7 days', () => {
      const oldDate = new Date(Date.now() - 10 * 86400000); // 10 days ago
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: oldDate,
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      // Should show formatted date, not relative time with "ago"
      // Date will be formatted, so we just check it doesn't show relative time format
      const timeCell = screen.getByText(/\d+\/\d+\/\d+/);
      expect(timeCell).toBeInTheDocument();
    });
  });

  describe('Status Color Logic', () => {
    it('should apply green color for confirmed status', () => {
      const bookings = [
        {
          booking_id: 1,
          status: 'confirmed',
          total_price: 100,
          created_at: new Date(),
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      const statusBadge = screen.getByText('Confirmed');
      expect(statusBadge).toHaveClass('bg-green-50', 'text-green-700');
    });

    it('should apply red color for cancelled status', () => {
      const bookings = [
        {
          booking_id: 1,
          status: 'cancelled',
          total_price: 100,
          created_at: new Date(),
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      const statusBadge = screen.getByText('Cancelled');
      expect(statusBadge).toHaveClass('bg-red-50', 'text-red-700');
    });

    it('should apply yellow color for pending status (default)', () => {
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: new Date(),
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      const statusBadge = screen.getByText('Pending');
      expect(statusBadge).toHaveClass('bg-yellow-50', 'text-yellow-700');
    });

    it('should apply yellow color for unknown status', () => {
      const bookings = [
        {
          booking_id: 1,
          status: 'unknown',
          total_price: 100,
          created_at: new Date(),
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      const statusBadge = screen.getByText('Unknown');
      expect(statusBadge).toHaveClass('bg-yellow-50', 'text-yellow-700');
    });
  });

  describe('User Information Display', () => {
    it('should display user full_name when available', () => {
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: new Date(),
          user: { full_name: 'John Doe' },
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should display guest_full_name when user is null', () => {
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: new Date(),
          user: null,
          guest_full_name: 'Guest User',
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText('Guest User')).toBeInTheDocument();
    });

    it('should display "Guest" when both user and guest_full_name are null', () => {
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: new Date(),
          user: null,
          guest_full_name: null,
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText('Guest')).toBeInTheDocument();
    });
  });

  describe('Tour Information Display', () => {
    it('should display tour title when available', () => {
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: new Date(),
          tour: { title: 'Paris Tour' },
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText('Paris Tour')).toBeInTheDocument();
    });

    it('should display "Unknown Tour" when tour is null', () => {
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: new Date(),
          tour: null,
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText('Unknown Tour')).toBeInTheDocument();
    });
  });

  describe('Currency Formatting', () => {
    it('should format currency correctly', () => {
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 1234.56,
          created_at: new Date(),
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText('$1,235')).toBeInTheDocument();
    });

    it('should format large currency values', () => {
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 1234567.89,
          created_at: new Date(),
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText('$1,234,568')).toBeInTheDocument();
    });
  });

  describe('Router Navigation', () => {
    it('should navigate to bookings page when "View All" button is clicked', () => {
      render(
        <RecentBookingsTable
          bookings={[]}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      const viewAllButton = screen.getByText('View All Bookings');
      fireEvent.click(viewAllButton);
      expect(mockPush).toHaveBeenCalledWith('/en/admin/bookings');
    });

    it('should navigate to bookings page when row is clicked', () => {
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: new Date(),
        } as any,
      ];

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="vi"
          dictionary={mockDictionary}
        />
      );
      const row = screen.getByText('#1').closest('tr');
      fireEvent.click(row!);
      expect(mockPush).toHaveBeenCalledWith('/vi/admin/bookings');
    });

    it('should use correct locale in navigation', () => {
      render(
        <RecentBookingsTable
          bookings={[]}
          locale="vi"
          dictionary={mockDictionary}
        />
      );
      const viewAllButton = screen.getByText('View All Bookings');
      fireEvent.click(viewAllButton);
      expect(mockPush).toHaveBeenCalledWith('/vi/admin/bookings');
    });
  });

  describe('Multiple Bookings', () => {
    it('should render multiple bookings correctly', () => {
      const bookings = [
        {
          booking_id: 1,
          status: 'pending',
          total_price: 100,
          created_at: new Date(),
          user: { full_name: 'John Doe' },
          tour: { title: 'Tour 1' },
        },
        {
          booking_id: 2,
          status: 'confirmed',
          total_price: 200,
          created_at: new Date(),
          user: { full_name: 'Jane Smith' },
          tour: { title: 'Tour 2' },
        },
      ] as any;

      render(
        <RecentBookingsTable
          bookings={bookings}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Tour 1')).toBeInTheDocument();
      expect(screen.getByText('Tour 2')).toBeInTheDocument();
    });
  });
});

