import React from 'react';
import { render, screen } from '@testing-library/react';
import TourDetailContent from '../TourDetailContent';
import { getDictionary } from '@/app/lib/get-dictionary';
import { getTourById } from '@/app/lib/services/tourService.server';
import { notFound } from 'next/navigation';

// Mock services
jest.mock('@/app/lib/get-dictionary', () => ({
  getDictionary: jest.fn(),
}));

jest.mock('@/app/lib/services/tourService.server', () => ({
  getTourById: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

// Mock child components
jest.mock('../TourDetailTabs', () => {
  return function MockTourDetailTabs() {
    return <div data-testid="tour-detail-tabs">Tour Detail Tabs</div>;
  };
});

jest.mock('../BookingForm', () => {
  return function MockBookingForm() {
    return <div data-testid="booking-form">Booking Form</div>;
  };
});

const mockGetDictionary = getDictionary as jest.MockedFunction<
  typeof getDictionary
>;
const mockGetTourById = getTourById as jest.MockedFunction<typeof getTourById>;
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;

describe('TourDetailContent Component', () => {
  const mockTour = {
    tour_id: 1,
    title: 'Paris Adventure',
  } as any;

  const mockDictionary = {} as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDictionary.mockResolvedValue(mockDictionary);
    mockGetTourById.mockResolvedValue(mockTour);
  });

  describe('Basic Rendering', () => {
    it('should render tour detail content', async () => {
      const component = await TourDetailContent({
        locale: 'en',
        tourId: 1,
      });
      const { container } = render(component);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render tour detail tabs', async () => {
      const component = await TourDetailContent({
        locale: 'en',
        tourId: 1,
      });
      render(component);
      expect(screen.getByTestId('tour-detail-tabs')).toBeInTheDocument();
    });

    it('should render booking form', async () => {
      const component = await TourDetailContent({
        locale: 'en',
        tourId: 1,
      });
      render(component);
      expect(screen.getByTestId('booking-form')).toBeInTheDocument();
    });
  });

  describe('Tour Not Found', () => {
    it('should call notFound when tour is null', async () => {
      mockGetTourById.mockResolvedValue(null);
      await TourDetailContent({
        locale: 'en',
        tourId: 999,
      });
      expect(mockNotFound).toHaveBeenCalled();
    });
  });

  describe('Locale Handling', () => {
    it('should use correct locale for dictionary', async () => {
      await TourDetailContent({
        locale: 'vi',
        tourId: 1,
      });
      expect(mockGetDictionary).toHaveBeenCalledWith('vi');
    });
  });
});

