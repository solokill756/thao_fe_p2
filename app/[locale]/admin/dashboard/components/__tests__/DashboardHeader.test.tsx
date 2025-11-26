import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardHeader from '../DashboardHeader';
import { PLACEHOLDER_IMAGES } from '@/app/lib/constants';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Bell: ({ className }: { className?: string }) => (
    <svg data-testid="bell-icon" className={className}>
      <title>Bell</title>
    </svg>
  ),
}));

describe('DashboardHeader Component', () => {
  describe('Basic Rendering', () => {
    it('should render title', () => {
      render(<DashboardHeader title="Dashboard Overview" session={null} />);
      expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    });

    it('should render bell icon', () => {
      render(<DashboardHeader title="Dashboard" session={null} />);
      expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
    });
  });

  describe('Session Handling', () => {
    it('should render placeholder avatar when session is null', () => {
      render(<DashboardHeader title="Dashboard" session={null} />);
      const avatar = screen.getByAltText('Admin');
      expect(avatar).toHaveAttribute('src', PLACEHOLDER_IMAGES.ADMIN_AVATAR);
    });

    it('should render placeholder avatar when session user image is null', () => {
      const session = {
        user: {
          name: 'Admin User',
          email: 'admin@example.com',
          image: null,
        },
      } as any;

      render(<DashboardHeader title="Dashboard" session={session} />);
      const avatar = screen.getByAltText('Admin');
      expect(avatar).toHaveAttribute('src', PLACEHOLDER_IMAGES.ADMIN_AVATAR);
    });

    it('should render placeholder avatar when session user is null', () => {
      const session = {
        user: null,
      } as any;

      render(<DashboardHeader title="Dashboard" session={session} />);
      const avatar = screen.getByAltText('Admin');
      expect(avatar).toHaveAttribute('src', PLACEHOLDER_IMAGES.ADMIN_AVATAR);
    });

    it('should render placeholder avatar when session user image is undefined', () => {
      const session = {
        user: {
          name: 'Admin User',
          email: 'admin@example.com',
        },
      } as any;

      render(<DashboardHeader title="Dashboard" session={session} />);
      const avatar = screen.getByAltText('Admin');
      expect(avatar).toHaveAttribute('src', PLACEHOLDER_IMAGES.ADMIN_AVATAR);
    });

    it('should render user image when session has user image', () => {
      const session = {
        user: {
          name: 'Admin User',
          email: 'admin@example.com',
          image: 'https://example.com/avatar.jpg',
        },
      } as any;

      render(<DashboardHeader title="Dashboard" session={session} />);
      const avatar = screen.getByAltText('Admin');
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should render user image from session.user.image', () => {
      const customImageUrl = 'https://custom-avatar.com/user.png';
      const session = {
        user: {
          name: 'Admin',
          image: customImageUrl,
        },
      } as any;

      render(<DashboardHeader title="Dashboard" session={session} />);
      const avatar = screen.getByAltText('Admin');
      expect(avatar).toHaveAttribute('src', customImageUrl);
    });
  });

  describe('Component Structure', () => {
    it('should have correct header classes', () => {
      const { container } = render(
        <DashboardHeader title="Dashboard" session={null} />
      );
      const header = container.querySelector('header');
      expect(header).toHaveClass('bg-white', 'shadow-sm', 'border-b');
    });

    it('should have sticky positioning', () => {
      const { container } = render(
        <DashboardHeader title="Dashboard" session={null} />
      );
      const header = container.querySelector('header');
      expect(header).toHaveClass('sticky', 'top-0', 'z-20');
    });

    it('should render avatar with correct classes', () => {
      render(<DashboardHeader title="Dashboard" session={null} />);
      const avatar = screen.getByAltText('Admin');
      expect(avatar).toHaveClass(
        'w-9',
        'h-9',
        'rounded-full',
        'border',
        'border-slate-200'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty title string', () => {
      const { container } = render(<DashboardHeader title="" session={null} />);
      const header = container.querySelector('h2');
      expect(header).toBeInTheDocument();
    });

    it('should handle very long title', () => {
      const longTitle = 'A'.repeat(100);
      render(<DashboardHeader title={longTitle} session={null} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });
  });
});

