import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderSummary from '../OrderSummary';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  AlertCircle: () => <div data-testid="alert-icon" />,
}));

describe('OrderSummary Component', () => {
  const mockBooking = {
    booking_id: 1,
    tour: {
      tour_id: 1,
      title: 'Paris Adventure',
      cover_image_url: 'https://example.com/tour.jpg',
    },
    departure_date: new Date('2024-12-01'),
    num_guests: 2,
  } as any;

  const mockFormatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const mockDictionary = {
    payment: {
      tourPackage: 'Tour Package',
      yourTrip: 'Your Trip',
      dates: 'Dates',
      priceDetails: 'Price Details',
      taxesFees: 'Taxes & Fees',
      total: 'Total',
    },
  } as any;

  describe('Basic Rendering', () => {
    it('should render order summary', () => {
      const { container } = render(
        <OrderSummary
          booking={mockBooking}
          subtotal={1000}
          taxes={100}
          total={1100}
          locale="en"
          dictionary={mockDictionary}
          formatCurrency={mockFormatCurrency}
        />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render tour title', () => {
      render(
        <OrderSummary
          booking={mockBooking}
          subtotal={1000}
          taxes={100}
          total={1100}
          locale="en"
          dictionary={mockDictionary}
          formatCurrency={mockFormatCurrency}
        />
      );
      expect(screen.getByText('Paris Adventure')).toBeInTheDocument();
    });

    it('should render tour image', () => {
      const { container } = render(
        <OrderSummary
          booking={mockBooking}
          subtotal={1000}
          taxes={100}
          total={1100}
          locale="en"
          dictionary={mockDictionary}
          formatCurrency={mockFormatCurrency}
        />
      );
      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/tour.jpg');
    });

    it('should render price details', () => {
      render(
        <OrderSummary
          booking={mockBooking}
          subtotal={1000}
          taxes={100}
          total={1100}
          locale="en"
          dictionary={mockDictionary}
          formatCurrency={mockFormatCurrency}
        />
      );
      expect(screen.getByText('$1100.00')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have correct container classes', () => {
      const { container } = render(
        <OrderSummary
          booking={mockBooking}
          subtotal={1000}
          taxes={100}
          total={1100}
          locale="en"
          dictionary={mockDictionary}
          formatCurrency={mockFormatCurrency}
        />
      );
      const summary = container.firstChild;
      expect(summary).toHaveClass('bg-white', 'rounded-xl', 'shadow-lg');
    });
  });
});

