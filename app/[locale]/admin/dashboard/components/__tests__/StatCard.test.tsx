import React from 'react';
import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ArrowUpRight: ({ className }: { className?: string }) => (
    <svg data-testid="arrow-up-right" className={className}>
      <title>Arrow Up Right</title>
    </svg>
  ),
  ArrowDownRight: ({ className }: { className?: string }) => (
    <svg data-testid="arrow-down-right" className={className}>
      <title>Arrow Down Right</title>
    </svg>
  ),
}));

describe('StatCard Component', () => {
  const mockIcon = <div data-testid="mock-icon">Icon</div>;
  const defaultProps = {
    title: 'Total Revenue',
    value: '$10,000',
    trend: '+5.2%',
    isPositive: true,
    icon: mockIcon,
    color: 'bg-green-100 text-green-600',
    vsLastMonthText: 'vs last month',
  };

  describe('Basic Rendering', () => {
    it('should render title', () => {
      render(<StatCard {...defaultProps} />);
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    });

    it('should render value', () => {
      render(<StatCard {...defaultProps} />);
      expect(screen.getByText('$10,000')).toBeInTheDocument();
    });

    it('should render trend', () => {
      render(<StatCard {...defaultProps} />);
      expect(screen.getByText('+5.2%')).toBeInTheDocument();
    });

    it('should render vsLastMonthText', () => {
      render(<StatCard {...defaultProps} />);
      expect(screen.getByText('vs last month')).toBeInTheDocument();
    });
  });

  describe('Positive Trend', () => {
    it('should render ArrowUpRight icon when isPositive is true', () => {
      render(<StatCard {...defaultProps} isPositive={true} />);
      expect(screen.getByTestId('arrow-up-right')).toBeInTheDocument();
      expect(screen.queryByTestId('arrow-down-right')).not.toBeInTheDocument();
    });

    it('should have green color class when isPositive is true', () => {
      const { container } = render(<StatCard {...defaultProps} isPositive={true} />);
      const trendSpan = container.querySelector('.text-green-500');
      expect(trendSpan).toBeInTheDocument();
      expect(trendSpan).toHaveClass('text-green-500');
    });

    it('should not have red color class when isPositive is true', () => {
      const { container } = render(<StatCard {...defaultProps} isPositive={true} />);
      const redSpan = container.querySelector('.text-red-500');
      expect(redSpan).not.toBeInTheDocument();
    });
  });

  describe('Negative Trend', () => {
    it('should render ArrowDownRight icon when isPositive is false', () => {
      render(<StatCard {...defaultProps} isPositive={false} />);
      expect(screen.getByTestId('arrow-down-right')).toBeInTheDocument();
      expect(screen.queryByTestId('arrow-up-right')).not.toBeInTheDocument();
    });

    it('should have red color class when isPositive is false', () => {
      const { container } = render(<StatCard {...defaultProps} isPositive={false} />);
      const trendSpan = container.querySelector('.text-red-500');
      expect(trendSpan).toBeInTheDocument();
      expect(trendSpan).toHaveClass('text-red-500');
    });

    it('should not have green color class when isPositive is false', () => {
      const { container } = render(<StatCard {...defaultProps} isPositive={false} />);
      const greenSpan = container.querySelector('.text-green-500');
      expect(greenSpan).not.toBeInTheDocument();
    });
  });

  describe('Icon Handling', () => {
    it('should clone and render icon with className', () => {
      render(<StatCard {...defaultProps} />);
      // Icon should be rendered
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should apply color classes to icon container', () => {
      const { container } = render(<StatCard {...defaultProps} />);
      const iconContainer = container.querySelector('.bg-green-100.text-green-600');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Different Colors', () => {
    it('should apply custom color classes', () => {
      const { container } = render(
        <StatCard {...defaultProps} color="bg-blue-100 text-blue-600" />
      );
      const iconContainer = container.querySelector('.bg-blue-100.text-blue-600');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should apply orange color classes', () => {
      const { container } = render(
        <StatCard {...defaultProps} color="bg-orange-100 text-orange-600" />
      );
      const iconContainer = container.querySelector('.bg-orange-100.text-orange-600');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should apply purple color classes', () => {
      const { container } = render(
        <StatCard {...defaultProps} color="bg-purple-100 text-purple-600" />
      );
      const iconContainer = container.querySelector('.bg-purple-100.text-purple-600');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero value', () => {
      render(<StatCard {...defaultProps} value="$0" />);
      expect(screen.getByText('$0')).toBeInTheDocument();
    });

    it('should handle negative trend with isPositive true', () => {
      render(<StatCard {...defaultProps} trend="-2.5%" isPositive={true} />);
      expect(screen.getByText('-2.5%')).toBeInTheDocument();
      expect(screen.getByTestId('arrow-up-right')).toBeInTheDocument();
    });

    it('should handle positive trend with isPositive false', () => {
      render(<StatCard {...defaultProps} trend="+3.1%" isPositive={false} />);
      expect(screen.getByText('+3.1%')).toBeInTheDocument();
      expect(screen.getByTestId('arrow-down-right')).toBeInTheDocument();
    });

    it('should handle empty vsLastMonthText', () => {
      render(<StatCard {...defaultProps} vsLastMonthText="" />);
      // Should still render without error
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should have correct card classes', () => {
      const { container } = render(<StatCard {...defaultProps} />);
      const card = container.firstChild;
      expect(card).toHaveClass('bg-white', 'p-6', 'rounded-xl', 'shadow-sm');
    });

    it('should render title and value in correct structure', () => {
      render(<StatCard {...defaultProps} />);
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('$10,000')).toBeInTheDocument();
    });
  });
});

