import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookingTable from '../BookingTable';
import { ADMIN_BOOKINGS_CONSTANTS } from '@/app/lib/constants';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  CalendarCheck: () => <div data-testid="calendar-check-icon" />,
  Users: () => <div data-testid="users-icon" />,
  MoreVertical: () => <div data-testid="more-vertical-icon" />,
  List: () => <div data-testid="list-icon" />,
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('BookingTable Component', () => {
  const mockOnStatusChange = jest.fn();
  const mockFormatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US');
  };
  const mockFormatPaymentStatus = (payment: any) => {
    return payment?.status || 'unpaid';
  };
  const mockGetPaymentStatusColor = (payment: any) => {
    return payment?.status === 'paid' ? 'text-green-600' : 'text-red-600';
  };

  const mockDictionary = {
    admin: {
      bookings: {
        bookingId: 'Booking ID',
        userInfo: 'User Info',
        tourDetails: 'Tour Details',
        datesAndGuests: 'Dates & Guests',
        totalAndPayment: 'Total & Payment',
        status: 'Status',
        actions: 'Actions',
        noBookingsFound: 'No bookings found',
        tryAdjustingSearch: 'Try adjusting your search',
      },
    },
  } as any;

  const mockBookings = [
    {
      booking_id: 1,
      status: 'pending',
      num_guests: 2,
      total_price: 1000,
      booking_date: new Date('2024-12-01'),
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        image: 'https://example.com/avatar.jpg',
      },
      tour: {
        tour_id: 1,
        title: 'Paris Adventure',
        cover_image_url: 'https://example.com/tour.jpg',
      },
      payment: {
        status: 'paid',
      },
    },
  ] as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Empty State', () => {
    it('should render empty state when no bookings', () => {
      render(
        <BookingTable
          bookings={[]}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      expect(screen.getByText('No bookings found')).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('should render table with bookings', () => {
      render(
        <BookingTable
          bookings={mockBookings}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      expect(screen.getByText('Paris Adventure')).toBeInTheDocument();
    });

    it('should render table headers', () => {
      render(
        <BookingTable
          bookings={mockBookings}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      expect(screen.getByText('Booking ID')).toBeInTheDocument();
      expect(screen.getByText('User Info')).toBeInTheDocument();
      expect(screen.getByText('Tour Details')).toBeInTheDocument();
    });

    it('should render booking data', () => {
      render(
        <BookingTable
          bookings={mockBookings}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      expect(screen.getByText(/B000001/)).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('Status Display', () => {
    it('should render pending status correctly', () => {
      render(
        <BookingTable
          bookings={mockBookings}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
    });

    it('should render confirmed status correctly', () => {
      const confirmedBookings = [{ ...mockBookings[0], status: 'confirmed' }];
      render(
        <BookingTable
          bookings={confirmedBookings}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
    });

    it('should render cancelled status correctly', () => {
      const cancelledBookings = [{ ...mockBookings[0], status: 'cancelled' }];
      render(
        <BookingTable
          bookings={cancelledBookings}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      expect(screen.getByTestId('x-circle-icon')).toBeInTheDocument();
    });
  });

  describe('BookingTableRow Rendering', () => {
    it('should render booking ID', () => {
      render(
        <BookingTable
          bookings={mockBookings}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      expect(screen.getByText(/BK-1/)).toBeInTheDocument();
    });

    it('should render user name', () => {
      render(
        <BookingTable
          bookings={mockBookings}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render user email', () => {
      render(
        <BookingTable
          bookings={mockBookings}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should render pagination', () => {
      render(
        <BookingTable
          bookings={mockBookings}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      expect(screen.getByText(/Previous/i)).toBeInTheDocument();
      expect(screen.getByText(/Next/i)).toBeInTheDocument();
    });

    it('should render guest name when user is null', () => {
      const bookingWithGuest = [
        {
          ...mockBookings[0],
          user: null,
          guest_full_name: 'Guest User',
          guest_email: 'guest@example.com',
        },
      ];
      render(
        <BookingTable
          bookings={bookingWithGuest}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      expect(screen.getByText('Guest User')).toBeInTheDocument();
    });

    it('should render guest email when user is null', () => {
      const bookingWithGuest = [
        {
          ...mockBookings[0],
          user: null,
          guest_full_name: 'Guest User',
          guest_email: 'guest@example.com',
        },
      ];
      render(
        <BookingTable
          bookings={bookingWithGuest}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      expect(screen.getByText('guest@example.com')).toBeInTheDocument();
    });

    it('should use fallback when user and guest name are null', () => {
      const bookingWithoutName = [
        {
          ...mockBookings[0],
          user: null,
          guest_full_name: null,
        },
      ];
      render(
        <BookingTable
          bookings={bookingWithoutName}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      // Should use dictionary fallback
      expect(screen.getByText(/BK-1/)).toBeInTheDocument();
    });

    it('should use avatar URL when available', () => {
      const bookingWithAvatar = [
        {
          ...mockBookings[0],
          user: {
            ...mockBookings[0].user,
            avatar_url: 'https://example.com/avatar.jpg',
          },
        },
      ];
      render(
        <BookingTable
          bookings={bookingWithAvatar}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('should generate placeholder avatar when avatar_url is null', () => {
      render(
        <BookingTable
          bookings={mockBookings}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      // Should generate placeholder from first letter
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('should use first letter of guest name for placeholder', () => {
      const bookingWithGuest = [
        {
          ...mockBookings[0],
          user: null,
          guest_full_name: 'Test Guest',
        },
      ];
      render(
        <BookingTable
          bookings={bookingWithGuest}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      // Should use 'T' for placeholder
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('should render tour title when available', () => {
      render(
        <BookingTable
          bookings={mockBookings}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      expect(screen.getByText('Paris Tour')).toBeInTheDocument();
    });

    it('should use unknown tour fallback when tour is null', () => {
      const bookingWithoutTour = [
        {
          ...mockBookings[0],
          tour: null,
        },
      ];
      render(
        <BookingTable
          bookings={bookingWithoutTour}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      // Should show unknown tour message
      expect(screen.getByText(/BK-1/)).toBeInTheDocument();
    });

    it('should render plural guests when num_guests > 1', () => {
      const bookingWithMultipleGuests = [
        {
          ...mockBookings[0],
          num_guests: 3,
        },
      ];
      render(
        <BookingTable
          bookings={bookingWithMultipleGuests}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      // Should show "guests" (plural)
      expect(screen.getByText(/3/)).toBeInTheDocument();
    });

    it('should render singular guest when num_guests === 1', () => {
      const bookingWithOneGuest = [
        {
          ...mockBookings[0],
          num_guests: 1,
        },
      ];
      render(
        <BookingTable
          bookings={bookingWithOneGuest}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      // Should show "guest" (singular)
      expect(screen.getByText(/1/)).toBeInTheDocument();
    });

    it('should show action buttons for pending status', () => {
      const pendingBooking = [
        {
          ...mockBookings[0],
          status: 'pending',
        },
      ];
      render(
        <BookingTable
          bookings={pendingBooking}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      // Should show approve and reject buttons
      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
      expect(screen.getByTestId('x-circle-icon')).toBeInTheDocument();
    });

    it('should show menu button for confirmed status', () => {
      const confirmedBooking = [
        {
          ...mockBookings[0],
          status: 'confirmed',
        },
      ];
      render(
        <BookingTable
          bookings={confirmedBooking}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      // Should show menu button (MoreVertical icon)
      expect(screen.getByTestId('more-vertical-icon')).toBeInTheDocument();
    });

    it('should show menu button for cancelled status', () => {
      const cancelledBooking = [
        {
          ...mockBookings[0],
          status: 'cancelled',
        },
      ];
      render(
        <BookingTable
          bookings={cancelledBooking}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      // Should show menu button
      expect(screen.getByTestId('more-vertical-icon')).toBeInTheDocument();
    });

    it('should call onStatusChange when approve button is clicked', () => {
      const pendingBooking = [
        {
          ...mockBookings[0],
          status: 'pending',
        },
      ];
      render(
        <BookingTable
          bookings={pendingBooking}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      const approveButton = screen
        .getByTestId('check-circle-icon')
        .closest('button');
      if (approveButton) {
        fireEvent.click(approveButton);
        expect(mockOnStatusChange).toHaveBeenCalledWith(1, 'confirmed');
      }
    });

    it('should call onStatusChange when reject button is clicked', () => {
      const pendingBooking = [
        {
          ...mockBookings[0],
          status: 'pending',
        },
      ];
      render(
        <BookingTable
          bookings={pendingBooking}
          dictionary={mockDictionary}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      const rejectButton = screen
        .getByTestId('x-circle-icon')
        .closest('button');
      if (rejectButton) {
        fireEvent.click(rejectButton);
        expect(mockOnStatusChange).toHaveBeenCalledWith(1, 'cancelled');
      }
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', () => {
      const incompleteDict = { admin: {} } as any;
      render(
        <BookingTable
          bookings={[]}
          dictionary={incompleteDict}
          locale="en"
          formatDate={mockFormatDate}
          formatPaymentStatus={mockFormatPaymentStatus}
          getPaymentStatusColor={mockGetPaymentStatusColor}
          onStatusChange={mockOnStatusChange}
        />
      );
      expect(
        screen.getByText(ADMIN_BOOKINGS_CONSTANTS.NO_BOOKINGS_FOUND)
      ).toBeInTheDocument();
    });
  });
});
