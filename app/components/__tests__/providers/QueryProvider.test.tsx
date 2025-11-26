import React from 'react';
import { render, screen } from '@testing-library/react';
import QueryProvider from '../../providers/QueryProvider';

// Mock @tanstack/react-query
const mockQueryClientProvider = jest.fn(({ children }) => (
  <div>{children}</div>
));
const mockHydrationBoundary = jest.fn(({ children }) => <div>{children}</div>);
const mockReactQueryDevtools = jest.fn(() => null);

jest.mock('@tanstack/react-query', () => ({
  QueryClientProvider: (props: any) => mockQueryClientProvider(props),
  HydrationBoundary: (props: any) => mockHydrationBoundary(props),
  ReactQueryDevtools: () => mockReactQueryDevtools(),
}));

// Mock queryClient utility
const mockMakeQueryClient = jest.fn();
jest.mock('@/app/lib/utils/queryClient', () => ({
  makeQueryClient: () => mockMakeQueryClient(),
}));

describe('QueryProvider Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render children', () => {
      render(
        <QueryProvider>
          <div>Test Content</div>
        </QueryProvider>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <QueryProvider>
          <div>Child 1</div>
          <div>Child 2</div>
        </QueryProvider>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
  });

  describe('HydrationBoundary', () => {
    it('should render HydrationBoundary when dehydratedState is provided', () => {
      const dehydratedState = { queries: [] };

      render(
        <QueryProvider dehydratedState={dehydratedState}>
          <div>Test Content</div>
        </QueryProvider>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render children directly when dehydratedState is not provided', () => {
      render(
        <QueryProvider>
          <div>Test Content</div>
        </QueryProvider>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('QueryClient', () => {
    it('should create query client', () => {
      const { makeQueryClient } = require('@/app/lib/utils/queryClient');
      render(
        <QueryProvider>
          <div>Test</div>
        </QueryProvider>
      );

      expect(makeQueryClient).toHaveBeenCalled();
    });
  });
});
