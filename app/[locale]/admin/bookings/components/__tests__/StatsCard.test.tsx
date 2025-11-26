import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsCard from '../StatsCard';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
}));

describe('StatsCard Component', () => {
  describe('Basic Rendering', () => {
    it('should render with title and value', () => {
      render(
        <StatsCard
          title="Total Revenue"
          value="$10,000"
          icon={<div data-testid="test-icon" />}
          color="bg-blue-500"
          trend="+10%"
          vsLastMonth="vs last month"
        />
      );
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('$10,000')).toBeInTheDocument();
    });

    it('should render icon', () => {
      render(
        <StatsCard
          title="Total Revenue"
          value="$10,000"
          icon={<div data-testid="test-icon" />}
          color="bg-blue-500"
          trend="+10%"
          vsLastMonth="vs last month"
        />
      );
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('should render trend and vsLastMonth', () => {
      render(
        <StatsCard
          title="Total Revenue"
          value="$10,000"
          icon={<div data-testid="test-icon" />}
          color="bg-blue-500"
          trend="+10%"
          vsLastMonth="vs last month"
        />
      );
      expect(screen.getByText('+10%')).toBeInTheDocument();
      expect(screen.getByText('vs last month')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have correct card classes', () => {
      const { container } = render(
        <StatsCard
          title="Total Revenue"
          value="$10,000"
          icon={<div data-testid="test-icon" />}
        />
      );
      const card = container.firstChild;
      expect(card).toHaveClass('bg-white', 'rounded-xl', 'shadow-sm');
    });
  });
});

