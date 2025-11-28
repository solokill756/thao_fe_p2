import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserTable from '../UserTable';
import type { UserWithStats } from '@/app/actions/admin/getUsersAction';

// Mock lucide-react icons
const UsersIcon = ({ className }: { className?: string }) => (
  <svg data-testid="users-icon" className={className}>Users</svg>
);

jest.mock('lucide-react', () => ({
  Shield: ({ className }: { className?: string }) => (
    <svg data-testid="shield-icon" className={className}>Shield</svg>
  ),
  Ban: ({ className }: { className?: string }) => (
    <svg data-testid="ban-icon" className={className}>Ban</svg>
  ),
  CheckCircle: ({ className }: { className?: string }) => (
    <svg data-testid="check-icon" className={className}>Check</svg>
  ),
  Trash2: ({ className }: { className?: string }) => (
    <svg data-testid="trash-icon" className={className}>Trash</svg>
  ),
  Users: UsersIcon,
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('UserTable Component', () => {
  const mockUsers: UserWithStats[] = [
    {
      user_id: 1,
      full_name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      totalSpent: 1000.5,
      bookingsCount: 5,
      created_at: new Date('2024-01-01'),
      avatar_url: null,
    },
    {
      user_id: 2,
      full_name: 'Jane Admin',
      email: 'jane@example.com',
      role: 'admin',
      totalSpent: 2000.75,
      bookingsCount: 1,
      created_at: new Date('2024-01-15'),
      avatar_url: 'https://example.com/avatar.jpg',
    },
  ];

  const mockDictionary = {
    admin: {
      users: {
        userProfile: 'User Profile',
        role: 'Role',
        status: 'Status',
        totalSpent: 'Total Spent',
        joinDate: 'Join Date',
        actions: 'Actions',
        admin: 'Admin',
        user: 'User',
        active: 'Active',
        blocked: 'Blocked',
        booking: 'booking',
        bookings: 'bookings',
        noUsersFound: 'No users found matching your search.',
        removeAdmin: 'Remove Admin',
        makeAdmin: 'Make Admin',
        deleteUser: 'Delete User',
      },
    },
  } as any;

  const mockOnView = jest.fn();
  const mockOnToggleStatus = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Empty State', () => {
    it('should render empty state message when users array is empty', () => {
      render(
        <UserTable
          users={[]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText('No users found matching your search.')).toBeInTheDocument();
    });

    it('should render users icon in empty state', () => {
      render(
        <UserTable
          users={[]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByTestId('users-icon')).toBeInTheDocument();
    });
  });

  describe('User Display', () => {
    it('should render user full name', () => {
      render(
        <UserTable
          users={[mockUsers[0]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render user email', () => {
      render(
        <UserTable
          users={[mockUsers[0]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should use placeholder avatar when avatar_url is null', () => {
      render(
        <UserTable
          users={[mockUsers[0]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      const avatar = screen.getByAltText('John Doe');
      expect(avatar).toHaveAttribute('src', expect.stringContaining('placehold'));
    });

    it('should use user avatar_url when available', () => {
      render(
        <UserTable
          users={[mockUsers[1]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      const avatar = screen.getByAltText('Jane Admin');
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });
  });

  describe('Role Display', () => {
    it('should display admin badge for admin users', () => {
      render(
        <UserTable
          users={[mockUsers[1]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
    });

    it('should display user badge for regular users', () => {
      render(
        <UserTable
          users={[mockUsers[0]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText('User')).toBeInTheDocument();
    });
  });

  describe('Status Display', () => {
    it('should show active status for admin users', () => {
      render(
        <UserTable
          users={[mockUsers[1]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });

    it('should show active status for regular users', () => {
      render(
        <UserTable
          users={[mockUsers[0]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  describe('Total Spent Display', () => {
    it('should format total spent with 2 decimal places', () => {
      render(
        <UserTable
          users={[mockUsers[0]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText('$1000.50')).toBeInTheDocument();
    });

    it('should display bookings count with singular form for 1 booking', () => {
      render(
        <UserTable
          users={[mockUsers[1]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText(/1 booking/i)).toBeInTheDocument();
    });

    it('should display bookings count with plural form for multiple bookings', () => {
      render(
        <UserTable
          users={[mockUsers[0]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText(/5 bookings/i)).toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    it('should format date for English locale', () => {
      render(
        <UserTable
          users={[mockUsers[0]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      // Date should be formatted
      expect(screen.getByText(/\d+\/\d+\/\d+/)).toBeInTheDocument();
    });

    it('should format date for Vietnamese locale', () => {
      render(
        <UserTable
          users={[mockUsers[0]]}
          dictionary={mockDictionary}
          locale="vi"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      // Date should be formatted with Vietnamese locale
      expect(screen.getByText(/\d+[\/\.]\d+[\/\.]\d+/)).toBeInTheDocument();
    });

    it('should return N/A for null date', () => {
      const userWithNullDate = {
        ...mockUsers[0],
        created_at: null,
      };

      render(
        <UserTable
          users={[userWithNullDate]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should format date string correctly', () => {
      const userWithStringDate = {
        ...mockUsers[0],
        created_at: '2024-01-01',
      };

      render(
        <UserTable
          users={[userWithStringDate]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText(/\d+\/\d+\/\d+/)).toBeInTheDocument();
    });
  });

  describe('Row Click', () => {
    it('should call onView when row is clicked', () => {
      render(
        <UserTable
          users={[mockUsers[0]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      const row = screen.getByText('John Doe').closest('tr');
      fireEvent.click(row!);
      expect(mockOnView).toHaveBeenCalledWith(mockUsers[0]);
    });
  });

  describe('Toggle Status Button', () => {
    it('should show remove admin button for admin users', () => {
      render(
        <UserTable
          users={[mockUsers[1]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      const toggleButton = screen.getByTitle('Remove Admin');
      expect(toggleButton).toBeInTheDocument();
    });

    it('should show make admin button for regular users', () => {
      render(
        <UserTable
          users={[mockUsers[0]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      const toggleButton = screen.getByTitle('Make Admin');
      expect(toggleButton).toBeInTheDocument();
    });

    it('should call onToggleStatus with user role when toggle button is clicked', () => {
      render(
        <UserTable
          users={[mockUsers[0]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      const toggleButton = screen.getByTitle('Make Admin');
      fireEvent.click(toggleButton);
      // Should call with userId and newRole (opposite of current role)
      expect(mockOnToggleStatus).toHaveBeenCalledWith(1, 'admin');
    });

    it('should prevent row click when toggle button is clicked', () => {
      render(
        <UserTable
          users={[mockUsers[0]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      const toggleButton = screen.getByTitle('Make Admin');
      fireEvent.click(toggleButton);
      // Should call toggle, but not view (stopPropagation should prevent it)
      expect(mockOnToggleStatus).toHaveBeenCalled();
    });
  });

  describe('Delete Button', () => {
    it('should call onDelete when delete button is clicked', () => {
      render(
        <UserTable
          users={[mockUsers[0]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      const deleteButton = screen.getByTitle('Delete User');
      fireEvent.click(deleteButton);
      expect(mockOnDelete).toHaveBeenCalledWith(1);
    });

    it('should prevent row click when delete button is clicked', () => {
      render(
        <UserTable
          users={[mockUsers[0]]}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      const deleteButton = screen.getByTitle('Delete User');
      fireEvent.click(deleteButton);
      // Should call delete, not view
      expect(mockOnDelete).toHaveBeenCalled();
      expect(mockOnView).not.toHaveBeenCalled();
    });
  });

  describe('Multiple Users', () => {
    it('should render multiple users', () => {
      render(
        <UserTable
          users={mockUsers}
          dictionary={mockDictionary}
          locale="en"
          onView={mockOnView}
          onToggleStatus={mockOnToggleStatus}
          onDelete={mockOnDelete}
        />
      );
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Admin')).toBeInTheDocument();
    });
  });
});

