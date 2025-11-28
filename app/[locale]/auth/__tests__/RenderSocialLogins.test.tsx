import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { signIn, getSession } from 'next-auth/react';
import RenderSocialLogins from '../RenderSocialLogins';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';
import toast from 'react-hot-toast';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  getSession: jest.fn(),
}));

// Mock hooks
jest.mock('@/app/lib/hooks/useNavigationLoading', () => ({
  useNavigationLoading: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaGoogle: () => <div data-testid="google-icon" />,
}));

const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
const mockGetSession = getSession as jest.MockedFunction<typeof getSession>;
const mockUseNavigationLoading = useNavigationLoading as jest.MockedFunction<
  typeof useNavigationLoading
>;

describe('RenderSocialLogins Component', () => {
  const mockPush = jest.fn();
  const mockDictionary = {
    auth: {
      login: {
        orContinueWith: 'Or continue with',
        googleSignIn: 'Sign in with Google',
        signingIn: 'Signing in...',
        login_successful: 'Login successful',
        googleSignInError: 'Google sign in failed',
      },
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockUseNavigationLoading.mockReturnValue({
      isPending: false,
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('should render Google sign in button', () => {
      render(
        <RenderSocialLogins dictionary={mockDictionary} locale="en" />
      );
      expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    });

    it('should render divider text', () => {
      render(
        <RenderSocialLogins dictionary={mockDictionary} locale="en" />
      );
      expect(screen.getByText('Or continue with')).toBeInTheDocument();
    });

    it('should render Google icon', () => {
      render(
        <RenderSocialLogins dictionary={mockDictionary} locale="en" />
      );
      expect(screen.getByTestId('google-icon')).toBeInTheDocument();
    });
  });

  describe('Google Sign In Success', () => {
    it('should show success toast on successful sign in', async () => {
      mockSignIn.mockResolvedValue({ ok: true, error: null } as any);
      mockGetSession.mockResolvedValue({
        user: { role: 'user' },
      } as any);

      render(
        <RenderSocialLogins dictionary={mockDictionary} locale="en" />
      );
      const button = screen.getByText('Sign in with Google');
      fireEvent.click(button);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Login successful');
      });
    });

    it('should navigate to home for regular user', async () => {
      mockSignIn.mockResolvedValue({ ok: true, error: null } as any);
      mockGetSession.mockResolvedValue({
        user: { role: 'user' },
      } as any);

      render(
        <RenderSocialLogins dictionary={mockDictionary} locale="en" />
      );
      const button = screen.getByText('Sign in with Google');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/en/');
      });
    });

    it('should navigate to admin page for admin user', async () => {
      mockSignIn.mockResolvedValue({ ok: true, error: null } as any);
      mockGetSession.mockResolvedValue({
        user: { role: 'admin' },
      } as any);

      render(
        <RenderSocialLogins dictionary={mockDictionary} locale="en" />
      );
      const button = screen.getByText('Sign in with Google');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/en/admin/bookings');
      });
    });
  });

  describe('Google Sign In Error', () => {
    it('should show error toast on sign in failure', async () => {
      mockSignIn.mockResolvedValue({
        ok: false,
        error: 'Sign in failed',
      } as any);

      render(
        <RenderSocialLogins dictionary={mockDictionary} locale="en" />
      );
      const button = screen.getByText('Sign in with Google');
      fireEvent.click(button);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Google sign in failed');
      });
    });

    it('should show error toast on exception', async () => {
      mockSignIn.mockRejectedValue(new Error('Network error'));

      render(
        <RenderSocialLogins dictionary={mockDictionary} locale="en" />
      );
      const button = screen.getByText('Sign in with Google');
      fireEvent.click(button);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Google sign in failed');
      });
    });
  });

  describe('Loading State', () => {
    it('should disable button and show loading text when signing in', async () => {
      mockSignIn.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ ok: true, error: null }), 100);
          }) as any
      );
      mockGetSession.mockResolvedValue({
        user: { role: 'user' },
      } as any);

      render(
        <RenderSocialLogins dictionary={mockDictionary} locale="en" />
      );
      const button = screen.getByText('Sign in with Google');
      fireEvent.click(button);

      expect(screen.getByText('Signing in...')).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });
});

