import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TourCard from '../TourCard';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';
import { SEARCH_TOURS_CONSTANTS } from '@/app/lib/constants';

// Mock useNavigationLoading
jest.mock('@/app/lib/hooks/useNavigationLoading', () => ({
  useNavigationLoading: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>;
  };
});

// Mock lucide-react
jest.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="map-pin-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Star: () => <div data-testid="star-icon" />,
}));

const mockUseNavigationLoading = useNavigationLoading as jest.MockedFunction<
  typeof useNavigationLoading
>;

describe('TourCard Component', () => {
  const mockPush = jest.fn();
  const mockTour = {
    tour_id: 1,
    title: 'Paris Adventure',
    description: 'Explore the beautiful city of Paris',
    cover_image_url: 'https://example.com/paris.jpg',
    price_per_person: 500,
    duration_days: 5,
    max_guests: 10,
    averageRating: 4.5,
    destinations: [
      {
        destination: {
          name: 'Paris',
          country: 'France',
        },
      },
    ],
  } as any;

  const mockDictionary = {
    homepage: {
      unknownDestination: 'Unknown',
    },
    trendingPackages: {
      bookNow: 'Book Now',
    },
  } as any;

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

  describe('Basic Rendering', () => {
    it('should render tour card', () => {
      const { container } = render(
        <TourCard tour={mockTour} locale="en" dictionary={mockDictionary} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render tour title', () => {
      render(
        <TourCard tour={mockTour} locale="en" dictionary={mockDictionary} />
      );
      expect(screen.getByText('Paris Adventure')).toBeInTheDocument();
    });

    it('should render tour description', () => {
      render(
        <TourCard tour={mockTour} locale="en" dictionary={mockDictionary} />
      );
      expect(
        screen.getByText('Explore the beautiful city of Paris')
      ).toBeInTheDocument();
    });

    it('should render tour image', () => {
      const { container } = render(
        <TourCard tour={mockTour} locale="en" dictionary={mockDictionary} />
      );
      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/paris.jpg');
    });

    it('should render tour rating', () => {
      render(
        <TourCard tour={mockTour} locale="en" dictionary={mockDictionary} />
      );
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });

    it('should render tour price', () => {
      render(
        <TourCard tour={mockTour} locale="en" dictionary={mockDictionary} />
      );
      expect(screen.getByText(/\$500/)).toBeInTheDocument();
    });
  });

  describe('Destination Display', () => {
    it('should render destination name', () => {
      render(
        <TourCard tour={mockTour} locale="en" dictionary={mockDictionary} />
      );
      expect(screen.getByText('Paris')).toBeInTheDocument();
    });

    it('should use unknown destination when no destinations', () => {
      const tourWithoutDestinations = {
        ...mockTour,
        destinations: [],
      };
      render(
        <TourCard
          tour={tourWithoutDestinations}
          locale="en"
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to tour details when title is clicked', () => {
      render(
        <TourCard tour={mockTour} locale="en" dictionary={mockDictionary} />
      );
      const titleLink = screen.getByText('Paris Adventure').closest('a');
      expect(titleLink).toHaveAttribute('href', '/en/tours/1');
    });
  });

  describe('Styling', () => {
    it('should have correct card classes', () => {
      const { container } = render(
        <TourCard tour={mockTour} locale="en" dictionary={mockDictionary} />
      );
      const card = container.firstChild;
      expect(card).toHaveClass('bg-white', 'rounded-xl', 'shadow-lg');
    });
  });
});

