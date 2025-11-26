import React from 'react';
import { render } from '@testing-library/react';
import AdminToursPageSkeleton from '../../sekeleton/AdminToursPageSkeleton';

// Mock Skeleton component
jest.mock('../../sekeleton/Skeleton', () => {
  return function MockSkeleton() {
    return <div data-testid="skeleton" />;
  };
});

describe('AdminToursPageSkeleton Component', () => {
  it('should render admin tours page skeleton', () => {
    const { container } = render(<AdminToursPageSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render skeleton elements', () => {
    const { getAllByTestId } = render(<AdminToursPageSkeleton />);
    const skeletons = getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
