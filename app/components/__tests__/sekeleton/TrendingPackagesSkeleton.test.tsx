import React from 'react';
import { render } from '@testing-library/react';
import TrendingPackagesSkeleton from '../../sekeleton/TrendingPackagesSkeleton';

// Mock Skeleton component
jest.mock('../../sekeleton/Skeleton', () => {
  return function MockSkeleton() {
    return <div data-testid="skeleton" />;
  };
});

describe('TrendingPackagesSkeleton Component', () => {
  it('should render trending packages skeleton', () => {
    const { container } = render(<TrendingPackagesSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render multiple skeleton elements', () => {
    const { getAllByTestId } = render(<TrendingPackagesSkeleton />);
    const skeletons = getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
