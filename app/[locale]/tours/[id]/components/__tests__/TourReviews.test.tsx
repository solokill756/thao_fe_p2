import React from 'react';
import { render, screen } from '@testing-library/react';
import TourReviews from '../TourReviews';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Star: () => <div data-testid="star-icon" />,
}));

describe('TourReviews Component', () => {
  const mockTour = {
    tour_id: 1,
    title: 'Paris Adventure',
    averageRating: 4.5,
    _count: {
      reviews: 10,
    },
    ratingBreakdown: {
      5: 5,
      4: 3,
      3: 1,
      2: 1,
      1: 0,
    },
    reviews: [
      {
        review_id: 1,
        rating: 5,
        comment: 'Great tour!',
        created_at: new Date('2024-01-01'),
        user: {
          name: 'John Doe',
          image: 'https://example.com/avatar.jpg',
        },
      },
      {
        review_id: 2,
        rating: 4,
        comment: 'Nice experience',
        created_at: new Date('2024-01-02'),
        user: {
          name: 'Jane Smith',
          image: null,
        },
      },
    ],
  } as any;

  const mockDictionary = {
    tourDetail: {
      reviewsHeading: 'Guest Reviews',
      noReviewsYet: 'No reviews yet',
      beFirstToReview: 'Be the first to review',
      averageRating: 'Average Rating',
      totalReviews: 'Total Reviews',
    },
  } as any;

  describe('Basic Rendering', () => {
    it('should render tour reviews', () => {
      const { container } = render(
        <TourReviews
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render reviews heading', () => {
      render(
        <TourReviews
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('Guest Reviews')).toBeInTheDocument();
    });

    it('should render average rating', () => {
      render(
        <TourReviews
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });

    it('should render total reviews count', () => {
      render(
        <TourReviews
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText(/10/)).toBeInTheDocument();
    });
  });

  describe('Review List', () => {
    it('should render all reviews', () => {
      render(
        <TourReviews
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('Great tour!')).toBeInTheDocument();
      expect(screen.getByText('Nice experience')).toBeInTheDocument();
    });

    it('should render reviewer names', () => {
      render(
        <TourReviews
          tour={mockTour}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should render empty state when no reviews', () => {
      const tourWithoutReviews = {
        ...mockTour,
        _count: { reviews: 0 },
        reviews: [],
        ratingBreakdown: {},
      };
      render(
        <TourReviews
          tour={tourWithoutReviews}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('No reviews yet')).toBeInTheDocument();
    });
  });
});

