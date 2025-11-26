import React from 'react';
import { render } from '@testing-library/react';
import ReviewSkeleton from '../ReviewSkeleton';

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

describe('ReviewSkeleton Component', () => {
  describe('Basic Rendering', () => {
    it('should render review skeleton', () => {
      const { container } = render(<ReviewSkeleton />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render skeleton elements', () => {
      const { container } = render(<ReviewSkeleton />);
      const skeletons = container.querySelectorAll('[data-testid^="skeleton-"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });
});

