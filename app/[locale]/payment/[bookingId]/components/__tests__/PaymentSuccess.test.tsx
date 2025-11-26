import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import PaymentSuccess from '../PaymentSuccess';
import { PAYMENT_CONSTANTS } from '@/app/lib/constants';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  CheckCircle: () => <div data-testid="check-circle-icon" />,
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('PaymentSuccess Component', () => {
  const mockPush = jest.fn();
  const mockDictionary = {
    payment: {
      paymentSuccessful: 'Payment Successful!',
      paymentSuccessMessage:
        'Thank you for your booking. Your tour has been confirmed.',
      goToMyBookings: 'Go to My Bookings',
      backToHome: 'Back to Home',
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    } as any);
  });

  describe('Basic Rendering', () => {
    it('should render payment success message', () => {
      render(
        <PaymentSuccess locale="en" dictionary={mockDictionary} />
      );
      expect(screen.getByText('Payment Successful!')).toBeInTheDocument();
    });

    it('should render success icon', () => {
      render(
        <PaymentSuccess locale="en" dictionary={mockDictionary} />
      );
      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
    });

    it('should render success message', () => {
      render(
        <PaymentSuccess locale="en" dictionary={mockDictionary} />
      );
      expect(
        screen.getByText(
          'Thank you for your booking. Your tour has been confirmed.'
        )
      ).toBeInTheDocument();
    });

    it('should render navigation buttons', () => {
      render(
        <PaymentSuccess locale="en" dictionary={mockDictionary} />
      );
      expect(screen.getByText('Go to My Bookings')).toBeInTheDocument();
      expect(screen.getByText('Back to Home')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to profile when go to bookings button is clicked', () => {
      render(
        <PaymentSuccess locale="en" dictionary={mockDictionary} />
      );
      const bookingsButton = screen.getByText('Go to My Bookings');
      fireEvent.click(bookingsButton);
      expect(mockPush).toHaveBeenCalledWith('/en/profile');
    });

    it('should navigate to home when back to home button is clicked', () => {
      render(
        <PaymentSuccess locale="en" dictionary={mockDictionary} />
      );
      const homeButton = screen.getByText('Back to Home');
      fireEvent.click(homeButton);
      expect(mockPush).toHaveBeenCalledWith('/en/');
    });

    it('should use correct locale in navigation', () => {
      render(
        <PaymentSuccess locale="vi" dictionary={mockDictionary} />
      );
      const bookingsButton = screen.getByText('Go to My Bookings');
      fireEvent.click(bookingsButton);
      expect(mockPush).toHaveBeenCalledWith('/vi/profile');
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', () => {
      const incompleteDict = { payment: {} } as any;
      render(
        <PaymentSuccess locale="en" dictionary={incompleteDict} />
      );
      expect(
        screen.getByText(PAYMENT_CONSTANTS.PAYMENT_SUCCESSFUL)
      ).toBeInTheDocument();
      expect(
        screen.getByText(PAYMENT_CONSTANTS.GO_TO_MY_BOOKINGS)
      ).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have correct container classes', () => {
      const { container } = render(
        <PaymentSuccess locale="en" dictionary={mockDictionary} />
      );
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass(
        'min-h-screen',
        'bg-gray-50',
        'flex',
        'flex-col',
        'items-center',
        'justify-center'
      );
    });
  });
});

