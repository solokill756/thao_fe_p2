import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsGrid from '../StatsGrid';
import type { DashboardStats } from '@/app/actions/admin/getDashboardStatsAction';

// Mock StatCard
jest.mock('../StatCard', () => ({
  __esModule: true,
  default: ({
    title,
    value,
    trend,
    isPositive,
  }: {
    title: string;
    value: string;
    trend: string;
    isPositive: boolean;
  }) => (
    <div data-testid="stat-card" data-title={title} data-value={value} data-trend={trend} data-positive={isPositive}>
      {title}: {value} ({trend})
    </div>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  DollarSign: () => <div data-testid="dollar-icon">$</div>,
  ShoppingBag: () => <div data-testid="shopping-icon">Bag</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  Map: () => <div data-testid="map-icon">Map</div>,
}));

describe('StatsGrid Component', () => {
  const mockStats: DashboardStats = {
    totalRevenue: 10000,
    revenueChange: 5.2,
    totalBookings: 150,
    bookingsChange: -2.5,
    activeUsers: 50,
    usersChange: 10.5,
    activeTours: 25,
  };

  const mockDictionary = {
    admin: {
      bookings: {
        totalRevenue: 'Total Revenue',
        vsLastMonth: 'vs last month',
      },
      dashboard: {
        totalBookings: 'Total Bookings',
        activeUsers: 'Active Users',
        activeTours: 'Active Tours',
        vsLastMonth: 'vs last month',
      },
    },
  } as any;

  describe('Basic Rendering', () => {
    it('should render all 4 stat cards', () => {
      render(<StatsGrid stats={mockStats} dictionary={mockDictionary} />);
      const statCards = screen.getAllByTestId('stat-card');
      expect(statCards).toHaveLength(4);
    });

    it('should render Total Revenue stat card', () => {
      render(<StatsGrid stats={mockStats} dictionary={mockDictionary} />);
      expect(screen.getByText(/Total Revenue:/i)).toBeInTheDocument();
    });

    it('should render Total Bookings stat card', () => {
      render(<StatsGrid stats={mockStats} dictionary={mockDictionary} />);
      expect(screen.getByText(/Total Bookings:/i)).toBeInTheDocument();
    });

    it('should render Active Users stat card', () => {
      render(<StatsGrid stats={mockStats} dictionary={mockDictionary} />);
      expect(screen.getByText(/Active Users:/i)).toBeInTheDocument();
    });

    it('should render Active Tours stat card', () => {
      render(<StatsGrid stats={mockStats} dictionary={mockDictionary} />);
      expect(screen.getByText(/Active Tours:/i)).toBeInTheDocument();
    });
  });

  describe('Currency Formatting', () => {
    it('should format currency correctly', () => {
      render(<StatsGrid stats={mockStats} dictionary={mockDictionary} />);
      const revenueCard = screen.getAllByTestId('stat-card')[0];
      expect(revenueCard).toHaveAttribute('data-value', '$10,000');
    });

    it('should format large currency values', () => {
      const largeStats = { ...mockStats, totalRevenue: 1234567 };
      render(<StatsGrid stats={largeStats} dictionary={mockDictionary} />);
      const revenueCard = screen.getAllByTestId('stat-card')[0];
      expect(revenueCard).toHaveAttribute('data-value', '$1,234,567');
    });

    it('should format zero currency', () => {
      const zeroStats = { ...mockStats, totalRevenue: 0 };
      render(<StatsGrid stats={zeroStats} dictionary={mockDictionary} />);
      const revenueCard = screen.getAllByTestId('stat-card')[0];
      expect(revenueCard).toHaveAttribute('data-value', '$0');
    });
  });

  describe('Number Formatting', () => {
    it('should format numbers with commas', () => {
      render(<StatsGrid stats={mockStats} dictionary={mockDictionary} />);
      const bookingsCard = screen.getAllByTestId('stat-card')[1];
      expect(bookingsCard).toHaveAttribute('data-value', '150');
    });

    it('should format large numbers with commas', () => {
      const largeStats = { ...mockStats, totalBookings: 1234567 };
      render(<StatsGrid stats={largeStats} dictionary={mockDictionary} />);
      const bookingsCard = screen.getAllByTestId('stat-card')[1];
      expect(bookingsCard).toHaveAttribute('data-value', '1,234,567');
    });
  });

  describe('Percentage Formatting', () => {
    it('should format positive percentages with + sign', () => {
      render(<StatsGrid stats={mockStats} dictionary={mockDictionary} />);
      const revenueCard = screen.getAllByTestId('stat-card')[0];
      expect(revenueCard).toHaveAttribute('data-trend', '+5.2%');
    });

    it('should format negative percentages with - sign', () => {
      render(<StatsGrid stats={mockStats} dictionary={mockDictionary} />);
      const bookingsCard = screen.getAllByTestId('stat-card')[1];
      expect(bookingsCard).toHaveAttribute('data-trend', '-2.5%');
    });

    it('should format zero percentage', () => {
      const zeroStats = { ...mockStats, revenueChange: 0 };
      render(<StatsGrid stats={zeroStats} dictionary={mockDictionary} />);
      const revenueCard = screen.getAllByTestId('stat-card')[0];
      expect(revenueCard).toHaveAttribute('data-trend', '+0.0%');
    });

    it('should format percentage with one decimal place', () => {
      const stats = { ...mockStats, revenueChange: 3.14159 };
      render(<StatsGrid stats={stats} dictionary={mockDictionary} />);
      const revenueCard = screen.getAllByTestId('stat-card')[0];
      expect(revenueCard).toHaveAttribute('data-trend', '+3.1%');
    });
  });

  describe('Positive/Negative Trend Logic', () => {
    it('should mark revenue as positive when revenueChange >= 0', () => {
      const positiveStats = { ...mockStats, revenueChange: 5.2 };
      render(<StatsGrid stats={positiveStats} dictionary={mockDictionary} />);
      const revenueCard = screen.getAllByTestId('stat-card')[0];
      expect(revenueCard).toHaveAttribute('data-positive', 'true');
    });

    it('should mark revenue as negative when revenueChange < 0', () => {
      const negativeStats = { ...mockStats, revenueChange: -3.5 };
      render(<StatsGrid stats={negativeStats} dictionary={mockDictionary} />);
      const revenueCard = screen.getAllByTestId('stat-card')[0];
      expect(revenueCard).toHaveAttribute('data-positive', 'false');
    });

    it('should mark bookings as positive when bookingsChange >= 0', () => {
      const positiveStats = { ...mockStats, bookingsChange: 2.1 };
      render(<StatsGrid stats={positiveStats} dictionary={mockDictionary} />);
      const bookingsCard = screen.getAllByTestId('stat-card')[1];
      expect(bookingsCard).toHaveAttribute('data-positive', 'true');
    });

    it('should mark bookings as negative when bookingsChange < 0', () => {
      render(<StatsGrid stats={mockStats} dictionary={mockDictionary} />);
      const bookingsCard = screen.getAllByTestId('stat-card')[1];
      expect(bookingsCard).toHaveAttribute('data-positive', 'false');
    });

    it('should mark users as positive when usersChange >= 0', () => {
      render(<StatsGrid stats={mockStats} dictionary={mockDictionary} />);
      const usersCard = screen.getAllByTestId('stat-card')[2];
      expect(usersCard).toHaveAttribute('data-positive', 'true');
    });

    it('should mark tours as always positive', () => {
      render(<StatsGrid stats={mockStats} dictionary={mockDictionary} />);
      const toursCard = screen.getAllByTestId('stat-card')[3];
      expect(toursCard).toHaveAttribute('data-positive', 'true');
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use default text when dictionary is incomplete', () => {
      const incompleteDict = {
        admin: {
          bookings: {},
          dashboard: {},
        },
      } as any;

      render(<StatsGrid stats={mockStats} dictionary={incompleteDict} />);
      expect(screen.getByText(/Total Revenue:/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Bookings:/i)).toBeInTheDocument();
    });

    it('should use dashboard vsLastMonth if available', () => {
      const dictWithDashboard = {
        admin: {
          dashboard: {
            vsLastMonth: 'so với tháng trước',
          },
        },
      } as any;

      render(<StatsGrid stats={mockStats} dictionary={dictWithDashboard} />);
      // Should still render without error
      expect(screen.getAllByTestId('stat-card')).toHaveLength(4);
    });

    it('should fallback to bookings vsLastMonth if dashboard not available', () => {
      const dictWithBookings = {
        admin: {
          bookings: {
            vsLastMonth: 'vs last month',
          },
        },
      } as any;

      render(<StatsGrid stats={mockStats} dictionary={dictWithBookings} />);
      expect(screen.getAllByTestId('stat-card')).toHaveLength(4);
    });
  });

  describe('Component Structure', () => {
    it('should render grid with correct classes', () => {
      const { container } = render(<StatsGrid stats={mockStats} dictionary={mockDictionary} />);
      const grid = container.firstChild;
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
    });
  });
});

