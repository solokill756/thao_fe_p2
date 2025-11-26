import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsOverview from '../StatsOverview';
import { ADMIN_BOOKINGS_CONSTANTS } from '@/app/lib/constants';

// Mock StatsCard
jest.mock('../StatsCard', () => {
  return function MockStatsCard({
    title,
    value,
  }: {
    title: string;
    value: string | number;
  }) {
    return (
      <div data-testid="stats-card">
        <div data-testid="stats-title">{title}</div>
        <div data-testid="stats-value">{value}</div>
      </div>
    );
  };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Clock: () => <div data-testid="clock-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
}));

describe('StatsOverview Component', () => {
  const mockDictionary = {
    admin: {
      bookings: {
        pendingRequests: 'Pending Requests',
        confirmedBookings: 'Confirmed Bookings',
        totalRevenue: 'Total Revenue',
        vsLastMonth: 'vs last month',
      },
    },
  } as any;

  describe('Basic Rendering', () => {
    it('should render all three stats cards', () => {
      render(
        <StatsOverview
          dictionary={mockDictionary}
          pendingCount={10}
          confirmedCount={50}
          totalRevenue={50000}
        />
      );
      const statsCards = screen.getAllByTestId('stats-card');
      expect(statsCards.length).toBe(3);
    });

    it('should render pending requests card', () => {
      render(
        <StatsOverview
          dictionary={mockDictionary}
          pendingCount={10}
          confirmedCount={50}
          totalRevenue={50000}
        />
      );
      expect(screen.getByText('Pending Requests')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should render confirmed bookings card', () => {
      render(
        <StatsOverview
          dictionary={mockDictionary}
          pendingCount={10}
          confirmedCount={50}
          totalRevenue={50000}
        />
      );
      expect(screen.getByText('Confirmed Bookings')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('should render total revenue card', () => {
      render(
        <StatsOverview
          dictionary={mockDictionary}
          pendingCount={10}
          confirmedCount={50}
          totalRevenue={50000}
        />
      );
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('$50,000')).toBeInTheDocument();
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', () => {
      const incompleteDict = { admin: {} } as any;
      render(
        <StatsOverview
          dictionary={incompleteDict}
          pendingCount={5}
          confirmedCount={20}
          totalRevenue={10000}
        />
      );
      expect(
        screen.getByText(ADMIN_BOOKINGS_CONSTANTS.PENDING_REQUESTS)
      ).toBeInTheDocument();
      expect(
        screen.getByText(ADMIN_BOOKINGS_CONSTANTS.CONFIRMED_BOOKINGS)
      ).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have correct grid layout', () => {
      const { container } = render(
        <StatsOverview
          dictionary={mockDictionary}
          pendingCount={10}
          confirmedCount={50}
          totalRevenue={50000}
        />
      );
      const grid = container.firstChild;
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-3');
    });
  });
});

