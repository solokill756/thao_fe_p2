import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewSummary from '../ReviewSummary';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('ReviewSummary Component', () => {
  const mockBooking = {
    booking_id: 1,
    tour_id: 1,
    tour_title: 'Paris Adventure',
    tour_cover_image_url: 'https://example.com/tour.jpg',
    start_date: new Date('2024-12-01'),
    duration_days: 5,
    booking_date: new Date('2024-11-01'),
    num_guests: 2,
    total_price: 1000,
  };

  const mockDictionary = {
    useProfile: {
      bookingId: 'Booking ID',
      guests: 'Guests',
    },
    tourDetail: {
      departureDate: 'Start date',
      duration: 'Duration',
      days: 'days',
    },
  } as any;

  describe('Basic Rendering', () => {
    it('should render tour title', () => {
      render(
        <ReviewSummary
          booking={mockBooking as any}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('Paris Adventure')).toBeInTheDocument();
    });

    it('should render tour image', () => {
      const { container } = render(
        <ReviewSummary
          booking={mockBooking as any}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/tour.jpg');
    });

    it('should render booking ID', () => {
      render(
        <ReviewSummary
          booking={mockBooking as any}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText(/B000001/)).toBeInTheDocument();
    });

    it('should render booking details', () => {
      render(
        <ReviewSummary
          booking={mockBooking as any}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have correct container classes', () => {
      const { container } = render(
        <ReviewSummary tour={mockTour as any} booking={mockBooking as any} />
      );
      const card = container.querySelector('.bg-white');
      expect(card).toBeInTheDocument();
    });
  });
});

