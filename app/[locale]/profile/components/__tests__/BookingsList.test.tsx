import React from 'react';
import { render, screen } from '@testing-library/react';
import BookingsList from '../BookingsList';
import { USER_PROFILE_CONSTANTS } from '@/app/lib/constants';

// Mock BookingItem
jest.mock('../BookingItem', () => {
  return function MockBookingItem({ booking }: { booking: any }) {
    return <div data-testid="booking-item">Booking {booking.booking_id}</div>;
  };
});

describe('BookingsList Component', () => {
  const mockDictionary = {
    useProfile: {
      noBookings: 'No bookings found',
    },
  } as any;

  describe('Empty State', () => {
    it('should render empty state when no bookings', () => {
      render(
        <BookingsList
          bookings={[]}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('No bookings found')).toBeInTheDocument();
    });

    it('should use constant fallback for empty state', () => {
      const incompleteDict = { useProfile: {} } as any;
      render(
        <BookingsList bookings={[]} dictionary={incompleteDict} locale="en" />
      );
      expect(
        screen.getByText(USER_PROFILE_CONSTANTS.NO_BOOKINGS)
      ).toBeInTheDocument();
    });
  });

  describe('With Bookings', () => {
    const mockBookings = [
      { booking_id: 1, tour: { title: 'Tour 1' } },
      { booking_id: 2, tour: { title: 'Tour 2' } },
    ] as any;

    it('should render all booking items', () => {
      render(
        <BookingsList
          bookings={mockBookings}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      const bookingItems = screen.getAllByTestId('booking-item');
      expect(bookingItems.length).toBe(2);
    });

    it('should render booking items in correct order', () => {
      render(
        <BookingsList
          bookings={mockBookings}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('Booking 1')).toBeInTheDocument();
      expect(screen.getByText('Booking 2')).toBeInTheDocument();
    });
  });
});

