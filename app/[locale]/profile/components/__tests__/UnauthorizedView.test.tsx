import React from 'react';
import { render, screen } from '@testing-library/react';
import UnauthorizedView from '../UnauthorizedView';
import { USER_PROFILE_CONSTANTS } from '@/app/lib/constants';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>;
  };
});

describe('UnauthorizedView Component', () => {
  describe('Basic Rendering', () => {
    it('should render unauthorized message', () => {
      render(<UnauthorizedView locale="en" />);
      expect(
        screen.getByText(USER_PROFILE_CONSTANTS.PLEASE_LOGIN)
      ).toBeInTheDocument();
    });

    it('should render login link', () => {
      render(<UnauthorizedView locale="en" />);
      const loginLink = screen.getByText(USER_PROFILE_CONSTANTS.GO_TO_LOGIN);
      expect(loginLink).toBeInTheDocument();
      expect(loginLink.closest('a')).toHaveAttribute('href', '/en/auth');
    });

    it('should use correct locale in link', () => {
      render(<UnauthorizedView locale="vi" />);
      const loginLink = screen.getByText(USER_PROFILE_CONSTANTS.GO_TO_LOGIN);
      expect(loginLink.closest('a')).toHaveAttribute('href', '/vi/auth');
    });
  });

  describe('Styling', () => {
    it('should have correct container classes', () => {
      const { container } = render(<UnauthorizedView locale="en" />);
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass(
        'min-h-screen',
        'bg-gray-50',
        'flex',
        'items-center',
        'justify-center'
      );
    });
  });
});

