import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TourBookingButton from '../../common/TourBookingButton';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';
import { TRENDING_PACKAGES_SECTION_CONSTANTS } from '@/app/lib/constants';

// Mock useNavigationLoading hook
jest.mock('@/app/lib/hooks/useNavigationLoading', () => ({
  useNavigationLoading: jest.fn(),
}));

const mockUseNavigationLoading = useNavigationLoading as jest.MockedFunction<
  typeof useNavigationLoading
>;

describe('TourBookingButton Component', () => {
  const mockPush = jest.fn();
  const mockDictionary = {
    trendingPackages: {
      bookNow: 'Book Now',
      comingSoon: 'Coming Soon',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigationLoading.mockReturnValue({
      isPending: false,
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  describe('Coming Soon State', () => {
    it('should show coming soon message when startDate is in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);

      render(
        <TourBookingButton
          tourId={1}
          startDate={futureDate}
          locale="en"
          dictionary={mockDictionary as any}
        />
      );

      expect(screen.getByText('Coming Soon')).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should use dictionary comingSoon text', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);

      render(
        <TourBookingButton
          tourId={1}
          startDate={futureDate}
          locale="en"
          dictionary={mockDictionary as any}
        />
      );

      expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    });

    it('should use constant fallback when dictionary comingSoon is missing', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      const incompleteDict = { trendingPackages: {} };

      render(
        <TourBookingButton
          tourId={1}
          startDate={futureDate}
          locale="en"
          dictionary={incompleteDict as any}
        />
      );

      expect(
        screen.getByText(TRENDING_PACKAGES_SECTION_CONSTANTS.COMING_SOON)
      ).toBeInTheDocument();
    });
  });

  describe('Available Booking State', () => {
    it('should render button when startDate is in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);

      render(
        <TourBookingButton
          tourId={1}
          startDate={pastDate}
          locale="en"
          dictionary={mockDictionary as any}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Book Now');
    });

    it('should render button when startDate is null', () => {
      render(
        <TourBookingButton
          tourId={1}
          startDate={null}
          locale="en"
          dictionary={mockDictionary as any}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should render button when startDate is today', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      render(
        <TourBookingButton
          tourId={1}
          startDate={today}
          locale="en"
          dictionary={mockDictionary as any}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Button Click Handler', () => {
    it('should navigate to tour details page on click', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);

      render(
        <TourBookingButton
          tourId={123}
          startDate={pastDate}
          locale="en"
          dictionary={mockDictionary as any}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockPush).toHaveBeenCalledWith('/en/tours/123');
    });

    it('should use correct locale in navigation path', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);

      render(
        <TourBookingButton
          tourId={456}
          startDate={pastDate}
          locale="vi"
          dictionary={mockDictionary as any}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockPush).toHaveBeenCalledWith('/vi/tours/456');
    });
  });

  describe('Pending State', () => {
    it('should disable button and show loading text when navigation is pending', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);

      mockUseNavigationLoading.mockReturnValue({
        isPending: true,
        push: mockPush,
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn(),
      });

      render(
        <TourBookingButton
          tourId={1}
          startDate={pastDate}
          locale="en"
          dictionary={mockDictionary as any}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Book Now...');
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should use dictionary bookNow text with ellipsis when pending', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);

      mockUseNavigationLoading.mockReturnValue({
        isPending: true,
        push: mockPush,
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn(),
      });

      render(
        <TourBookingButton
          tourId={1}
          startDate={pastDate}
          locale="en"
          dictionary={mockDictionary as any}
        />
      );

      expect(screen.getByText('Book Now...')).toBeInTheDocument();
    });

    it('should use constant fallback when dictionary bookNow is missing and pending', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);
      const incompleteDict = { trendingPackages: {} };

      mockUseNavigationLoading.mockReturnValue({
        isPending: true,
        push: mockPush,
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn(),
      });

      render(
        <TourBookingButton
          tourId={1}
          startDate={pastDate}
          locale="en"
          dictionary={incompleteDict as any}
        />
      );

      expect(
        screen.getByText(`${TRENDING_PACKAGES_SECTION_CONSTANTS.BOOK_NOW}...`)
      ).toBeInTheDocument();
    });
  });

  describe('Button Styling', () => {
    it('should have correct styling classes', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);

      render(
        <TourBookingButton
          tourId={1}
          startDate={pastDate}
          locale="en"
          dictionary={mockDictionary as any}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'bg-orange-500',
        'hover:bg-orange-600',
        'text-white',
        'rounded-lg'
      );
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constant fallback when dictionary bookNow is missing', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);
      const incompleteDict = { trendingPackages: {} };

      render(
        <TourBookingButton
          tourId={1}
          startDate={pastDate}
          locale="en"
          dictionary={incompleteDict as any}
        />
      );

      expect(
        screen.getByText(TRENDING_PACKAGES_SECTION_CONSTANTS.BOOK_NOW)
      ).toBeInTheDocument();
    });
  });
});
