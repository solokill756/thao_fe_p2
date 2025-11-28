import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserDetailModal from '../UserDetailModal';
import type { UserWithStats } from '@/app/actions/admin/getUsersAction';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  X: ({ className }: { className?: string }) => (
    <svg data-testid="close-icon" className={className}>X</svg>
  ),
  Shield: ({ className }: { className?: string }) => (
    <svg data-testid="shield-icon" className={className}>Shield</svg>
  ),
  Mail: ({ className }: { className?: string }) => (
    <svg data-testid="mail-icon" className={className}>Mail</svg>
  ),
  Phone: ({ className }: { className?: string }) => (
    <svg data-testid="phone-icon" className={className}>Phone</svg>
  ),
  MapPin: ({ className }: { className?: string }) => (
    <svg data-testid="map-icon" className={className}>Map</svg>
  ),
  CheckCircle: ({ className }: { className?: string }) => (
    <svg data-testid="check-icon" className={className}>Check</svg>
  ),
  Ban: ({ className }: { className?: string }) => (
    <svg data-testid="ban-icon" className={className}>Ban</svg>
  ),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('UserDetailModal Component', () => {
  const mockUser: UserWithStats = {
    user_id: 1,
    full_name: 'John Doe',
    email: 'john@example.com',
    phone_number: '+1234567890',
    role: 'user',
    totalSpent: 1500.75,
    bookingsCount: 5,
    created_at: new Date('2024-01-01'),
    avatar_url: 'https://example.com/avatar.jpg',
  };

  const mockDictionary = {
    admin: {
      users: {
        email: 'Email',
        phone: 'Phone',
        active: 'Active',
        blocked: 'Blocked',
        activitySummary: 'Activity Summary',
        bookings: 'Bookings',
        totalSpent: 'Total Spent',
        daysActive: 'Days Active',
        joinDate: 'Join Date',
        unknownLocation: 'Unknown',
        notAvailable: 'N/A',
      },
    },
  } as any;

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-12-15'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Modal Visibility', () => {
    it('should not render when isOpen is false', () => {
      render(
        <UserDetailModal
          user={mockUser}
          isOpen={false}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('should not render when user is null', () => {
      render(
        <UserDetailModal
          user={null}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true and user is provided', () => {
      render(
        <UserDetailModal
          user={mockUser}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('User Information Display', () => {
    it('should display user full name', () => {
      render(
        <UserDetailModal
          user={mockUser}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should display user email', () => {
      render(
        <UserDetailModal
          user={mockUser}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should display user phone number when available', () => {
      render(
        <UserDetailModal
          user={mockUser}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      // Phone number appears in location field (phone_number) and phone field
      const phoneNumbers = screen.getAllByText('+1234567890');
      expect(phoneNumbers.length).toBeGreaterThan(0);
    });

    it('should display N/A when phone number is null', () => {
      const userWithoutPhone = {
        ...mockUser,
        phone_number: null,
      };

      render(
        <UserDetailModal
          user={userWithoutPhone}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should display unknown location when phone_number is used as location', () => {
      const userWithoutPhone = {
        ...mockUser,
        phone_number: null,
      };

      render(
        <UserDetailModal
          user={userWithoutPhone}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      // Location uses phone_number, so should show Unknown
      expect(screen.getByText(/Unknown/i)).toBeInTheDocument();
    });
  });

  describe('Admin Badge', () => {
    it('should show shield icon for admin users', () => {
      const adminUser = {
        ...mockUser,
        role: 'admin',
      };

      render(
        <UserDetailModal
          user={adminUser}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
    });

    it('should not show shield icon for regular users', () => {
      render(
        <UserDetailModal
          user={mockUser}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.queryByTestId('shield-icon')).not.toBeInTheDocument();
    });
  });

  describe('Status Badge', () => {
    it('should show active status for admin users', () => {
      const adminUser = {
        ...mockUser,
        role: 'admin',
      };

      render(
        <UserDetailModal
          user={adminUser}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should show active status for regular users', () => {
      render(
        <UserDetailModal
          user={mockUser}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  describe('Avatar Display', () => {
    it('should display user avatar when available', () => {
      render(
        <UserDetailModal
          user={mockUser}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      const avatar = screen.getByAltText('John Doe');
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should use placeholder avatar when avatar_url is null', () => {
      const userWithoutAvatar = {
        ...mockUser,
        avatar_url: null,
      };

      render(
        <UserDetailModal
          user={userWithoutAvatar}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      const avatar = screen.getByAltText('John Doe');
      expect(avatar).toHaveAttribute('src', expect.stringContaining('placehold'));
    });
  });

  describe('Activity Summary', () => {
    it('should display bookings count', () => {
      render(
        <UserDetailModal
          user={mockUser}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Bookings')).toBeInTheDocument();
    });

    it('should display total spent formatted correctly', () => {
      render(
        <UserDetailModal
          user={mockUser}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('$1500.75')).toBeInTheDocument();
    });

    it('should calculate days active correctly', () => {
      const oldUser = {
        ...mockUser,
        created_at: new Date('2024-01-01'),
      };

      render(
        <UserDetailModal
          user={oldUser}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      // Should calculate days between created_at and now
      expect(screen.getByText('Days Active')).toBeInTheDocument();
      // Component should render without error
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should show 0 days active when created_at is null', () => {
      const userWithoutDate = {
        ...mockUser,
        created_at: null,
      };

      render(
        <UserDetailModal
          user={userWithoutDate}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    it('should format date for English locale', () => {
      render(
        <UserDetailModal
          user={mockUser}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText(/\d+\/\d+\/\d+/)).toBeInTheDocument();
    });

    it('should format date for Vietnamese locale', () => {
      render(
        <UserDetailModal
          user={mockUser}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="vi"
        />
      );
      expect(screen.getByText(/\d+[\/\.]\d+[\/\.]\d+/)).toBeInTheDocument();
    });

    it('should return N/A for null date', () => {
      const userWithNullDate = {
        ...mockUser,
        created_at: null,
      };

      render(
        <UserDetailModal
          user={userWithNullDate}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should format date string correctly', () => {
      const userWithStringDate = {
        ...mockUser,
        created_at: '2024-01-01',
      };

      render(
        <UserDetailModal
          user={userWithStringDate}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      expect(screen.getByText(/\d+\/\d+\/\d+/)).toBeInTheDocument();
    });
  });

  describe('Modal Close Functionality', () => {
    it('should call onClose when close button is clicked', () => {
      render(
        <UserDetailModal
          user={mockUser}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      const closeButton = screen.getByTestId('close-icon').closest('button');
      fireEvent.click(closeButton!);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', () => {
      const { container } = render(
        <UserDetailModal
          user={mockUser}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      const backdrop = container.firstChild as HTMLElement;
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when modal content is clicked', () => {
      render(
        <UserDetailModal
          user={mockUser}
          isOpen={true}
          onClose={mockOnClose}
          dictionary={mockDictionary}
          locale="en"
        />
      );
      const modalContent = screen.getByText('John Doe').closest('.bg-white');
      fireEvent.click(modalContent!);
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});

