import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession, signOut } from 'next-auth/react';
import HeaderAuthSection from '../HeaderAuthSection';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';
import { useUserProfileStore } from '@/app/lib/stores/userProfileStore';
import toast from 'react-hot-toast';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

// Mock useNavigationLoading
jest.mock('@/app/lib/hooks/useNavigationLoading', () => ({
  useNavigationLoading: jest.fn(),
}));

// Mock useUserProfileStore
jest.mock('@/app/lib/stores/userProfileStore', () => ({
  useUserProfileStore: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
const mockUseNavigationLoading = useNavigationLoading as jest.MockedFunction<
  typeof useNavigationLoading
>;
const mockUseUserProfileStore = useUserProfileStore as jest.MockedFunction<
  typeof useUserProfileStore
>;

describe('HeaderAuthSection Component', () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();
  const mockSetUser = jest.fn();
  const mockClearUser = jest.fn();

  const mockDictionary = {
    common: {
      header: {
        getInTouch: 'Get in Touch',
        login: 'Login',
        logout: 'Logout',
        logoutFailed: 'Logout failed',
      },
    },
    useProfile: {
      logoutSuccess: 'Logged out successfully!',
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    global.document = {
      ...global.document,
      cookie: '',
    };
    global.localStorage = {
      removeItem: jest.fn(),
    } as any;
    global.sessionStorage = {
      clear: jest.fn(),
    } as any;

    mockUseNavigationLoading.mockReturnValue({
      isPending: false,
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: mockRefresh,
      prefetch: jest.fn(),
    });

    mockUseUserProfileStore.mockReturnValue({
      name: null,
      image: null,
      email: null,
      setUser: mockSetUser,
      clearUser: mockClearUser,
    } as any);
  });

  describe('When User is Not Logged In', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      } as any);
    });

    it('should render login button', () => {
      render(<HeaderAuthSection locale="en" dictionary={mockDictionary} />);
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('should render get in touch button', () => {
      render(<HeaderAuthSection locale="en" dictionary={mockDictionary} />);
      expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    });

    it('should navigate to auth page on login click', () => {
      render(<HeaderAuthSection locale="en" dictionary={mockDictionary} />);
      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);
      expect(mockPush).toHaveBeenCalledWith('/en/auth');
    });

    it('should disable login button when navigation is pending', () => {
      mockUseNavigationLoading.mockReturnValue({
        isPending: true,
        push: mockPush,
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: mockRefresh,
        prefetch: jest.fn(),
      });

      render(<HeaderAuthSection locale="en" dictionary={mockDictionary} />);
      const loginButton = screen.getByText('Login...');
      expect(loginButton).toBeDisabled();
    });
  });

  describe('When User is Logged In', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: 'John Doe',
            email: 'john@example.com',
            image: 'https://example.com/avatar.jpg',
          },
        },
        status: 'authenticated',
      } as any);

      mockUseUserProfileStore.mockReturnValue({
        name: 'John Doe',
        image: 'https://example.com/avatar.jpg',
        email: 'john@example.com',
        setUser: mockSetUser,
        clearUser: mockClearUser,
      } as any);
    });

    it('should render user name', () => {
      render(<HeaderAuthSection locale="en" dictionary={mockDictionary} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render user avatar image when available', () => {
      render(<HeaderAuthSection locale="en" dictionary={mockDictionary} />);
      const avatar = screen.getByAltText('User Avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should render initial letter when image is not available', () => {
      mockUseUserProfileStore.mockReturnValue({
        name: 'John Doe',
        image: null,
        email: 'john@example.com',
        setUser: mockSetUser,
        clearUser: mockClearUser,
      } as any);

      render(<HeaderAuthSection locale="en" dictionary={mockDictionary} />);
      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('should navigate to profile on avatar click', () => {
      render(<HeaderAuthSection locale="en" dictionary={mockDictionary} />);
      const avatarContainer = screen.getByText('John Doe').closest('div');
      if (avatarContainer) {
        fireEvent.click(avatarContainer);
        expect(mockPush).toHaveBeenCalledWith('/en/profile');
      }
    });

    it('should call logout on logout button click', async () => {
      mockSignOut.mockResolvedValue(undefined);

      render(<HeaderAuthSection locale="en" dictionary={mockDictionary} />);
      const logoutButton = screen.getByTitle('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalledWith({
          redirect: false,
          callbackUrl: '/en/',
        });
      });
    });

    it('should show success toast on successful logout', async () => {
      mockSignOut.mockResolvedValue(undefined);

      render(<HeaderAuthSection locale="en" dictionary={mockDictionary} />);
      const logoutButton = screen.getByTitle('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Logged out successfully!');
      });
    });

    it('should show error toast on logout failure', async () => {
      const error = new Error('Logout failed');
      mockSignOut.mockRejectedValue(error);

      render(<HeaderAuthSection locale="en" dictionary={mockDictionary} />);
      const logoutButton = screen.getByTitle('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Logout failed');
      });
    });
  });

  describe('User Profile Store Integration', () => {
    it('should set user when session is available', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: 'Jane Doe',
            email: 'jane@example.com',
            image: 'https://example.com/jane.jpg',
          },
        },
        status: 'authenticated',
      } as any);

      render(<HeaderAuthSection locale="en" dictionary={mockDictionary} />);

      expect(mockSetUser).toHaveBeenCalledWith({
        name: 'Jane Doe',
        email: 'jane@example.com',
        image: 'https://example.com/jane.jpg',
      });
    });

    it('should clear user when session is not available', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      } as any);

      render(<HeaderAuthSection locale="en" dictionary={mockDictionary} />);

      expect(mockClearUser).toHaveBeenCalled();
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constant fallback when dictionary values are missing', () => {
      const incompleteDict = {} as any;
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      } as any);

      render(<HeaderAuthSection locale="en" dictionary={incompleteDict} />);
      // Should still render with constants
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });
  });
});
