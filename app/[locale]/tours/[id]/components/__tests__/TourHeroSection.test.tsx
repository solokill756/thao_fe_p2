import React from 'react';
import { render, screen } from '@testing-library/react';
import TourHeroSection from '../TourHeroSection';
import { getTourById } from '@/app/lib/services/tourService.server';
import { getDictionary } from '@/app/lib/get-dictionary';

// Mock getTourById
jest.mock('@/app/lib/services/tourService.server', () => ({
  getTourById: jest.fn(),
}));

// Mock getDictionary
jest.mock('@/app/lib/get-dictionary', () => ({
  getDictionary: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="map-pin-icon" />,
  Star: () => <div data-testid="star-icon" />,
}));

const mockGetTourById = getTourById as jest.MockedFunction<typeof getTourById>;
const mockGetDictionary = getDictionary as jest.MockedFunction<
  typeof getDictionary
>;

describe('TourHeroSection Component', () => {
  const mockTour = {
    tour_id: 1,
    title: 'Paris Adventure',
    cover_image_url: 'https://example.com/paris.jpg',
    averageRating: 4.5,
    _count: {
      reviews: 10,
    },
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
    tourDetail: {
      reviews: 'reviews',
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetTourById.mockResolvedValue(mockTour);
    mockGetDictionary.mockResolvedValue(mockDictionary as any);
  });

  describe('Basic Rendering', () => {
    it('should render tour hero section', async () => {
      const component = await TourHeroSection({
        locale: 'en',
        tourId: 1,
      });
      const { container } = render(component);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render tour title', async () => {
      const component = await TourHeroSection({
        locale: 'en',
        tourId: 1,
      });
      render(component);
      expect(screen.getByText('Paris Adventure')).toBeInTheDocument();
    });

    it('should render tour rating', async () => {
      const component = await TourHeroSection({
        locale: 'en',
        tourId: 1,
      });
      render(component);
      expect(screen.getByText('4.5')).toBeInTheDocument();
      expect(screen.getByText('10 reviews')).toBeInTheDocument();
    });

    it('should render destinations', async () => {
      const component = await TourHeroSection({
        locale: 'en',
        tourId: 1,
      });
      render(component);
      expect(screen.getByText('Paris')).toBeInTheDocument();
    });
  });

  describe('Image Rendering', () => {
    it('should render tour image when available', async () => {
      const component = await TourHeroSection({
        locale: 'en',
        tourId: 1,
      });
      const { container } = render(component);
      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/paris.jpg');
    });

    it('should render placeholder when image is not available', async () => {
      const tourWithoutImage = { ...mockTour, cover_image_url: null };
      mockGetTourById.mockResolvedValue(tourWithoutImage);

      const component = await TourHeroSection({
        locale: 'en',
        tourId: 1,
      });
      const { container } = render(component);
      const placeholder = container.querySelector('.bg-linear-to-r');
      expect(placeholder).toBeInTheDocument();
    });
  });
});

