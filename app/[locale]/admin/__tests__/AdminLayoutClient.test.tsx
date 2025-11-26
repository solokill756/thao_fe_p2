import React from 'react';
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import AdminLayoutClient from '../AdminLayoutClient';
import { useNavigation } from '../contexts/NavigationContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock NavigationContext
jest.mock('../contexts/NavigationContext', () => ({
  useNavigation: jest.fn(),
}));

// Mock Sidebar
jest.mock('../components/Sidebar', () => {
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
const mockUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;

describe('AdminLayoutClient Component', () => {
  const mockDictionary = {} as any;
  const mockChildren = <div data-testid="children">Children</div>;

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
        <AdminLayoutClient
          locale="en"
          dictionary={mockDictionary}
        >
          {mockChildren}
        </AdminLayoutClient>
      );
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    it('should render children when not pending', () => {
      mockUsePathname.mockReturnValue('/en/admin/bookings');
      render(
        <AdminLayoutClient
          locale="en"
          dictionary={mockDictionary}
        >
          {mockChildren}
        </AdminLayoutClient>
      );
      expect(screen.getByTestId('children')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show tours skeleton when navigating to tours page', () => {
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
        <AdminLayoutClient
          locale="en"
          dictionary={mockDictionary}
        >
          {mockChildren}
        </AdminLayoutClient>
      );
      expect(screen.getByTestId('tours-skeleton')).toBeInTheDocument();
    });

    it('should show bookings skeleton when navigating to bookings page', () => {
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
        <AdminLayoutClient
          locale="en"
          dictionary={mockDictionary}
        >
          {mockChildren}
        </AdminLayoutClient>
      );
      expect(screen.getByTestId('bookings-skeleton')).toBeInTheDocument();
    });

    it('should show default loading when navigating to other admin pages', () => {
      mockUsePathname.mockReturnValue('/en/admin/dashboard');
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
        <AdminLayoutClient
          locale="en"
          dictionary={mockDictionary}
        >
          {mockChildren}
        </AdminLayoutClient>
      );
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});

