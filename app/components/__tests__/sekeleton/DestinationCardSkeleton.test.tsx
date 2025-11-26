import React from 'react';
import { render } from '@testing-library/react';
import DestinationCardSkeleton from '../../sekeleton/DestinationCardSkeleton';

// Mock Skeleton component
jest.mock('../../sekeleton/Skeleton', () => {
  return function MockSkeleton() {
    return <div data-testid="skeleton" />;
  };
});

describe('DestinationCardSkeleton Component', () => {
  it('should render destination card skeleton', () => {
    const { container } = render(<DestinationCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render skeleton elements', () => {
    const { getAllByTestId } = render(<DestinationCardSkeleton />);
    const skeletons = getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
