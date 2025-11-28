import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TourDetailTabs from '../TourDetailTabs';
import { TAB_IDS } from '@/app/lib/constants';

// Mock child components
jest.mock('../TourPlan', () => {
  return function MockTourPlan() {
    return <div data-testid="tour-plan">Tour Plan</div>;
  };
});

jest.mock('../GoogleMap', () => {
  return function MockGoogleMap() {
    return <div data-testid="google-map">Google Map</div>;
  };
});

jest.mock('../TourReviews', () => {
  return function MockTourReviews() {
    return <div data-testid="tour-reviews">Tour Reviews</div>;
  };
});

// Mock lucide-react
jest.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="map-pin-icon" />,
  Star: () => <div data-testid="star-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Users: () => <div data-testid="users-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
}));

describe('TourDetailTabs Component', () => {
  const mockTour = {
    tour_id: 1,
    title: 'Paris Adventure',
    description: 'Explore Paris',
    duration_days: 5,
    max_guests: 10,
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
    what_included: ['Hotel', 'Breakfast'],
    what_not_included: ['Lunch'],
    plans: [],
    gallery: [],
    reviews: [],
  } as any;

  const mockDictionary = {
    tourDetail: {
      aboutTheTour: 'About the Tour',
      duration: 'Duration',
      destination: 'Destination',
      rating: 'Rating',
      maxGuests: 'Max Guests',
      whatsIncluded: "What's Included",
      whatsNotIncluded: "What's Not Included",
      tourPlan: 'Tour Plan',
      locationDetails: 'Location Details',
      gallery: 'Gallery',
      reviewsHeading: 'Guest Reviews',
    },
  } as any;

  describe('Basic Rendering', () => {
    it('should render tour detail tabs', () => {
      const { container } = render(
        <TourDetailTabs
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render tab buttons', () => {
      render(
        <TourDetailTabs
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('About the Tour')).toBeInTheDocument();
    });

    it('should render information tab content by default', () => {
      render(
        <TourDetailTabs
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('Paris Adventure')).toBeInTheDocument();
    });
  });

  describe('Tab Switching', () => {
    it('should switch to tour plan tab when clicked', () => {
      render(
        <TourDetailTabs
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      const tourPlanTab = screen.getByText('Tour Plan');
      fireEvent.click(tourPlanTab);
      expect(screen.getByTestId('tour-plan')).toBeInTheDocument();
    });

    it('should switch to location tab when clicked', () => {
      render(
        <TourDetailTabs
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      const locationTab = screen.getByText('Location');
      fireEvent.click(locationTab);
      expect(screen.getByText('Location Details')).toBeInTheDocument();
    });

    it('should switch to gallery tab when clicked', () => {
      render(
        <TourDetailTabs
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      const galleryTab = screen.getByText('Gallery');
      fireEvent.click(galleryTab);
      expect(screen.getByText('Gallery')).toBeInTheDocument();
    });

    it('should switch to reviews tab when clicked', () => {
      render(
        <TourDetailTabs
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      const reviewsTab = screen.getByText('Reviews');
      fireEvent.click(reviewsTab);
      expect(screen.getByTestId('tour-reviews')).toBeInTheDocument();
    });
  });

  describe('Information Tab Content', () => {
    it('should render tour description', () => {
      render(
        <TourDetailTabs
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('Explore Paris')).toBeInTheDocument();
    });

    it('should render tour details', () => {
      render(
        <TourDetailTabs
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText(/5 Days/)).toBeInTheDocument();
      expect(screen.getByText(/Max Guests: 10/)).toBeInTheDocument();
    });

    it('should render what included list', () => {
      render(
        <TourDetailTabs
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('Hotel')).toBeInTheDocument();
      expect(screen.getByText('Breakfast')).toBeInTheDocument();
    });

    it('should render what not included list', () => {
      render(
        <TourDetailTabs
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('Lunch')).toBeInTheDocument();
    });

    it('should not render what not included when empty', () => {
      const tourWithoutNotIncluded = {
        ...mockTour,
        what_not_included: [],
      };
      render(
        <TourDetailTabs
          tour={tourWithoutNotIncluded}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      // Should not show "What's Not Included" section
      expect(screen.queryByText("What's Not Included")).not.toBeInTheDocument();
    });

    it('should handle what_included as non-array', () => {
      const tourWithStringIncluded = {
        ...mockTour,
        what_included: 'Hotel, Breakfast',
      };
      render(
        <TourDetailTabs
          tour={tourWithStringIncluded}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      // Should handle gracefully
      expect(screen.getByText('Paris Adventure')).toBeInTheDocument();
    });
  });

  describe('Gallery Tab', () => {
    it('should render gallery images when available', () => {
      const tourWithGallery = {
        ...mockTour,
        gallery: [
          { image_id: 1, image_url: 'https://example.com/img1.jpg', caption: 'Image 1' },
          { image_id: 2, image_url: 'https://example.com/img2.jpg', caption: null },
        ],
      };
      render(
        <TourDetailTabs
          tour={tourWithGallery}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      const galleryTab = screen.getByText('Gallery');
      fireEvent.click(galleryTab);
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('should render empty gallery message when no images', () => {
      render(
        <TourDetailTabs
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      const galleryTab = screen.getByText('Gallery');
      fireEvent.click(galleryTab);
      // Should show empty message
      expect(screen.getByText(/no.*gallery|gallery.*empty/i)).toBeInTheDocument();
    });

    it('should handle null gallery', () => {
      const tourWithNullGallery = {
        ...mockTour,
        gallery: null,
      };
      render(
        <TourDetailTabs
          tour={tourWithNullGallery}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      const galleryTab = screen.getByText('Gallery');
      fireEvent.click(galleryTab);
      // Should handle null gracefully
    });
  });

  describe('Duration Display', () => {
    it('should use singular form for 1 day', () => {
      const tourWithOneDay = {
        ...mockTour,
        duration_days: 1,
      };
      render(
        <TourDetailTabs
          tour={tourWithOneDay}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText(/1 Day|Day 1/i)).toBeInTheDocument();
    });

    it('should use plural form for multiple days', () => {
      render(
        <TourDetailTabs
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText(/5 Days|Days 5/i)).toBeInTheDocument();
    });
  });

  describe('Destination Display', () => {
    it('should handle multiple destinations', () => {
      const tourWithMultipleDestinations = {
        ...mockTour,
        destinations: [
          { destination: { name: 'Paris', country: 'France' } },
          { destination: { name: 'London', country: 'UK' } },
        ],
      };
      render(
        <TourDetailTabs
          tour={tourWithMultipleDestinations}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText(/Paris|London/)).toBeInTheDocument();
    });

    it('should handle no destinations', () => {
      const tourWithoutDestinations = {
        ...mockTour,
        destinations: [],
      };
      render(
        <TourDetailTabs
          tour={tourWithoutDestinations}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      // Should handle gracefully
      expect(screen.getByText('Paris Adventure')).toBeInTheDocument();
    });
  });
});

