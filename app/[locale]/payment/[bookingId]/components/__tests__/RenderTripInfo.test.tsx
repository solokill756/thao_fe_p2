import React from 'react';
import { render, screen } from '@testing-library/react';
import RenderTripInfo from '../RenderTripInfo';
import { PAYMENT_CONSTANTS } from '@/app/lib/constants';

describe('RenderTripInfo Component', () => {
  const mockBooking = {
    booking_id: 1,
    num_guests: 2,
    booking_date: new Date('2024-12-01'),
    tour: {
      tour_id: 1,
      title: 'Paris Adventure',
      duration_days: 5,
      start_date: new Date('2024-12-01'),
    },
  } as any;

  const mockFormatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const mockDictionary = {
    payment: {
      yourTrip: 'Your Trip',
      dates: 'Dates',
      day: 'day',
      days: 'days',
      guest: 'Guest',
      guests: 'Guests',
    },
    useProfile: {
      guests: 'Guests',
    },
  } as any;

  describe('Basic Rendering', () => {
    it('should render trip info', () => {
      const { container } = render(
        <RenderTripInfo
          booking={mockBooking}
          locale="en"
          dictionary={mockDictionary}
          formatDate={mockFormatDate}
        />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render trip title', () => {
      render(
        <RenderTripInfo
          booking={mockBooking}
          locale="en"
          dictionary={mockDictionary}
          formatDate={mockFormatDate}
        />
      );
      expect(screen.getByText('Your Trip')).toBeInTheDocument();
    });

    it('should render dates', () => {
      render(
        <RenderTripInfo
          booking={mockBooking}
          locale="en"
          dictionary={mockDictionary}
          formatDate={mockFormatDate}
        />
      );
      expect(screen.getByText('Dates')).toBeInTheDocument();
    });

    it('should render guests count', () => {
      render(
        <RenderTripInfo
          booking={mockBooking}
          locale="en"
          dictionary={mockDictionary}
          formatDate={mockFormatDate}
        />
      );
      expect(screen.getByText('Guests')).toBeInTheDocument();
      expect(screen.getByText('2 Guests')).toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    it('should use tour start_date when available', () => {
      render(
        <RenderTripInfo
          booking={mockBooking}
          locale="en"
          dictionary={mockDictionary}
          formatDate={mockFormatDate}
        />
      );
      expect(screen.getByText(/December 1, 2024/)).toBeInTheDocument();
    });

    it('should use booking_date when tour start_date is not available', () => {
      const bookingWithoutStartDate = {
        ...mockBooking,
        tour: {
          ...mockBooking.tour,
          start_date: null,
        },
      };
      render(
        <RenderTripInfo
          booking={bookingWithoutStartDate}
          locale="en"
          dictionary={mockDictionary}
          formatDate={mockFormatDate}
        />
      );
      expect(screen.getByText(/December 1, 2024/)).toBeInTheDocument();
    });
  });

  describe('Duration Display', () => {
    it('should display duration correctly', () => {
      render(
        <RenderTripInfo
          booking={mockBooking}
          locale="en"
          dictionary={mockDictionary}
          formatDate={mockFormatDate}
        />
      );
      expect(screen.getByText(/5 days/)).toBeInTheDocument();
    });

    it('should use singular form for 1 day', () => {
      const bookingWithOneDay = {
        ...mockBooking,
        tour: {
          ...mockBooking.tour,
          duration_days: 1,
        },
      };
      render(
        <RenderTripInfo
          booking={bookingWithOneDay}
          locale="en"
          dictionary={mockDictionary}
          formatDate={mockFormatDate}
        />
      );
      expect(screen.getByText(/1 day/)).toBeInTheDocument();
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', () => {
      const incompleteDict = { payment: {}, useProfile: {} } as any;
      render(
        <RenderTripInfo
          booking={mockBooking}
          locale="en"
          dictionary={incompleteDict}
          formatDate={mockFormatDate}
        />
      );
      expect(
        screen.getByText(PAYMENT_CONSTANTS.YOUR_TRIP)
      ).toBeInTheDocument();
    });
  });
});

