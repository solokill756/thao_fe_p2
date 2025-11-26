import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchLoading from '../loading';

// Mock Skeleton components
jest.mock('@/app/components/sekeleton/Skeleton', () => {
  return function MockSkeleton({ variant, width, height, className }: any) {
    return (
      <div
        data-testid={`skeleton-${variant}`}
        style={{ width, height }}
        className={className}
      />
    );
  };
});

jest.mock('@/app/components/sekeleton/TourCardSkeleton', () => ({
  TourCardSkeletonList: () => <div data-testid="tour-card-skeleton-list">Tour Card Skeletons</div>,
}));

describe('SearchLoading Component', () => {
  describe('Basic Rendering', () => {
    it('should render search loading skeleton', () => {
      const { container } = render(<SearchLoading />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render header skeleton', () => {
      const { container } = render(<SearchLoading />);
      const skeletons = container.querySelectorAll('[data-testid="skeleton-text"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render sidebar skeleton', () => {
      const { container } = render(<SearchLoading />);
      const skeletons = container.querySelectorAll('[data-testid="skeleton-rectangular"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render tour cards skeleton list', () => {
      render(<SearchLoading />);
      expect(screen.getByTestId('tour-card-skeleton-list')).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should have correct grid layout', () => {
      const { container } = render(<SearchLoading />);
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'lg:grid-cols-4');
    });
  });
});

