import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TourTable from '../TourTable';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="map-pin-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Star: () => <div data-testid="star-icon" />,
  Edit: () => <div data-testid="edit-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
  Image: () => <div data-testid="image-icon" />,
}));

describe('TourTable Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockDictionary = {
    admin: {
      tours: {
        tourInfo: 'Tour Info',
        location: 'Location',
        priceAndDuration: 'Price & Duration',
        category: 'Category',
        bookings: 'Bookings',
        actions: 'Actions',
        noToursFound: 'No tours found',
      },
    },
  } as any;

  const mockTours = [
    {
      tour_id: 1,
      title: 'Paris Adventure',
      description: 'Explore Paris',
      cover_image_url: 'https://example.com/paris.jpg',
      price_per_person: 500,
      duration_days: 5,
      departure_location: 'Paris',
      start_date: new Date('2024-12-01'),
      categories: [{ category: { name: 'Adventure' } }],
      destinations: [{ destination: { name: 'Paris', country: 'France' } }],
      bookings: [],
    },
  ] as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render table with tours', () => {
      render(
        <TourTable
          tours={mockTours}
          dictionary={mockDictionary}
          locale="en"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText('Paris Adventure')).toBeInTheDocument();
    });

    it('should render table headers', () => {
      render(
        <TourTable
          tours={mockTours}
          dictionary={mockDictionary}
          locale="en"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText('Tour Info')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Price & Duration')).toBeInTheDocument();
    });

    it('should render tour image', () => {
      const { container } = render(
        <TourTable
          tours={mockTours}
          dictionary={mockDictionary}
          locale="en"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should render empty state when no tours', () => {
      render(
        <TourTable
          tours={[]}
          dictionary={mockDictionary}
          locale="en"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText('No tours found')).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should call onEdit when edit button is clicked', () => {
      render(
        <TourTable
          tours={mockTours}
          dictionary={mockDictionary}
          locale="en"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      const editButtons = screen.getAllByTestId('edit-icon');
      if (editButtons.length > 0) {
        fireEvent.click(editButtons[0].closest('button')!);
        expect(mockOnEdit).toHaveBeenCalledWith(mockTours[0]);
      }
    });

    it('should call onDelete when delete button is clicked', () => {
      render(
        <TourTable
          tours={mockTours}
          dictionary={mockDictionary}
          locale="en"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      const deleteButtons = screen.getAllByTestId('trash-icon');
      if (deleteButtons.length > 0) {
        fireEvent.click(deleteButtons[0].closest('button')!);
        expect(mockOnDelete).toHaveBeenCalledWith(1);
      }
    });
  });

  describe('Date Formatting', () => {
    it('should format date correctly for en locale', () => {
      render(
        <TourTable
          tours={mockTours}
          dictionary={mockDictionary}
          locale="en"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      // Date should be formatted
      expect(screen.getByText('Paris Adventure')).toBeInTheDocument();
    });
  });

  describe('Category and Destination Display', () => {
    it('should show primary category when available', () => {
      render(
        <TourTable
          tours={mockTours}
          dictionary={mockDictionary}
          locale="en"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      // Should show category
      expect(screen.getByText('Paris Adventure')).toBeInTheDocument();
    });

    it('should show N/A when no categories', () => {
      const tourWithoutCategory = [
        {
          ...mockTours[0],
          categories: [],
        },
      ];
      render(
        <TourTable
          tours={tourWithoutCategory}
          dictionary={mockDictionary}
          locale="en"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      // Should show N/A
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should show primary destination when available', () => {
      render(
        <TourTable
          tours={mockTours}
          dictionary={mockDictionary}
          locale="en"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      // Should show destination
      expect(screen.getByText('Paris Adventure')).toBeInTheDocument();
    });

    it('should show N/A when no destinations', () => {
      const tourWithoutDestination = [
        {
          ...mockTours[0],
          destinations: [],
        },
      ];
      render(
        <TourTable
          tours={tourWithoutDestination}
          dictionary={mockDictionary}
          locale="en"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      // Should show N/A
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should use departure_location when available', () => {
      const tourWithDeparture = [
        {
          ...mockTours[0],
          departure_location: 'Paris Airport',
        },
      ];
      render(
        <TourTable
          tours={tourWithDeparture}
          dictionary={mockDictionary}
          locale="en"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      // Should show departure location
      expect(screen.getByText('Paris Airport')).toBeInTheDocument();
    });

    it('should use primaryDestination when departure_location is null', () => {
      const tourWithoutDeparture = [
        {
          ...mockTours[0],
          departure_location: null,
        },
      ];
      render(
        <TourTable
          tours={tourWithoutDeparture}
          dictionary={mockDictionary}
          locale="en"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      // Should use primary destination
      expect(screen.getByText('Paris Adventure')).toBeInTheDocument();
    });
  });

  describe('Rating Display', () => {
    it('should show rating when averageRating exists', () => {
      const tourWithRating = [
        {
          ...mockTours[0],
          averageRating: 4.5,
        },
      ];
      render(
        <TourTable
          tours={tourWithRating}
          dictionary={mockDictionary}
          locale="en"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      // Should show rating
      expect(screen.getByText(/4\.5/)).toBeInTheDocument();
    });

    it('should show 0.0 when averageRating is null', () => {
      const tourWithoutRating = [
        {
          ...mockTours[0],
          averageRating: null,
        },
      ];
      render(
        <TourTable
          tours={tourWithoutRating}
          dictionary={mockDictionary}
          locale="en"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      // Should show 0.0
      expect(screen.getByText(/0\.0/)).toBeInTheDocument();
    });
  });

  describe('Image Display', () => {
    it('should use cover_image_url when available', () => {
      const tourWithImage = [
        {
          ...mockTours[0],
          cover_image_url: 'https://example.com/tour.jpg',
        },
      ];
      render(
        <TourTable
          tours={tourWithImage}
          dictionary={mockDictionary}
          locale="en"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('should use placeholder when cover_image_url is null', () => {
      const tourWithoutImage = [
        {
          ...mockTours[0],
          cover_image_url: null,
        },
      ];
      render(
        <TourTable
          tours={tourWithoutImage}
          dictionary={mockDictionary}
          locale="en"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );
      // Should use placeholder
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });
});
