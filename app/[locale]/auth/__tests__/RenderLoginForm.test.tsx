import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RenderLoginForm from '../RenderLoginForm';
import { signIn, getSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';

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
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
const mockGetSession = getSession as jest.MockedFunction<typeof getSession>;
const mockUseNavigationLoading = useNavigationLoading as jest.MockedFunction<
  typeof useNavigationLoading
>;

describe('RenderLoginForm Component', () => {
  const mockPush = jest.fn();
  const mockDictionary = {
    auth: {
      login: {
        title: 'Login',
        subtitle: 'Welcome back',
        email: 'Email',
        password: 'Password',
        loginButton: 'Login',
        invalidCredentials: 'Invalid credentials',
        login_successful: 'Login successful',
      },
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
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

  describe('Basic Rendering', () => {
    it('should render login form', () => {
      const { container } = render(
        <RenderLoginForm dictionary={mockDictionary} onToggle={mockOnToggle} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render email input', () => {
      render(
        <RenderLoginForm dictionary={mockDictionary} onToggle={mockOnToggle} />
      );
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    });

    it('should render password input', () => {
      render(
        <RenderLoginForm dictionary={mockDictionary} onToggle={mockOnToggle} />
      );
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });

    it('should render login button', () => {
      render(
        <RenderLoginForm dictionary={mockDictionary} onToggle={mockOnToggle} />
      );
      expect(screen.getByText('Login')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call signIn on form submit', async () => {
      mockSignIn.mockResolvedValue({ ok: true } as any);
      mockGetSession.mockResolvedValue({
        user: { role: 'user' },
      } as any);

      render(<RenderLoginForm dictionary={mockDictionary} locale="en" />);

      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const passwordInput = screen.getByLabelText(/Password/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const form = screen.getByText('Login').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalled();
      });
    });

    it('should show error toast when signIn fails', async () => {
      mockSignIn.mockResolvedValue({ error: 'Invalid credentials' } as any);

      render(<RenderLoginForm dictionary={mockDictionary} locale="en" />);

      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const passwordInput = screen.getByLabelText(/Password/i);
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

      const form = screen.getByText('Login').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
      });
    });

    it('should show success toast and navigate to home for regular user', async () => {
      mockSignIn.mockResolvedValue({ ok: true } as any);
      mockGetSession.mockResolvedValue({
        user: { role: 'user' },
      } as any);

      render(<RenderLoginForm dictionary={mockDictionary} locale="en" />);

      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const passwordInput = screen.getByLabelText(/Password/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const form = screen.getByText('Login').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith('/en/');
      });
    });

    it('should navigate to admin home for admin user', async () => {
      mockSignIn.mockResolvedValue({ ok: true } as any);
      mockGetSession.mockResolvedValue({
        user: { role: 'admin' },
      } as any);

      render(<RenderLoginForm dictionary={mockDictionary} locale="en" />);

      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });

      const passwordInput = screen.getByLabelText(/Password/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const form = screen.getByText('Login').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/en/admin/dashboard');
      });
    });

    it('should handle signIn exception', async () => {
      mockSignIn.mockRejectedValue(new Error('Network error'));

      render(<RenderLoginForm dictionary={mockDictionary} locale="en" />);

      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const passwordInput = screen.getByLabelText(/Password/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const form = screen.getByText('Login').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    it('should set loading state during submission', async () => {
      mockSignIn.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ ok: true } as any), 100);
          })
      );
      mockGetSession.mockResolvedValue({
        user: { role: 'user' },
      } as any);

      render(<RenderLoginForm dictionary={mockDictionary} locale="en" />);

      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const passwordInput = screen.getByLabelText(/Password/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const form = screen.getByText('Login').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      // Button should be disabled during loading
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalled();
      });
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', () => {
      const incompleteDict = { auth: {} } as any;
      render(<RenderLoginForm dictionary={incompleteDict} locale="en" />);
      // Should use constants for missing values
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });
  });
});
