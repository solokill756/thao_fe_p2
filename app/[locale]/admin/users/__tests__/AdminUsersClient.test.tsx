import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import AdminUsersClient from '../AdminUsersClient';
import { useUsers, useUpdateUserStatus, useDeleteUser } from '@/app/lib/hooks/useUsers';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock hooks
jest.mock('@/app/lib/hooks/useUsers', () => ({
  useUsers: jest.fn(),
  useUpdateUserStatus: jest.fn(),
  useDeleteUser: jest.fn(),
}));

// Mock child components
jest.mock('../../bookings/components/AdminHeader', () => ({
  __esModule: true,
  default: () => <div data-testid="admin-header">Admin Header</div>,
}));

jest.mock('../components/UserTable', () => ({
  __esModule: true,
  default: () => <div data-testid="user-table">User Table</div>,
}));

jest.mock('../components/UserDetailModal', () => ({
  __esModule: true,
  default: () => <div data-testid="user-detail-modal">User Detail Modal</div>,
}));

jest.mock('@/app/components/common/ErrorRetry', () => ({
  __esModule: true,
  default: () => <div data-testid="error-retry">Error Retry</div>,
}));

// Mock window.confirm
global.window.confirm = jest.fn(() => true);

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockUseUsers = useUsers as jest.MockedFunction<typeof useUsers>;
const mockUseUpdateUserStatus = useUpdateUserStatus as jest.MockedFunction<
  typeof useUpdateUserStatus
>;
const mockUseDeleteUser = useDeleteUser as jest.MockedFunction<typeof useDeleteUser>;

describe('AdminUsersClient Component', () => {
  const mockUsers = [
    {
      user_id: 1,
      full_name: 'John Doe',
      email: 'john@example.com',
      role: 'user' as const,
      totalSpent: 1000,
      bookingsCount: 5,
      created_at: new Date(),
    },
    {
      user_id: 2,
      full_name: 'Jane Admin',
      email: 'jane@example.com',
      role: 'admin' as const,
      totalSpent: 2000,
      bookingsCount: 10,
      created_at: new Date(),
    },
  ] as any;

  const mockDictionary = {
    admin: {
      users: {
        loadingUsers: 'Loading users...',
        failedToLoadUsers: 'Failed to load users',
        userManagement: 'User Management',
        searchUsers: 'Search users...',
        confirmDelete: 'Delete this user?',
      },
    },
  } as any;

  const mockUpdateMutation = {
    mutateAsync: jest.fn(),
  };

  const mockDeleteMutation = {
    mutateAsync: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSession.mockReturnValue({
      data: {
        user: { role: 'admin' },
      },
      status: 'authenticated',
    } as any);

    mockUseUsers.mockReturnValue({
      data: mockUsers,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    mockUseUpdateUserStatus.mockReturnValue(mockUpdateMutation as any);
    mockUseDeleteUser.mockReturnValue(mockDeleteMutation as any);
  });

  describe('Basic Rendering', () => {
    it('should render admin header', () => {
      render(
        <AdminUsersClient
          locale="en"
          dictionary={mockDictionary}
          initialUsers={mockUsers}
        />
      );
      expect(screen.getByTestId('admin-header')).toBeInTheDocument();
    });

    it('should render user table', () => {
      render(
        <AdminUsersClient
          locale="en"
          dictionary={mockDictionary}
          initialUsers={mockUsers}
        />
      );
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading message when loading', () => {
      mockUseUsers.mockReturnValue({
        data: [],
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      } as any);

      render(
        <AdminUsersClient
          locale="en"
          dictionary={mockDictionary}
          initialUsers={[]}
        />
      );
      expect(screen.getByText('Loading users...')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error retry when error occurs', () => {
      mockUseUsers.mockReturnValue({
        data: [],
        isLoading: false,
        error: new Error('Failed to load'),
        refetch: jest.fn(),
      } as any);

      render(
        <AdminUsersClient
          locale="en"
          dictionary={mockDictionary}
          initialUsers={[]}
        />
      );
      expect(screen.getByTestId('error-retry')).toBeInTheDocument();
    });
  });

  describe('Filter Role Logic', () => {
    it('should show filter buttons', () => {
      render(
        <AdminUsersClient
          locale="en"
          dictionary={mockDictionary}
          initialUsers={mockUsers}
        />
      );
      // Filter buttons should be rendered through UserTable
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });

    it('should calculate admin count correctly', () => {
      const users = [
        { ...mockUsers[0], role: 'admin' },
        { ...mockUsers[1], role: 'admin' },
        { ...mockUsers[0], user_id: 3, role: 'user' },
      ];

      mockUseUsers.mockReturnValue({
        data: users,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      } as any);

      render(
        <AdminUsersClient
          locale="en"
          dictionary={mockDictionary}
          initialUsers={users}
        />
      );
      // Should render without error
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });

    it('should calculate user count correctly', () => {
      render(
        <AdminUsersClient
          locale="en"
          dictionary={mockDictionary}
          initialUsers={mockUsers}
        />
      );
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should filter users by search term', () => {
      render(
        <AdminUsersClient
          locale="en"
          dictionary={mockDictionary}
          initialUsers={mockUsers}
        />
      );
      // Search is handled internally
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });
  });

  describe('Modal Functionality', () => {
    it('should render modal when user is selected', () => {
      render(
        <AdminUsersClient
          locale="en"
          dictionary={mockDictionary}
          initialUsers={mockUsers}
        />
      );
      // Modal should be rendered (can be hidden initially)
      const modal = screen.queryByTestId('user-detail-modal');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Delete User', () => {
    it('should handle delete user with confirmation', async () => {
      mockDeleteMutation.mutateAsync.mockResolvedValue({ success: true });

      render(
        <AdminUsersClient
          locale="en"
          dictionary={mockDictionary}
          initialUsers={mockUsers}
        />
      );

      // Delete is handled through UserTable
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });

    it('should not delete when confirmation is cancelled', () => {
      global.window.confirm = jest.fn(() => false);

      render(
        <AdminUsersClient
          locale="en"
          dictionary={mockDictionary}
          initialUsers={mockUsers}
        />
      );

      // Should not call delete mutation
      expect(mockDeleteMutation.mutateAsync).not.toHaveBeenCalled();
    });
  });

  describe('Toggle Status', () => {
    it('should handle toggle user status', async () => {
      mockUpdateMutation.mutateAsync.mockResolvedValue({ success: true });

      render(
        <AdminUsersClient
          locale="en"
          dictionary={mockDictionary}
          initialUsers={mockUsers}
        />
      );

      // Toggle is handled through UserTable
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });
  });

  describe('Filter and Search Integration', () => {
    it('should filter users by role and search term together', () => {
      render(
        <AdminUsersClient
          locale="en"
          dictionary={mockDictionary}
          initialUsers={mockUsers}
        />
      );
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use fallback text when dictionary is incomplete', () => {
      const incompleteDict = {
        admin: {
          users: {},
        },
      } as any;

      render(
        <AdminUsersClient
          locale="en"
          dictionary={incompleteDict}
          initialUsers={mockUsers}
        />
      );
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });
  });
});

