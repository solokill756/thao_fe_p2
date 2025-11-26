import React from 'react';
import { render, screen } from '@testing-library/react';
import NavigationLoadingProvider from '../../providers/NavigationLoadingProvider';

// Mock useTransition
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useTransition: jest.fn(),
}));

// Mock Loading component
jest.mock('../../common/Loading', () => {
  return function MockLoading({ text }: { text?: string }) {
    return <div data-testid="loading">{text || 'Loading'}</div>;
  };
});

const mockUseTransition = require('react').useTransition as jest.MockedFunction<
  typeof React.useTransition
>;

describe('NavigationLoadingProvider Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render children when not pending', () => {
      mockUseTransition.mockReturnValue([false, jest.fn()]);

      render(
        <NavigationLoadingProvider>
          <div>Test Content</div>
        </NavigationLoadingProvider>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    it('should render loading overlay when pending', () => {
      mockUseTransition.mockReturnValue([true, jest.fn()]);

      const { container } = render(
        <NavigationLoadingProvider>
          <div>Test Content</div>
        </NavigationLoadingProvider>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      const overlay = container.querySelector('.fixed');
      expect(overlay).toBeInTheDocument();
    });
  });

  describe('Loading Overlay', () => {
    it('should have correct overlay styling when pending', () => {
      mockUseTransition.mockReturnValue([true, jest.fn()]);

      const { container } = render(
        <NavigationLoadingProvider>
          <div>Test</div>
        </NavigationLoadingProvider>
      );

      const overlay = container.querySelector('.fixed');
      expect(overlay).toHaveClass(
        'inset-0',
        'bg-black',
        'bg-opacity-50',
        'z-50'
      );
    });

    it('should render loading component with correct props', () => {
      mockUseTransition.mockReturnValue([true, jest.fn()]);

      render(
        <NavigationLoadingProvider>
          <div>Test</div>
        </NavigationLoadingProvider>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Multiple Children', () => {
    it('should render multiple children', () => {
      mockUseTransition.mockReturnValue([false, jest.fn()]);

      render(
        <NavigationLoadingProvider>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </NavigationLoadingProvider>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });
  });
});
