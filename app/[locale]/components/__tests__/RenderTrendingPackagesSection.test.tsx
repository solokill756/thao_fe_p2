import React from 'react';
import { render, screen } from '@testing-library/react';
import RenderTrendingPackagesSection from '../RenderTrendingPackagesSection';
import { TRENDING_PACKAGES_SECTION_CONSTANTS } from '@/app/lib/constants';

// Mock getTrendingTours
jest.mock('@/app/lib/services/tourService.server', () => ({
  getTrendingTours: jest.fn(),
}));

// Mock TourBookingButton
jest.mock('@/app/components/common/TourBookingButton', () => {
  return function MockTourBookingButton({ tourId }: { tourId: number }) {
    return <button>Book Tour {tourId}</button>;
  };
});

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaStar: () => <div data-testid="star-icon" />,
}));

const { getTrendingTours } = require('@/app/lib/services/tourService.server');

describe('RenderTrendingPackagesSection Component', () => {
  const mockDictionary = {
    trendingPackages: {
      promotion: 'PROMOTION',
      title: 'Our Trending Tour Packages',
      noTrendingTours: 'No trending tours available',
    },
  } as any;

  const mockTrendingTours = [
    {
      tour_id: 1,
      title: 'Paris Adventure',
      description: 'Explore the beautiful city of Paris',
      cover_image_url: 'https://example.com/paris.jpg',
      price_per_person: 500,
      averageRating: 4.5,
      start_date: new Date('2024-12-01'),
    },
    {
      tour_id: 2,
      title: 'Tokyo Discovery',
      description: 'Discover the wonders of Tokyo',
      cover_image_url: 'https://example.com/tokyo.jpg',
      price_per_person: 600,
      averageRating: 4.8,
      start_date: new Date('2024-12-15'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    getTrendingTours.mockResolvedValue(mockTrendingTours);
  });

  describe('Basic Rendering', () => {
    it('should render trending packages section', async () => {
      const component = await RenderTrendingPackagesSection({
        dictionary: mockDictionary,
        locale: 'en',
      });
      const { container } = render(component);
      const section = container.querySelector('section#packages');
      expect(section).toBeInTheDocument();
    });

    it('should render promotion label', async () => {
      const component = await RenderTrendingPackagesSection({
        dictionary: mockDictionary,
        locale: 'en',
      });
      render(component);
      expect(screen.getByText('PROMOTION')).toBeInTheDocument();
    });

    it('should render title', async () => {
      const component = await RenderTrendingPackagesSection({
        dictionary: mockDictionary,
        locale: 'en',
      });
      render(component);
      expect(
        screen.getByText('Our Trending Tour Packages')
      ).toBeInTheDocument();
    });
  });

  describe('When Tours Are Available', () => {
    it('should render all trending tours', async () => {
      const component = await RenderTrendingPackagesSection({
        dictionary: mockDictionary,
        locale: 'en',
      });
      render(component);
      expect(screen.getByText('Paris Adventure')).toBeInTheDocument();
      expect(screen.getByText('Tokyo Discovery')).toBeInTheDocument();
    });

    it('should render tour descriptions', async () => {
      const component = await RenderTrendingPackagesSection({
        dictionary: mockDictionary,
        locale: 'en',
      });
      render(component);
      expect(
        screen.getByText('Explore the beautiful city of Paris')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Discover the wonders of Tokyo')
      ).toBeInTheDocument();
    });

    it('should render tour prices', async () => {
      const component = await RenderTrendingPackagesSection({
        dictionary: mockDictionary,
        locale: 'en',
      });
      render(component);
      expect(screen.getByText('$500')).toBeInTheDocument();
      expect(screen.getByText('$600')).toBeInTheDocument();
    });

    it('should render tour ratings', async () => {
      const component = await RenderTrendingPackagesSection({
        dictionary: mockDictionary,
        locale: 'en',
      });
      render(component);
      expect(screen.getByText('4.5')).toBeInTheDocument();
      expect(screen.getByText('4.8')).toBeInTheDocument();
    });

    it('should render tour images', async () => {
      const component = await RenderTrendingPackagesSection({
        dictionary: mockDictionary,
        locale: 'en',
      });
      const { container } = render(component);
      const images = container.querySelectorAll('img');
      expect(images.length).toBe(2);
      expect(images[0]).toHaveAttribute('src', 'https://example.com/paris.jpg');
      expect(images[1]).toHaveAttribute('src', 'https://example.com/tokyo.jpg');
    });

    it('should render booking buttons', async () => {
      const component = await RenderTrendingPackagesSection({
        dictionary: mockDictionary,
        locale: 'en',
      });
      render(component);
      expect(screen.getByText('Book Tour 1')).toBeInTheDocument();
      expect(screen.getByText('Book Tour 2')).toBeInTheDocument();
    });

    it('should render star icons for ratings', async () => {
      const component = await RenderTrendingPackagesSection({
        dictionary: mockDictionary,
        locale: 'en',
      });
      render(component);
      const starIcons = screen.getAllByTestId('star-icon');
      expect(starIcons.length).toBe(2);
    });
  });

  describe('When No Tours Available', () => {
    it('should render empty state message', async () => {
      getTrendingTours.mockResolvedValue([]);
      const component = await RenderTrendingPackagesSection({
        dictionary: mockDictionary,
        locale: 'en',
      });
      render(component);
      expect(
        screen.getByText('No trending tours available')
      ).toBeInTheDocument();
    });

    it('should use constant fallback for empty state', async () => {
      getTrendingTours.mockResolvedValue([]);
      const incompleteDict = { trendingPackages: {} } as any;
      const component = await RenderTrendingPackagesSection({
        dictionary: incompleteDict,
        locale: 'en',
      });
      render(component);
      expect(
        screen.getByText(TRENDING_PACKAGES_SECTION_CONSTANTS.NO_TRENDING_TOURS)
      ).toBeInTheDocument();
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', async () => {
      const incompleteDict = { trendingPackages: {} } as any;
      const component = await RenderTrendingPackagesSection({
        dictionary: incompleteDict,
        locale: 'en',
      });
      render(component);
      expect(
        screen.getByText(TRENDING_PACKAGES_SECTION_CONSTANTS.PROMOTION)
      ).toBeInTheDocument();
      expect(
        screen.getByText(TRENDING_PACKAGES_SECTION_CONSTANTS.DEFAULT_TITLE)
      ).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have correct section classes', async () => {
      const component = await RenderTrendingPackagesSection({
        dictionary: mockDictionary,
        locale: 'en',
      });
      const { container } = render(component);
      const section = container.querySelector('section#packages');
      expect(section).toHaveClass('py-20', 'bg-gray-50');
    });

    it('should render tours in grid layout', async () => {
      const component = await RenderTrendingPackagesSection({
        dictionary: mockDictionary,
        locale: 'en',
      });
      const { container } = render(component);
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass(
        'grid-cols-1',
        'md:grid-cols-2',
        'lg:grid-cols-4'
      );
    });
  });

  describe('Tour Card Structure', () => {
    it('should render tour cards with correct structure', async () => {
      const component = await RenderTrendingPackagesSection({
        dictionary: mockDictionary,
        locale: 'en',
      });
      const { container } = render(component);
      const tourCards = container.querySelectorAll('.bg-white.rounded-xl');
      expect(tourCards.length).toBe(2);
    });

    it('should render price badge', async () => {
      const component = await RenderTrendingPackagesSection({
        dictionary: mockDictionary,
        locale: 'en',
      });
      const { container } = render(component);
      const priceBadges = container.querySelectorAll('.bg-blue-600');
      expect(priceBadges.length).toBe(2);
    });
  });
});
