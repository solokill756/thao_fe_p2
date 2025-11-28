import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorRetry from '../../common/ErrorRetry';

describe('ErrorRetry Component', () => {
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    mockOnRetry.mockClear();
  });

  describe('Basic Rendering', () => {
    it('should render with default error message when no error provided', () => {
      render(<ErrorRetry />);
      expect(
        screen.getByText('An error occurred. Please try again.')
      ).toBeInTheDocument();
    });

    it('should render with string error', () => {
      render(<ErrorRetry error="Something went wrong" />);
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should render with Error object', () => {
      const error = new Error('Network error');
      render(<ErrorRetry error={error} />);
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    it('should render with custom message prop', () => {
      render(<ErrorRetry message="Custom error message" />);
      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    it('should prioritize message prop over error prop', () => {
      render(<ErrorRetry error="Error message" message="Custom message" />);
      expect(screen.getByText('Custom message')).toBeInTheDocument();
      expect(screen.queryByText('Error message')).not.toBeInTheDocument();
    });
  });

  describe('Title and Labels', () => {
    it('should render title when provided', () => {
      render(<ErrorRetry title="Error Title" />);
      expect(screen.getByText('Error Title')).toBeInTheDocument();
    });

    it('should not render title when not provided', () => {
      render(<ErrorRetry />);
      const title = screen.queryByRole('heading');
      expect(title).not.toBeInTheDocument();
    });

    it('should render custom retry label', () => {
      render(<ErrorRetry onRetry={mockOnRetry} retryLabel="Try Again" />);
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should render default retry label', () => {
      render(<ErrorRetry onRetry={mockOnRetry} />);
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('should render small size', () => {
      const { container } = render(<ErrorRetry size="sm" />);
      const errorContainer = container.firstChild;
      expect(errorContainer).toHaveClass('py-4', 'px-4');
    });

    it('should render medium size (default)', () => {
      const { container } = render(<ErrorRetry size="md" />);
      const errorContainer = container.firstChild;
      expect(errorContainer).toHaveClass('py-8', 'px-6');
    });

    it('should render large size', () => {
      const { container } = render(<ErrorRetry size="lg" />);
      const errorContainer = container.firstChild;
      expect(errorContainer).toHaveClass('py-12', 'px-8');
    });
  });

  describe('Style Variants', () => {
    it('should render default variant', () => {
      const { container } = render(<ErrorRetry variant="default" />);
      const errorContainer = container.firstChild;
      expect(errorContainer).toHaveClass('bg-red-50', 'border-red-200');
    });

    it('should render minimal variant', () => {
      const { container } = render(<ErrorRetry variant="minimal" />);
      const errorContainer = container.firstChild;
      expect(errorContainer).toHaveClass('bg-transparent');
    });

    it('should render card variant', () => {
      const { container } = render(<ErrorRetry variant="card" />);
      const errorContainer = container.firstChild;
      expect(errorContainer).toHaveClass('bg-white', 'shadow-sm', 'rounded-lg');
    });

    it('should wrap content in max-w-lg container for card variant', () => {
      const { container } = render(<ErrorRetry variant="card" />);
      const wrapper = container.querySelector('.max-w-lg');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Icon Display', () => {
    it('should show icon by default', () => {
      const { container } = render(<ErrorRetry />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should hide icon when showIcon is false', () => {
      const { container } = render(<ErrorRetry showIcon={false} />);
      const icon = container.querySelector('svg');
      expect(icon).not.toBeInTheDocument();
    });

    it('should apply correct icon color for minimal variant', () => {
      const { container } = render(<ErrorRetry variant="minimal" />);
      const icon = container.querySelector('.text-red-500');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Retry Button', () => {
    it('should show retry button when onRetry is provided', () => {
      render(<ErrorRetry onRetry={mockOnRetry} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should not show retry button when onRetry is not provided', () => {
      render(<ErrorRetry />);
      const button = screen.queryByRole('button');
      expect(button).not.toBeInTheDocument();
    });

    it('should hide retry button when showRetry is false', () => {
      render(<ErrorRetry onRetry={mockOnRetry} showRetry={false} />);
      const button = screen.queryByRole('button');
      expect(button).not.toBeInTheDocument();
    });

    it('should call onRetry when button is clicked', () => {
      render(<ErrorRetry onRetry={mockOnRetry} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it('should have correct button styles for default variant', () => {
      render(<ErrorRetry onRetry={mockOnRetry} variant="default" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-600');
    });

    it('should have correct button styles for minimal variant', () => {
      render(<ErrorRetry onRetry={mockOnRetry} variant="minimal" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-200');
    });

    it('should have correct button styles for card variant', () => {
      render(<ErrorRetry onRetry={mockOnRetry} variant="card" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600');
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className', () => {
      const { container } = render(<ErrorRetry className="custom-class" />);
      const errorContainer = container.firstChild;
      expect(errorContainer).toHaveClass('custom-class');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null error', () => {
      render(<ErrorRetry error={null} />);
      expect(
        screen.getByText('An error occurred. Please try again.')
      ).toBeInTheDocument();
    });

    it('should handle empty string error', () => {
      render(<ErrorRetry error="" />);
      expect(
        screen.getByText('An error occurred. Please try again.')
      ).toBeInTheDocument();
    });

    it('should handle Error object with empty message', () => {
      const error = new Error('');
      render(<ErrorRetry error={error} />);
      expect(
        screen.getByText('An error occurred. Please try again.')
      ).toBeInTheDocument();
    });
  });
});
