import React from 'react';
import { render } from '@testing-library/react';
import AdminBookingsPageSkeleton from '../../sekeleton/AdminBookingsPageSkeleton';

// Mock Skeleton component
jest.mock('../../sekeleton/Skeleton', () => {
  return function MockSkeleton() {
    return <div data-testid="skeleton" />;
  };
});

describe('AdminBookingsPageSkeleton Component', () => {
  it('should render admin bookings page skeleton', () => {
    const { container } = render(<AdminBookingsPageSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render skeleton elements', () => {
    const { getAllByTestId } = render(<AdminBookingsPageSkeleton />);
    const skeletons = getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
