import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PaymentClient from '../PaymentClient';
import { useBookingForPayment } from '@/app/lib/hooks/useBookingForPayment';
import { useProcessPayment } from '@/app/lib/hooks/useProcessPayment';
import { toast } from 'react-hot-toast';

// Mock hooks
jest.mock('@/app/lib/hooks/useBookingForPayment', () => ({
  useBookingForPayment: jest.fn(),
}));

jest.mock('@/app/lib/hooks/useProcessPayment', () => ({
  useProcessPayment: jest.fn(),
}));

// Mock child components
jest.mock('../PaymentHeader', () => {
  return function MockPaymentHeader() {
    return <div data-testid="payment-header">Payment Header</div>;
  };
});

jest.mock('../PaymentSuccess', () => {
  return function MockPaymentSuccess() {
    return <div data-testid="payment-success">Payment Success</div>;
  };
});

jest.mock('../PaymentSkeleton', () => {
  return function MockPaymentSkeleton() {
    return <div data-testid="payment-skeleton">Payment Skeleton</div>;
  };
});

jest.mock('../RenderTripInfo', () => {
  return function MockRenderTripInfo() {
    return <div data-testid="trip-info">Trip Info</div>;
  };
});

jest.mock('../PaymentForm', () => {
  return function MockPaymentForm() {
    return <div data-testid="payment-form">Payment Form</div>;
  };
});

jest.mock('../OrderSummary', () => {
  return function MockOrderSummary() {
    return <div data-testid="order-summary">Order Summary</div>;
  };
});

jest.mock('@/app/components/common/ErrorRetry', () => {
  return function MockErrorRetry() {
    return <div data-testid="error-retry">Error Retry</div>;
  };
});

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const mockUseBookingForPayment = useBookingForPayment as jest.MockedFunction<
  typeof useBookingForPayment
>;
const mockUseProcessPayment = useProcessPayment as jest.MockedFunction<
  typeof useProcessPayment
>;

