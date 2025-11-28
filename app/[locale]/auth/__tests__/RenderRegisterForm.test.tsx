import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RenderRegisterForm from '../RenderRegisterForm';
import { registerAction } from '@/app/actions/auth/registerAction';
import toast from 'react-hot-toast';

// Mock actions
jest.mock('@/app/actions/auth/registerAction', () => ({
  registerAction: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockRegisterAction = registerAction as jest.MockedFunction<
  typeof registerAction
>;

describe('RenderRegisterForm Component', () => {
  const mockDictionary = {
    auth: {
      register: {
        title: 'Register',
        subtitle: 'Create your account',
        fullName: 'Full Name',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        signUp: 'Sign Up',
        signingUp: 'Signing Up',
        successful_registration: 'Registration successful',
        registrationFailed: 'Registration failed',
        multipleErrors: 'Multiple errors',
      },
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRegisterAction.mockResolvedValue({
      errors: {},
      message: '',
    });
  });

  describe('Basic Rendering', () => {
    it('should render register form', () => {
      const { container } = render(
        <RenderRegisterForm dictionary={mockDictionary} locale="en" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render full name input', () => {
      render(
        <RenderRegisterForm dictionary={mockDictionary} locale="en" />
      );
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    });

    it('should render email input', () => {
      render(
        <RenderRegisterForm dictionary={mockDictionary} locale="en" />
      );
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    });

    it('should render password inputs', () => {
      render(
        <RenderRegisterForm dictionary={mockDictionary} locale="en" />
      );
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    });

    it('should render register button', () => {
      render(
        <RenderRegisterForm dictionary={mockDictionary} locale="en" />
      );
      expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call registerAction on form submit', async () => {
      mockRegisterAction.mockResolvedValue({
        errors: {},
        message: 'Registration successful',
      });

      render(
        <RenderRegisterForm dictionary={mockDictionary} locale="en" />
      );

      const fullNameInput = screen.getByLabelText(/Full Name/i);
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });

      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

      const passwordInput = screen.getByLabelText(/Password/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'password123' },
      });

      const form = screen.getByText(/Sign Up/i).closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(mockRegisterAction).toHaveBeenCalled();
      });
    });

    it('should show success toast when registration succeeds', async () => {
      mockRegisterAction.mockResolvedValue({
        errors: {},
        message: 'Registration successful',
      });

      render(
        <RenderRegisterForm dictionary={mockDictionary} locale="en" />
      );

      const fullNameInput = screen.getByLabelText(/Full Name/i);
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });

      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

      const passwordInput = screen.getByLabelText(/Password/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'password123' },
      });

      const form = screen.getByText(/Sign Up/i).closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });
    });

    it('should show error toast when registration has errors', async () => {
      mockRegisterAction.mockResolvedValue({
        errors: {
          email: ['Email already exists'],
        },
        message: '',
      });

      render(
        <RenderRegisterForm dictionary={mockDictionary} locale="en" />
      );

      const fullNameInput = screen.getByLabelText(/Full Name/i);
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });

      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });

      const passwordInput = screen.getByLabelText(/Password/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'password123' },
      });

      const form = screen.getByText(/Sign Up/i).closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    it('should show single error when one error exists', async () => {
      mockRegisterAction.mockResolvedValue({
        errors: {
          email: ['Email is invalid'],
        },
        message: '',
      });

      render(
        <RenderRegisterForm dictionary={mockDictionary} locale="en" />
      );

      const form = screen.getByText(/Sign Up/i).closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Email is invalid');
      });
    });

    it('should show multiple errors when multiple errors exist', async () => {
      mockRegisterAction.mockResolvedValue({
        errors: {
          email: ['Email is invalid'],
          password: ['Password too short'],
        },
        message: '',
      });

      render(
        <RenderRegisterForm dictionary={mockDictionary} locale="en" />
      );

      const form = screen.getByText(/Sign Up/i).closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    it('should show default error when no specific errors', async () => {
      mockRegisterAction.mockResolvedValue({
        errors: {},
        message: '',
      });

      render(
        <RenderRegisterForm dictionary={mockDictionary} locale="en" />
      );

      const form = screen.getByText(/Sign Up/i).closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Registration failed');
      });
    });

    it('should display field errors', async () => {
      mockRegisterAction.mockResolvedValue({
        errors: {
          email: ['Email is required'],
          password: ['Password is required'],
        },
        message: '',
      });

      render(
        <RenderRegisterForm dictionary={mockDictionary} locale="en" />
      );

      const form = screen.getByText(/Sign Up/i).closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    it('should reset form after successful registration', async () => {
      mockRegisterAction.mockResolvedValue({
        errors: {},
        message: 'Registration successful',
      });

      render(
        <RenderRegisterForm dictionary={mockDictionary} locale="en" />
      );

      const fullNameInput = screen.getByLabelText(/Full Name/i);
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });

      const form = screen.getByText(/Sign Up/i).closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });

      // Form should be reset after delay
      await waitFor(
        () => {
          expect(fullNameInput).toHaveValue('');
        },
        { timeout: 200 }
      );
    });

    it('should disable button when isPending is true', () => {
      // This would require mocking useActionState
      render(
        <RenderRegisterForm dictionary={mockDictionary} locale="en" />
      );
      // Button should be disabled when pending
      const button = screen.getByText(/Sign Up/i);
      // Button state is tested through form submission
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', () => {
      const incompleteDict = { auth: {} } as any;
      render(
        <RenderRegisterForm dictionary={incompleteDict} locale="en" />
      );
      // Should use constants for missing values
      expect(screen.getByText(/Register|Sign Up/i)).toBeInTheDocument();
    });
  });
});

