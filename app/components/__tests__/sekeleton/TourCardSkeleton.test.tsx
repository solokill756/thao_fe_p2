import React from 'react';
import { render } from '@testing-library/react';
import TourCardSkeleton, {
  TourCardSkeletonList,
} from '../../sekeleton/TourCardSkeleton';

// Mock Skeleton component
jest.mock('../../sekeleton/Skeleton', () => {
  return function MockSkeleton({ className }: { className?: string }) {
    return <div data-testid="skeleton" className={className} />;
  };
});

describe('TourCardSkeleton Component', () => {
  describe('Basic Rendering', () => {
    it('should render tour card skeleton', () => {
      const { container } = render(<TourCardSkeleton />);
      const card = container.querySelector('.bg-white');
      expect(card).toBeInTheDocument();
    });

    it('should have correct container classes', () => {
      const { container } = render(<TourCardSkeleton />);
      const card = container.firstChild;
      expect(card).toHaveClass(
        'bg-white',
        'rounded-xl',
        'shadow-lg',
        'overflow-hidden',
        'flex'
      );
    });
  });

  describe('Structure', () => {
    it('should render image skeleton section', () => {
      const { container } = render(<TourCardSkeleton />);
      const imageSection = container.querySelector('.relative');
      expect(imageSection).toBeInTheDocument();
    });

    it('should render content skeleton section', () => {
      const { container } = render(<TourCardSkeleton />);
      const contentSection = container.querySelector('.p-5');
      expect(contentSection).toBeInTheDocument();
    });

    it('should render multiple skeleton elements', () => {
      const { getAllByTestId } = render(<TourCardSkeleton />);
      const skeletons = getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });
});

describe('TourCardSkeletonList Component', () => {
  it('should render default count of skeletons', () => {
    const { getAllByTestId } = render(<TourCardSkeletonList />);
    const skeletons = getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render specified count of skeletons', () => {
    const { container } = render(<TourCardSkeletonList count={5} />);
    const cards = container.querySelectorAll('.bg-white');
    expect(cards.length).toBe(5);
  });

  it('should render with custom count', () => {
    const { container } = render(<TourCardSkeletonList count={10} />);
    const cards = container.querySelectorAll('.bg-white');
    expect(cards.length).toBe(10);
  });

  it('should have correct container classes', () => {
    const { container } = render(<TourCardSkeletonList />);
    const listContainer = container.firstChild;
    expect(listContainer).toHaveClass('space-y-6');
  });
});
