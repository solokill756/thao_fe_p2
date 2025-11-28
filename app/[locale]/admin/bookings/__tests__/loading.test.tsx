import { render, screen } from '@testing-library/react';
import Loading from '../loading';

// Mock AdminBookingsPageSkeleton
jest.mock('@/app/components/sekeleton/AdminBookingsPageSkeleton', () => ({
  __esModule: true,
  default: () => <div data-testid="admin-bookings-page-skeleton">Loading skeleton</div>,
}));

describe('Loading Component', () => {
  it('should render AdminBookingsPageSkeleton', () => {
    render(<Loading />);
    expect(screen.getByTestId('admin-bookings-page-skeleton')).toBeInTheDocument();
  });

  it('should render loading skeleton component', () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should match snapshot', () => {
    const { container } = render(<Loading />);
    expect(container).toMatchSnapshot();
  });
});

