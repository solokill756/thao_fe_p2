import React from 'react';
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import AdminLayoutClient from '@/app/[locale]/admin/AdminLayoutClient';
import { useNavigation } from '@/app/[locale]/admin/contexts/NavigationContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock NavigationContext
jest.mock('@/app/[locale]/admin/contexts/NavigationContext', () => ({
  useNavigation: jest.fn(),
}));

// Mock Sidebar
jest.mock('@/app/[locale]/admin/components/Sidebar', () => {
  return function MockSidebar() {
    return <div data-testid="sidebar">Sidebar</div>;
  };
});

// Mock skeletons
jest.mock('@/app/components/sekeleton/AdminToursPageSkeleton', () => {
  return function MockAdminToursPageSkeleton() {
    return <div data-testid="tours-skeleton">Tours Skeleton</div>;
  };
});

jest.mock('@/app/components/sekeleton/AdminBookingsPageSkeleton', () => {
  return function MockAdminBookingsPageSkeleton() {
    return <div data-testid="bookings-skeleton">Bookings Skeleton</div>;
  };
});

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseNavigation = useNavigation as jest.MockedFunction<
  typeof useNavigation
>;

describe('AdminLayoutClient Component', () => {
  const mockDictionary = {
    admin: {},
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigation.mockReturnValue({
      isPending: false,
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  describe('Basic Rendering', () => {
    it('should render sidebar', () => {
      mockUsePathname.mockReturnValue('/en/admin/bookings');
      render(
        <AdminLayoutClient locale="en" dictionary={mockDictionary}>
          <div>Test Content</div>
        </AdminLayoutClient>
      );
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    it('should render children when not pending', () => {
      mockUsePathname.mockReturnValue('/en/admin/bookings');
      mockUseNavigation.mockReturnValue({
        isPending: false,
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn(),
      });

      render(
        <AdminLayoutClient locale="en" dictionary={mockDictionary}>
          <div>Test Content</div>
        </AdminLayoutClient>
      );
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Skeleton Loading States', () => {
    it('should show tours skeleton when pathname includes /admin/tours and pending', () => {
      mockUsePathname.mockReturnValue('/en/admin/tours');
      mockUseNavigation.mockReturnValue({
        isPending: true,
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn(),
      });

      render(
        <AdminLayoutClient locale="en" dictionary={mockDictionary}>
          <div>Test Content</div>
        </AdminLayoutClient>
      );
      expect(screen.getByTestId('tours-skeleton')).toBeInTheDocument();
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
    });

    it('should show bookings skeleton when pathname includes /admin/bookings and pending', () => {
      mockUsePathname.mockReturnValue('/en/admin/bookings');
      mockUseNavigation.mockReturnValue({
        isPending: true,
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn(),
      });

      render(
        <AdminLayoutClient locale="en" dictionary={mockDictionary}>
          <div>Test Content</div>
        </AdminLayoutClient>
      );
      expect(screen.getByTestId('bookings-skeleton')).toBeInTheDocument();
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
    });

    it('should show default loading when pathname does not match known routes and pending', () => {
      mockUsePathname.mockReturnValue('/en/admin/unknown');
      mockUseNavigation.mockReturnValue({
        isPending: true,
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn(),
      });

      render(
        <AdminLayoutClient locale="en" dictionary={mockDictionary}>
          <div>Test Content</div>
        </AdminLayoutClient>
      );
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
    });
  });

  describe('Pathname Matching', () => {
    it('should match tours pathname with nested routes', () => {
      mockUsePathname.mockReturnValue('/en/admin/tours/123');
      mockUseNavigation.mockReturnValue({
        isPending: true,
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn(),
      });

      render(
        <AdminLayoutClient locale="en" dictionary={mockDictionary}>
          <div>Test</div>
        </AdminLayoutClient>
      );
      expect(screen.getByTestId('tours-skeleton')).toBeInTheDocument();
    });

    it('should match bookings pathname with nested routes', () => {
      mockUsePathname.mockReturnValue('/en/admin/bookings/456');
      mockUseNavigation.mockReturnValue({
        isPending: true,
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn(),
      });

      render(
        <AdminLayoutClient locale="en" dictionary={mockDictionary}>
          <div>Test</div>
        </AdminLayoutClient>
      );
      expect(screen.getByTestId('bookings-skeleton')).toBeInTheDocument();
    });
  });

  describe('Locale Prop', () => {
    it('should pass locale to Sidebar', () => {
      mockUsePathname.mockReturnValue('/vi/admin/bookings');
      render(
        <AdminLayoutClient locale="vi" dictionary={mockDictionary}>
          <div>Test</div>
        </AdminLayoutClient>
      );
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should have correct layout classes', () => {
      mockUsePathname.mockReturnValue('/en/admin/bookings');
      const { container } = render(
        <AdminLayoutClient locale="en" dictionary={mockDictionary}>
          <div>Test</div>
        </AdminLayoutClient>
      );
      const layout = container.querySelector('.min-h-screen');
      expect(layout).toBeInTheDocument();
      expect(layout).toHaveClass('bg-slate-50', 'flex');
    });
  });
});
