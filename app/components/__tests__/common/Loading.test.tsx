import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../../common/Loading';

describe('Loading Component', () => {
  describe('Basic Rendering', () => {
    it('should render with default props', () => {
      render(<Loading />);
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toBeInTheDocument();
    });

    it('should render with custom text', () => {
      render(<Loading text="Loading data..." />);
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('should not render text when text prop is not provided', () => {
      render(<Loading />);
      const textElement = screen.queryByText(/Loading/i);
      expect(textElement).not.toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('should render small size', () => {
      const { container } = render(<Loading size="sm" />);
      const spinner = container.querySelector('.h-4');
      expect(spinner).toBeInTheDocument();
    });

    it('should render medium size (default)', () => {
      const { container } = render(<Loading size="md" />);
      const spinner = container.querySelector('.h-8');
      expect(spinner).toBeInTheDocument();
    });

    it('should render large size', () => {
      const { container } = render(<Loading size="lg" />);
      const spinner = container.querySelector('.h-12');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Variant Types', () => {
    it('should render spinner variant (default)', () => {
      const { container } = render(<Loading variant="spinner" />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should render dots variant', () => {
      const { container } = render(<Loading variant="dots" />);
      const dots = container.querySelectorAll('.animate-bounce');
      expect(dots.length).toBeGreaterThan(0);
    });

    it('should render bars variant', () => {
      const { container } = render(<Loading variant="bars" />);
      const bars = container.querySelectorAll('.animate-pulse');
      expect(bars.length).toBeGreaterThan(0);
    });

    it('should render pulse variant', () => {
      const { container } = render(<Loading variant="pulse" />);
      const pulse = container.querySelector('.animate-pulse');
      expect(pulse).toBeInTheDocument();
    });
  });

  describe('Overlay Mode', () => {
    it('should render with overlay when overlay prop is true', () => {
      const { container } = render(<Loading overlay />);
      const overlay = container.querySelector('.absolute');
      expect(overlay).toBeInTheDocument();
    });

    it('should render full screen overlay when fullScreen is true', () => {
      const { container } = render(<Loading overlay fullScreen />);
      const overlay = container.querySelector('.fixed');
      expect(overlay).toBeInTheDocument();
    });

    it('should render without overlay by default', () => {
      const { container } = render(<Loading />);
      const overlay = container.querySelector('.absolute, .fixed');
      expect(overlay).not.toBeInTheDocument();
    });

    it('should render white card background in overlay mode', () => {
      const { container } = render(<Loading overlay />);
      const card = container.querySelector('.bg-white');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Custom Colors', () => {
    it('should apply custom backdrop color', () => {
      const { container } = render(
        <Loading overlay backdropColor="bg-red-500 bg-opacity-50" />
      );
      const overlay = container.querySelector('.bg-red-500');
      expect(overlay).toBeInTheDocument();
    });

    it('should apply custom text color', () => {
      render(<Loading text="Loading..." textColor="text-blue-500" />);
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-blue-500');
    });

    it('should apply custom spinner color', () => {
      const { container } = render(
        <Loading spinnerColor="border-t-green-600" />
      );
      const spinner = container.querySelector('.border-t-green-600');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Text Size Classes', () => {
    it('should apply small text size for small spinner', () => {
      render(<Loading size="sm" text="Loading..." />);
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-sm');
    });

    it('should apply medium text size for medium spinner', () => {
      render(<Loading size="md" text="Loading..." />);
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-base');
    });

    it('should apply large text size for large spinner', () => {
      render(<Loading size="lg" text="Loading..." />);
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-lg');
    });
  });

  describe('Combined Props', () => {
    it('should render with all props combined', () => {
      const { container } = render(
        <Loading
          size="lg"
          text="Please wait..."
          overlay
          fullScreen
          variant="dots"
          backdropColor="bg-black bg-opacity-75"
          textColor="text-white"
          spinnerColor="border-t-yellow-500"
        />
      );
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
      expect(container.querySelector('.fixed')).toBeInTheDocument();
      expect(container.querySelector('.bg-black')).toBeInTheDocument();
    });
  });
});
