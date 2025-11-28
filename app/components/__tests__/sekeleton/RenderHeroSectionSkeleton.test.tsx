import React from 'react';
import { render } from '@testing-library/react';
import RenderHeroSectionSkeleton from '../../sekeleton/RenderHeroSectionSkeleton';

// Mock Skeleton component
jest.mock('../../sekeleton/Skeleton', () => {
  return function MockSkeleton() {
    return <div data-testid="skeleton" />;
  };
});

describe('RenderHeroSectionSkeleton Component', () => {
  it('should render hero section skeleton', () => {
    const { container } = render(<RenderHeroSectionSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render skeleton elements', () => {
    const { getAllByTestId } = render(<RenderHeroSectionSkeleton />);
    const skeletons = getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
