import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RenderAuthContainer from '../RenderAuthContainer';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';

// Mock CSS module
jest.mock('@/app/lib/css/AuthContainer.module.css', () => ({
  container: 'container',
  background: 'background',
  backButton: 'backButton',
  backIcon: 'backIcon',
  content: 'content',
  formSection: 'formSection',
}));

// Mock hooks
jest.mock('@/app/lib/hooks/useNavigationLoading', () => ({
  useNavigationLoading: jest.fn(),
}));

// Mock child components
jest.mock('../RenderLoginForm', () => {
  return function MockLoginForm() {
    return <div data-testid="login-form">Login Form</div>;
  };
});

jest.mock('../RenderRegisterForm', () => {
  return function MockRegisterForm() {
    return <div data-testid="register-form">Register Form</div>;
  };
});

jest.mock('../RenderSocialLogins', () => {
  return function MockSocialLogins() {
    return <div data-testid="social-logins">Social Logins</div>;
  };
});

jest.mock('../RenderTogglePanel', () => {
  return function MockTogglePanel({ onToggle }: { onToggle: () => void }) {
    return (
      <button onClick={onToggle} data-testid="toggle-button">
        Toggle
      </button>
    );
  };
});

// Mock lucide-react
jest.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
}));

const mockUseNavigationLoading = useNavigationLoading as jest.MockedFunction<
  typeof useNavigationLoading
>;

describe('RenderAuthContainer Component', () => {
  const mockPush = jest.fn();
  const mockDictionary = {
    common: {
      back: 'Back',
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
    it('should render login form by default', () => {
      render(
        <RenderAuthContainer dictionary={mockDictionary} locale="en" />
      );
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    it('should render social logins', () => {
      render(
        <RenderAuthContainer dictionary={mockDictionary} locale="en" />
      );
      expect(screen.getByTestId('social-logins')).toBeInTheDocument();
    });

    it('should render back button', () => {
      render(
        <RenderAuthContainer dictionary={mockDictionary} locale="en" />
      );
      expect(screen.getByText('Back')).toBeInTheDocument();
    });
  });

  describe('Mode Toggle', () => {
    it('should switch to register form when toggle is clicked', () => {
      render(
        <RenderAuthContainer dictionary={mockDictionary} locale="en" />
      );
      const toggleButton = screen.getByTestId('toggle-button');
      fireEvent.click(toggleButton);
      expect(screen.getByTestId('register-form')).toBeInTheDocument();
      expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
    });

    it('should switch back to login form when toggled again', () => {
      render(
        <RenderAuthContainer dictionary={mockDictionary} locale="en" />
      );
      const toggleButton = screen.getByTestId('toggle-button');
      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
      expect(screen.queryByTestId('register-form')).not.toBeInTheDocument();
    });
  });

  describe('Back Button', () => {
    it('should navigate to home on back button click', () => {
      render(
        <RenderAuthContainer dictionary={mockDictionary} locale="en" />
      );
      const backButton = screen.getByText('Back');
      fireEvent.click(backButton);
      expect(mockPush).toHaveBeenCalledWith('/en/');
    });

    it('should use correct locale in navigation', () => {
      render(
        <RenderAuthContainer dictionary={mockDictionary} locale="vi" />
      );
      const backButton = screen.getByText('Back');
      fireEvent.click(backButton);
      expect(mockPush).toHaveBeenCalledWith('/vi/');
    });
  });
});

