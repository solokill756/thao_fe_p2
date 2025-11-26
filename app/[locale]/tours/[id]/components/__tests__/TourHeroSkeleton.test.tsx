import React from 'react';
import { render } from '@testing-library/react';
import TourHeroSkeleton from '../TourHeroSkeleton';

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

describe('TourHeroSkeleton Component', () => {
  describe('Basic Rendering', () => {
    it('should render tour hero skeleton', () => {
      const { container } = render(<TourHeroSkeleton />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render title skeleton', () => {
      const { container } = render(<TourHeroSkeleton />);
      const skeletons = container.querySelectorAll('[data-testid="skeleton-text"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render info skeletons', () => {
      const { container } = render(<TourHeroSkeleton />);
      const skeletons = container.querySelectorAll('[data-testid="skeleton-rectangular"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Styling', () => {
    it('should have correct height', () => {
      const { container } = render(<TourHeroSkeleton />);
      const hero = container.firstChild;
      expect(hero).toHaveClass('h-96');
    });

    it('should have overlay', () => {
      const { container } = render(<TourHeroSkeleton />);
      const overlay = container.querySelector('.bg-black\\/40');
      expect(overlay).toBeInTheDocument();
    });
  });
});

