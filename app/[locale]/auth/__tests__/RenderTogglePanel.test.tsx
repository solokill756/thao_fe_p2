import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RenderTogglePanel from '../RenderTogglePanel';

// Mock CSS module
jest.mock('@/app/lib/css/RenderTogglePanel.module.css', () => ({
  panel: 'panel',
  overlay: 'overlay',
  content: 'content',
  title: 'title',
  subtitle: 'subtitle',
  button: 'button',
}));

describe('RenderTogglePanel Component', () => {
  const mockOnToggle = jest.fn();
  const mockDictionary = {
    auth: {
      login: {
        noAccount: 'No account?',
        subtitle: 'Sign up to get started',
        register: 'Register',
      },
      register: {
        noAccount: 'Already have an account?',
        subtitle: 'Sign in to continue',
        login: 'Login',
      },
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Mode', () => {
    it('should render login mode content', () => {
      render(
        <RenderTogglePanel
          mode="login"
          onToggle={mockOnToggle}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText('No account?')).toBeInTheDocument();
      expect(screen.getByText('Sign up to get started')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('should call onToggle when button is clicked', () => {
      render(
        <RenderTogglePanel
          mode="login"
          onToggle={mockOnToggle}
          dictionary={mockDictionary}
        />
      );
      const button = screen.getByText('Register');
      fireEvent.click(button);
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Register Mode', () => {
    it('should render register mode content', () => {
      render(
        <RenderTogglePanel
          mode="register"
          onToggle={mockOnToggle}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText('Already have an account?')).toBeInTheDocument();
      expect(screen.getByText('Sign in to continue')).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('should call onToggle when button is clicked', () => {
      render(
        <RenderTogglePanel
          mode="register"
          onToggle={mockOnToggle}
          dictionary={mockDictionary}
        />
      );
      const button = screen.getByText('Login');
      fireEvent.click(button);
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });
  });
});

