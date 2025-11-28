import React from 'react';
import { render, screen } from '@testing-library/react';
import { NavigationProvider, useNavigation } from '../NavigationContext';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';

// Mock useNavigationLoading
jest.mock('@/app/lib/hooks/useNavigationLoading', () => ({
  useNavigationLoading: jest.fn(),
}));

const mockUseNavigationLoading = useNavigationLoading as jest.MockedFunction<
  typeof useNavigationLoading
>;

// Test component that uses the context
function TestComponent() {
  const navigation = useNavigation();
  return (
    <div>
      <div data-testid="is-pending">{navigation.isPending ? 'true' : 'false'}</div>
      <button onClick={() => navigation.push('/test')}>Push</button>
    </div>
  );
}

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
    it('should provide navigation context to children', () => {
      render(
        <NavigationProvider>
          <TestComponent />
        </NavigationProvider>
      );
      expect(screen.getByTestId('is-pending')).toBeInTheDocument();
    });

    it('should provide navigation methods', () => {
      render(
        <NavigationProvider>
          <TestComponent />
        </NavigationProvider>
      );
      const pushButton = screen.getByText('Push');
      expect(pushButton).toBeInTheDocument();
    });
  });

  describe('useNavigation Hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useNavigation must be used within NavigationProvider');

      consoleError.mockRestore();
    });

    it('should return navigation context when used inside provider', () => {
      render(
        <NavigationProvider>
          <TestComponent />
        </NavigationProvider>
      );
      expect(screen.getByTestId('is-pending')).toHaveTextContent('false');
    });
  });
});

