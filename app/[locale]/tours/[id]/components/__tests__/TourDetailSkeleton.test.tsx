import React from 'react';
import { render } from '@testing-library/react';
import TourDetailSkeleton from '../TourDetailSkeleton';

// Mock Skeleton component
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

describe('TourDetailSkeleton Component', () => {
  describe('Basic Rendering', () => {
    it('should render tour detail skeleton', () => {
      const { container } = render(<TourDetailSkeleton />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render tabs skeleton', () => {
      const { container } = render(<TourDetailSkeleton />);
      const skeletons = container.querySelectorAll('[data-testid^="skeleton-"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render content skeleton', () => {
      const { container } = render(<TourDetailSkeleton />);
      const skeletons = container.querySelectorAll('[data-testid="skeleton-text"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render booking form skeleton', () => {
      const { container } = render(<TourDetailSkeleton />);
      const skeletons = container.querySelectorAll('[data-testid="skeleton-rectangular"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Layout', () => {
    it('should have correct grid layout', () => {
      const { container } = render(<TourDetailSkeleton />);
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'lg:grid-cols-3');
    });
  });
});