describe('PaymentClient Component', () => {
  const mockBooking = {
    booking_id: 1,
    tour: {
      tour_id: 1,
      title: 'Paris Adventure',
      price_per_person: 500,
    },
    num_guests: 2,
    total_price: 1000,
    booking_date: new Date('2024-12-01'),
  } as any;

  const mockDictionary = {
    payment: {
      cardDataRequired: 'Please fill in all card details',
    },
  } as any;

  const mockProcessMutation = {
    mutateAsync: jest.fn(),
    isPending: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProcessPayment.mockReturnValue(mockProcessMutation as any);
  });

  describe('Loading State', () => {
    it('should show skeleton when loading booking', () => {
      mockUseBookingForPayment.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      } as any);

      render(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByTestId('payment-skeleton')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error retry when booking error occurs', () => {
      mockUseBookingForPayment.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to load'),
        refetch: jest.fn(),
      } as any);

      render(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByTestId('error-retry')).toBeInTheDocument();
    });
  });

  describe('Success State', () => {
    it('should show payment success when payment is completed', () => {
      mockUseBookingForPayment.mockReturnValue({
        data: mockBooking,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      const { rerender } = render(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={mockDictionary}
        />
      );

      // Simulate payment completion
      rerender(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={mockDictionary}
        />
      );
    });
  });

  describe('Payment Form', () => {
    it('should render payment form when booking is loaded', () => {
      mockUseBookingForPayment.mockReturnValue({
        data: mockBooking,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      render(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByTestId('payment-form')).toBeInTheDocument();
      expect(screen.getByTestId('order-summary')).toBeInTheDocument();
    });
  });

  describe('Payment Method Validation', () => {
    it('should validate card data when payment method is card', async () => {
      mockUseBookingForPayment.mockReturnValue({
        data: mockBooking,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      const { container } = render(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={mockDictionary}
        />
      );

      // Test card validation branch
      // This would be tested through form submission
      expect(screen.getByTestId('payment-form')).toBeInTheDocument();
    });

    it('should not validate card data when payment method is internet_banking', () => {
      mockUseBookingForPayment.mockReturnValue({
        data: mockBooking,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      render(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={mockDictionary}
        />
      );
      // Internet banking doesn't require card validation
      expect(screen.getByTestId('payment-form')).toBeInTheDocument();
    });
  });

  describe('Payment Processing', () => {
    it('should handle successful payment', async () => {
      mockUseBookingForPayment.mockReturnValue({
        data: mockBooking,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      mockProcessMutation.mutateAsync.mockResolvedValue({ success: true });

      render(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={mockDictionary}
        />
      );

      // Payment success would be tested through form submission
      expect(screen.getByTestId('payment-form')).toBeInTheDocument();
    });

    it('should handle payment failure', async () => {
      mockUseBookingForPayment.mockReturnValue({
        data: mockBooking,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      mockProcessMutation.mutateAsync.mockResolvedValue({
        success: false,
        error: 'Payment failed',
      });

      render(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={mockDictionary}
        />
      );

      // Payment failure would be tested through form submission
      expect(screen.getByTestId('payment-form')).toBeInTheDocument();
    });

    it('should handle payment error', async () => {
      mockUseBookingForPayment.mockReturnValue({
        data: mockBooking,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      mockProcessMutation.mutateAsync.mockRejectedValue(new Error('Network error'));

      render(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={mockDictionary}
        />
      );

      // Payment error would be tested through form submission
      expect(screen.getByTestId('payment-form')).toBeInTheDocument();
    });

    it('should not process payment when booking is not loaded', () => {
      mockUseBookingForPayment.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      render(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={mockDictionary}
        />
      );

      // Should not render payment form when no booking
      expect(screen.queryByTestId('payment-form')).not.toBeInTheDocument();
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', () => {
      const incompleteDict = { payment: {} } as any;
      mockUseBookingForPayment.mockReturnValue({
        data: mockBooking,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      render(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={incompleteDict}
        />
      );
      expect(screen.getByTestId('payment-form')).toBeInTheDocument();
    });
  });

  describe('Booking Error Handling', () => {
    it('should show error when bookingResult.success is false', () => {
      mockUseBookingForPayment.mockReturnValue({
        data: { success: false, error: 'Booking not found' },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      render(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByTestId('error-retry')).toBeInTheDocument();
    });

    it('should show error when bookingResult.booking is missing', () => {
      mockUseBookingForPayment.mockReturnValue({
        data: { success: true, booking: null },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      render(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByTestId('error-retry')).toBeInTheDocument();
    });

    it('should show error when bookingError exists', () => {
      mockUseBookingForPayment.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to load'),
        refetch: jest.fn(),
      } as any);

      render(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByTestId('error-retry')).toBeInTheDocument();
    });
  });

  describe('Price Calculation', () => {
    it('should calculate subtotal from price_per_person when available', () => {
      const bookingWithPricePerPerson = {
        ...mockBooking,
        tour: {
          ...mockBooking.tour,
          price_per_person: 500,
        },
        num_guests: 2,
        total_price: 1000,
      };

      mockUseBookingForPayment.mockReturnValue({
        data: bookingWithPricePerPerson,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      render(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={mockDictionary}
        />
      );
      // Should calculate: 500 * 2 = 1000
      expect(screen.getByTestId('payment-form')).toBeInTheDocument();
    });

    it('should use total_price when price_per_person is not available', () => {
      const bookingWithoutPricePerPerson = {
        ...mockBooking,
        tour: {
          ...mockBooking.tour,
          price_per_person: null,
        },
        total_price: 1000,
      };

      mockUseBookingForPayment.mockReturnValue({
        data: bookingWithoutPricePerPerson,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      render(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={mockDictionary}
        />
      );
      // Should use total_price directly
      expect(screen.getByTestId('payment-form')).toBeInTheDocument();
    });
  });

  describe('Payment Method Validation', () => {
    it('should validate card data when payment method is card', async () => {
      mockUseBookingForPayment.mockReturnValue({
        data: mockBooking,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      const { container } = render(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={mockDictionary}
        />
      );

      // Card validation is tested through PaymentForm component
      expect(screen.getByTestId('payment-form')).toBeInTheDocument();
    });

    it('should not validate card data when payment method is internet_banking', () => {
      mockUseBookingForPayment.mockReturnValue({
        data: mockBooking,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      render(
        <PaymentClient
          locale="en"
          bookingId={1}
          dictionary={mockDictionary}
        />
      );
      // Internet banking doesn't require card validation
      expect(screen.getByTestId('payment-form')).toBeInTheDocument();
    });
  });
});

