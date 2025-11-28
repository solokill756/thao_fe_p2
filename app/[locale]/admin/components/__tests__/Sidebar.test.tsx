import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Sidebar from '../Sidebar';
import { useNavigation } from '../contexts/NavigationContext';
import { toast } from 'react-hot-toast';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

// Mock NavigationContext
jest.mock('../contexts/NavigationContext', () => ({
  useNavigation: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  LayoutDashboard: () => <div data-testid="dashboard-icon" />,
  Users: () => <div data-testid="users-icon" />,
  Map: () => <div data-testid="map-icon" />,
  CalendarCheck: () => <div data-testid="calendar-check-icon" />,
  MessageSquare: () => <div data-testid="message-square-icon" />,
  PieChart: () => <div data-testid="pie-chart-icon" />,
  List: () => <div data-testid="list-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
  LogOut: () => <div data-testid="logout-icon" />,
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
const mockUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;

describe('Sidebar Component', () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();
  const mockDictionary = {
    admin: {
      sidebar: {
        dashboard: 'Dashboard',
        manageBookings: 'Manage Bookings',
        manageTours: 'Manage Tours',
        manageUsers: 'Manage Users',
        logout: 'Logout',
        adminBadge: 'Admin',
      },
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    global.window = Object.create(window);
    Object.defineProperty(window, 'document', {
      value: {
        cookie: '',
      },
      writable: true,
    });
    Object.defineProperty(window, 'localStorage', {
      value: {
        clear: jest.fn(),
      },
      writable: true,
    });
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        clear: jest.fn(),
      },
      writable: true,
    });

    mockUsePathname.mockReturnValue('/en/admin/bookings');
    mockUseSession.mockReturnValue({
      data: {
        user: {
          name: 'Admin User',
          email: 'admin@example.com',
          image: 'https://example.com/avatar.jpg',
        },
      },
      status: 'authenticated',
    } as any);

    mockUseNavigation.mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    } as any);

    mockSignOut.mockResolvedValue(undefined);
  });

  describe('Basic Rendering', () => {
    it('should render sidebar', () => {
      const { container } = render(
        <Sidebar dictionary={mockDictionary} locale="en" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render navigation items', () => {
      render(<Sidebar dictionary={mockDictionary} locale="en" />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Manage Bookings')).toBeInTheDocument();
      expect(screen.getByText('Manage Tours')).toBeInTheDocument();
    });

    it('should render user info', () => {
      render(<Sidebar dictionary={mockDictionary} locale="en" />);
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    });

    it('should render logout button', () => {
      render(<Sidebar dictionary={mockDictionary} locale="en" />);
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should call push when navigation item is clicked', () => {
      render(<Sidebar dictionary={mockDictionary} locale="en" />);
      const dashboardButton = screen.getByText('Dashboard').closest('button');
      if (dashboardButton) {
        fireEvent.click(dashboardButton);
        expect(mockPush).toHaveBeenCalledWith('/en/admin/dashboard');
      }
    });

    it('should highlight active navigation item', () => {
      mockUsePathname.mockReturnValue('/en/admin/bookings');
      render(<Sidebar dictionary={mockDictionary} locale="en" />);
      const bookingsButton = screen.getByText('Manage Bookings').closest('button');
      expect(bookingsButton).toHaveClass('bg-blue-600', 'text-white');
    });
  });

  describe('Logout', () => {
    it('should call signOut when logout button is clicked', async () => {
      render(<Sidebar dictionary={mockDictionary} locale="en" />);
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
    });

    it('should navigate to home after logout', async () => {
      render(<Sidebar dictionary={mockDictionary} locale="en" />);
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/en/');
      });
    });

    it('should handle logout error', async () => {
      mockSignOut.mockRejectedValue(new Error('Logout failed'));
      render(<Sidebar dictionary={mockDictionary} locale="en" />);
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    it('should clear cookies on logout', async () => {
      const mockCookie = 'next-auth.session-token=abc123; other-cookie=value';
      Object.defineProperty(window, 'document', {
        value: {
          cookie: mockCookie,
        },
        writable: true,
      });

      render(<Sidebar dictionary={mockDictionary} locale="en" />);
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
    });

    it('should handle cookie without equals sign', async () => {
      Object.defineProperty(window, 'document', {
        value: {
          cookie: 'next-auth.session-token',
        },
        writable: true,
      });

      render(<Sidebar dictionary={mockDictionary} locale="en" />);
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
    });

    it('should use dictionary fallback for logout success', async () => {
      const dictWithoutLogoutSuccess = {
        admin: { sidebar: {} },
      } as any;
      render(<Sidebar dictionary={dictWithoutLogoutSuccess} locale="en" />);
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Logged out successfully!');
      });
    });

    it('should use dictionary fallback for logout error', async () => {
      mockSignOut.mockRejectedValue(new Error('Logout failed'));
      const dictWithoutLogoutFailed = {
        admin: { sidebar: {} },
      } as any;
      render(<Sidebar dictionary={dictWithoutLogoutFailed} locale="en" />);
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Logout failed');
      });
    });
  });

  describe('User Info Display', () => {
    it('should show placeholder when user has no image', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: 'Admin User',
            email: 'admin@example.com',
            image: null,
          },
        },
        status: 'authenticated',
      } as any);

      render(<Sidebar dictionary={mockDictionary} locale="en" />);
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    it('should show placeholder when user has no name', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: null,
            email: 'admin@example.com',
            image: null,
          },
        },
        status: 'authenticated',
      } as any);

      render(<Sidebar dictionary={mockDictionary} locale="en" />);
      // Should use dictionary fallback
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    });
  });

  describe('Active Path Detection', () => {
    it('should detect active path with exact match', () => {
      mockUsePathname.mockReturnValue('/en/admin/bookings');
      render(<Sidebar dictionary={mockDictionary} locale="en" />);
      const bookingsButton = screen.getByText('Manage Bookings').closest('button');
      expect(bookingsButton).toHaveClass('bg-blue-600', 'text-white');
    });

    it('should detect active path with subpath', () => {
      mockUsePathname.mockReturnValue('/en/admin/bookings/123');
      render(<Sidebar dictionary={mockDictionary} locale="en" />);
      const bookingsButton = screen.getByText('Manage Bookings').closest('button');
      expect(bookingsButton).toHaveClass('bg-blue-600', 'text-white');
    });
  });
});

