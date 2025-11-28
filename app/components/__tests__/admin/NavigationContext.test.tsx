import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  NavigationProvider,
  useNavigation,
} from '@/app/[locale]/admin/contexts/NavigationContext';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';

// Mock useNavigationLoading hook
jest.mock('@/app/lib/hooks/useNavigationLoading', () => ({
  useNavigationLoading: jest.fn(),
}));

const mockUseNavigationLoading = useNavigationLoading as jest.MockedFunction<
  typeof useNavigationLoading
>;

describe('NavigationContext', () => {
  const mockNavigation = {
    isPending: false,
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigationLoading.mockReturnValue(mockNavigation);
  });

  describe('NavigationProvider', () => {
    it('should render children', () => {
      render(
        <NavigationProvider>
          <div>Test Content</div>
        </NavigationProvider>
      );
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should provide navigation context to children', () => {
      const TestComponent = () => {
        const navigation = useNavigation();
        return (
          <div>
            <div data-testid="isPending">{navigation.isPending.toString()}</div>
            <button onClick={() => navigation.push('/test')}>Push</button>
          </div>
        );
      };

      render(
        <NavigationProvider>
          <TestComponent />
        </NavigationProvider>
      );

      expect(screen.getByTestId('isPending')).toHaveTextContent('false');
    });
  });

  describe('useNavigation Hook', () => {
    it('should return navigation object when used within provider', () => {
      const TestComponent = () => {
        const navigation = useNavigation();
        return (
          <div>
            <div data-testid="hasPush">
              {typeof navigation.push === 'function' ? 'true' : 'false'}
            </div>
            <div data-testid="hasReplace">
              {typeof navigation.replace === 'function' ? 'true' : 'false'}
            </div>
            <div data-testid="hasBack">
              {typeof navigation.back === 'function' ? 'true' : 'false'}
            </div>
            <div data-testid="hasForward">
              {typeof navigation.forward === 'function' ? 'true' : 'false'}
            </div>
            <div data-testid="hasRefresh">
              {typeof navigation.refresh === 'function' ? 'true' : 'false'}
            </div>
            <div data-testid="hasPrefetch">
              {typeof navigation.prefetch === 'function' ? 'true' : 'false'}
            </div>
          </div>
        );
      };

      render(
        <NavigationProvider>
          <TestComponent />
        </NavigationProvider>
      );

      expect(screen.getByTestId('hasPush')).toHaveTextContent('true');
      expect(screen.getByTestId('hasReplace')).toHaveTextContent('true');
      expect(screen.getByTestId('hasBack')).toHaveTextContent('true');
      expect(screen.getByTestId('hasForward')).toHaveTextContent('true');
      expect(screen.getByTestId('hasRefresh')).toHaveTextContent('true');
      expect(screen.getByTestId('hasPrefetch')).toHaveTextContent('true');
    });

    it('should throw error when used outside provider', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const TestComponent = () => {
        try {
          useNavigation();
          return <div>No Error</div>;
        } catch (error: any) {
          return <div data-testid="error">{error.message}</div>;
        }
      };

      render(<TestComponent />);

      expect(screen.getByTestId('error')).toHaveTextContent(
        'useNavigation must be used within NavigationProvider'
      );

      consoleError.mockRestore();
    });

    it('should provide isPending state', () => {
      mockUseNavigationLoading.mockReturnValue({
        ...mockNavigation,
        isPending: true,
      });

      const TestComponent = () => {
        const navigation = useNavigation();
        return (
          <div data-testid="isPending">{navigation.isPending.toString()}</div>
        );
      };

      render(
        <NavigationProvider>
          <TestComponent />
        </NavigationProvider>
      );

      expect(screen.getByTestId('isPending')).toHaveTextContent('true');
    });

    it('should provide navigation methods that call useNavigationLoading methods', () => {
      const mockPush = jest.fn();
      const mockReplace = jest.fn();
      const mockBack = jest.fn();
      const mockForward = jest.fn();
      const mockRefresh = jest.fn();
      const mockPrefetch = jest.fn();

      mockUseNavigationLoading.mockReturnValue({
        isPending: false,
        push: mockPush,
        replace: mockReplace,
        back: mockBack,
        forward: mockForward,
        refresh: mockRefresh,
        prefetch: mockPrefetch,
      });

      const TestComponent = () => {
        const navigation = useNavigation();
        return (
          <div>
            <button onClick={() => navigation.push('/test')}>Push</button>
            <button onClick={() => navigation.replace('/test2')}>
              Replace
            </button>
            <button onClick={() => navigation.back()}>Back</button>
            <button onClick={() => navigation.forward()}>Forward</button>
            <button onClick={() => navigation.refresh()}>Refresh</button>
            <button onClick={() => navigation.prefetch('/test3')}>
              Prefetch
            </button>
          </div>
        );
      };

      render(
        <NavigationProvider>
          <TestComponent />
        </NavigationProvider>
      );

      screen.getByText('Push').click();
      expect(mockPush).toHaveBeenCalledWith('/test');

      screen.getByText('Replace').click();
      expect(mockReplace).toHaveBeenCalledWith('/test2');

      screen.getByText('Back').click();
      expect(mockBack).toHaveBeenCalled();

      screen.getByText('Forward').click();
      expect(mockForward).toHaveBeenCalled();

      screen.getByText('Refresh').click();
      expect(mockRefresh).toHaveBeenCalled();

      screen.getByText('Prefetch').click();
      expect(mockPrefetch).toHaveBeenCalledWith('/test3');
    });
  });
});
