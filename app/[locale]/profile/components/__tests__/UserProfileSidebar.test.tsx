import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserProfileSidebar from '../UserProfileSidebar';
import { useUserProfileStore } from '@/app/lib/stores/userProfileStore';
import { USER_PROFILE_CONSTANTS } from '@/app/lib/constants';

// Mock useUserProfileStore
jest.mock('@/app/lib/stores/userProfileStore', () => ({
  useUserProfileStore: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  User: () => <div data-testid="user-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  LogOut: () => <div data-testid="logout-icon" />,
}));

const mockUseUserProfileStore = useUserProfileStore as jest.MockedFunction<
  typeof useUserProfileStore
>;

describe('UserProfileSidebar Component', () => {
  const mockOnTabChange = jest.fn();
  const mockOnLogout = jest.fn();
  const mockDictionary = {
    useProfile: {
      myBookings: 'My Bookings',
      profileSettings: 'Profile Settings',
      logout: 'Logout',
      memberSince: 'Member since',
    },
  } as any;

  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://example.com/avatar.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUserProfileStore.mockReturnValue({
      name: null,
      image: null,
      email: null,
      setUser: jest.fn(),
      clearUser: jest.fn(),
    } as any);
  });

  describe('Basic Rendering', () => {
    it('should render user name', () => {
      render(
        <UserProfileSidebar
          user={mockUser}
          dictionary={mockDictionary}
          activeTab="bookings"
          onTabChange={mockOnTabChange}
          onLogout={mockOnLogout}
        />
      );
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render user avatar when image is available', () => {
      render(
        <UserProfileSidebar
          user={mockUser}
          dictionary={mockDictionary}
          activeTab="bookings"
          onTabChange={mockOnTabChange}
          onLogout={mockOnLogout}
        />
      );
      const avatar = screen.getByAltText('Avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should render initial letter when image is not available', () => {
      const userWithoutImage = { ...mockUser, image: null };
      render(
        <UserProfileSidebar
          user={userWithoutImage}
          dictionary={mockDictionary}
          activeTab="bookings"
          onTabChange={mockOnTabChange}
          onLogout={mockOnLogout}
        />
      );
      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('should render navigation buttons', () => {
      render(
        <UserProfileSidebar
          user={mockUser}
          dictionary={mockDictionary}
          activeTab="bookings"
          onTabChange={mockOnTabChange}
          onLogout={mockOnLogout}
        />
      );
      expect(screen.getByText('My Bookings')).toBeInTheDocument();
      expect(screen.getByText('Profile Settings')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('should highlight active tab (bookings)', () => {
      render(
        <UserProfileSidebar
          user={mockUser}
          dictionary={mockDictionary}
          activeTab="bookings"
          onTabChange={mockOnTabChange}
          onLogout={mockOnLogout}
        />
      );
      const bookingsButton = screen.getByText('My Bookings').closest('button');
      expect(bookingsButton).toHaveClass('bg-blue-50', 'text-blue-600');
    });

    it('should highlight active tab (settings)', () => {
      render(
        <UserProfileSidebar
          user={mockUser}
          dictionary={mockDictionary}
          activeTab="settings"
          onTabChange={mockOnTabChange}
          onLogout={mockOnLogout}
        />
      );
      const settingsButton = screen
        .getByText('Profile Settings')
        .closest('button');
      expect(settingsButton).toHaveClass('bg-blue-50', 'text-blue-600');
    });

    it('should call onTabChange when bookings button is clicked', () => {
      render(
        <UserProfileSidebar
          user={mockUser}
          dictionary={mockDictionary}
          activeTab="settings"
          onTabChange={mockOnTabChange}
          onLogout={mockOnLogout}
        />
      );
      const bookingsButton = screen.getByText('My Bookings').closest('button');
      fireEvent.click(bookingsButton!);
      expect(mockOnTabChange).toHaveBeenCalledWith('bookings');
    });

    it('should call onTabChange when settings button is clicked', () => {
      render(
        <UserProfileSidebar
          user={mockUser}
          dictionary={mockDictionary}
          activeTab="bookings"
          onTabChange={mockOnTabChange}
          onLogout={mockOnLogout}
        />
      );
      const settingsButton = screen
        .getByText('Profile Settings')
        .closest('button');
      fireEvent.click(settingsButton!);
      expect(mockOnTabChange).toHaveBeenCalledWith('settings');
    });
  });

  describe('Logout', () => {
    it('should call onLogout when logout button is clicked', () => {
      render(
        <UserProfileSidebar
          user={mockUser}
          dictionary={mockDictionary}
          activeTab="bookings"
          onTabChange={mockOnTabChange}
          onLogout={mockOnLogout}
        />
      );
      const logoutButton = screen.getByText('Logout').closest('button');
      fireEvent.click(logoutButton!);
      expect(mockOnLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Store Integration', () => {
    it('should use store name when available', () => {
      mockUseUserProfileStore.mockReturnValue({
        name: 'Store Name',
        image: null,
        email: null,
        setUser: jest.fn(),
        clearUser: jest.fn(),
      } as any);

      render(
        <UserProfileSidebar
          user={mockUser}
          dictionary={mockDictionary}
          activeTab="bookings"
          onTabChange={mockOnTabChange}
          onLogout={mockOnLogout}
        />
      );
      expect(screen.getByText('Store Name')).toBeInTheDocument();
    });

    it('should use store image when available', () => {
      mockUseUserProfileStore.mockReturnValue({
        name: null,
        image: 'https://store.com/avatar.jpg',
        email: null,
        setUser: jest.fn(),
        clearUser: jest.fn(),
      } as any);

      render(
        <UserProfileSidebar
          user={mockUser}
          dictionary={mockDictionary}
          activeTab="bookings"
          onTabChange={mockOnTabChange}
          onLogout={mockOnLogout}
        />
      );
      const avatar = screen.getByAltText('Avatar');
      expect(avatar).toHaveAttribute('src', 'https://store.com/avatar.jpg');
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', () => {
      const incompleteDict = { useProfile: {} } as any;
      render(
        <UserProfileSidebar
          user={mockUser}
          dictionary={incompleteDict}
          activeTab="bookings"
          onTabChange={mockOnTabChange}
          onLogout={mockOnLogout}
        />
      );
      expect(
        screen.getByText(USER_PROFILE_CONSTANTS.MY_BOOKINGS)
      ).toBeInTheDocument();
      expect(
        screen.getByText(USER_PROFILE_CONSTANTS.PROFILE_SETTINGS)
      ).toBeInTheDocument();
    });
  });
});

