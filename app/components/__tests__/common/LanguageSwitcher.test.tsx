import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../../common/LanguageSwitcher';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock useNavigationLoading hook
jest.mock('@/app/lib/hooks/useNavigationLoading', () => ({
  useNavigationLoading: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseNavigationLoading = useNavigationLoading as jest.MockedFunction<
  typeof useNavigationLoading
>;

describe('LanguageSwitcher Component', () => {
  const mockPush = jest.fn();

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
    it('should render language switcher', () => {
      mockUsePathname.mockReturnValue('/en');
      render(<LanguageSwitcher />);
      expect(screen.getByText('EN')).toBeInTheDocument();
      expect(screen.getByText('VI')).toBeInTheDocument();
    });

    it('should render with dictionary label', () => {
      mockUsePathname.mockReturnValue('/en');
      const dictionary = {
        languageSwitcher: {
          label: 'Select Language',
        },
      };
      render(<LanguageSwitcher dictionary={dictionary as any} />);
      expect(screen.getByText('Select Language')).toBeInTheDocument();
    });

    it('should use default label when dictionary is not provided', () => {
      mockUsePathname.mockReturnValue('/en');
      render(<LanguageSwitcher />);
      expect(screen.getByText('Switch Language')).toBeInTheDocument();
    });
  });

  describe('Current Locale Detection', () => {
    it('should highlight current locale (en)', async () => {
      mockUsePathname.mockReturnValue('/en');
      render(<LanguageSwitcher />);

      await waitFor(() => {
        const enButton = screen.getByText('EN');
        expect(enButton).toHaveClass('bg-blue-500', 'text-white', 'font-bold');
      });
    });

    it('should highlight current locale (vi)', async () => {
      mockUsePathname.mockReturnValue('/vi');
      render(<LanguageSwitcher />);

      await waitFor(() => {
        const viButton = screen.getByText('VI');
        expect(viButton).toHaveClass('bg-blue-500', 'text-white', 'font-bold');
      });
    });

    it('should handle pathname without locale prefix', async () => {
      mockUsePathname.mockReturnValue('/');
      render(<LanguageSwitcher />);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        buttons.forEach((button) => {
          expect(button).not.toHaveClass('bg-blue-500');
        });
      });
    });

    it('should handle pathname with nested routes', async () => {
      mockUsePathname.mockReturnValue('/en/tours/123');
      render(<LanguageSwitcher />);

      await waitFor(() => {
        const enButton = screen.getByText('EN');
        expect(enButton).toHaveClass('bg-blue-500');
      });
    });
  });

  describe('Language Switching', () => {
    it('should switch from en to vi', async () => {
      mockUsePathname.mockReturnValue('/en');
      render(<LanguageSwitcher />);

      await waitFor(() => {
        const viButton = screen.getByText('VI');
        fireEvent.click(viButton);
      });

      expect(mockPush).toHaveBeenCalledWith('/vi');
    });

    it('should switch from vi to en', async () => {
      mockUsePathname.mockReturnValue('/vi');
      render(<LanguageSwitcher />);

      await waitFor(() => {
        const enButton = screen.getByText('EN');
        fireEvent.click(enButton);
      });

      expect(mockPush).toHaveBeenCalledWith('/en');
    });

    it('should preserve nested routes when switching', async () => {
      mockUsePathname.mockReturnValue('/en/tours/123');
      render(<LanguageSwitcher />);

      await waitFor(() => {
        const viButton = screen.getByText('VI');
        fireEvent.click(viButton);
      });

      expect(mockPush).toHaveBeenCalledWith('/vi/tours/123');
    });

    it('should add locale prefix when pathname has no locale', async () => {
      mockUsePathname.mockReturnValue('/tours/123');
      render(<LanguageSwitcher />);

      await waitFor(() => {
        const enButton = screen.getByText('EN');
        fireEvent.click(enButton);
      });

      expect(mockPush).toHaveBeenCalledWith('/en/tours/123');
    });

    it('should not switch if clicking current locale', async () => {
      mockUsePathname.mockReturnValue('/en');
      render(<LanguageSwitcher />);

      await waitFor(() => {
        const enButton = screen.getByText('EN');
        fireEvent.click(enButton);
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Pending State', () => {
    it('should disable buttons when navigation is pending', async () => {
      mockUsePathname.mockReturnValue('/en');
      mockUseNavigationLoading.mockReturnValue({
        isPending: true,
        push: mockPush,
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn(),
      });

      render(<LanguageSwitcher />);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        buttons.forEach((button) => {
          expect(button).toBeDisabled();
        });
      });
    });

    it('should not switch language when navigation is pending', async () => {
      mockUsePathname.mockReturnValue('/en');
      mockUseNavigationLoading.mockReturnValue({
        isPending: true,
        push: mockPush,
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn(),
      });

      render(<LanguageSwitcher />);

      await waitFor(() => {
        const viButton = screen.getByText('VI');
        fireEvent.click(viButton);
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Button Styling', () => {
    it('should apply active styles to current locale', async () => {
      mockUsePathname.mockReturnValue('/en');
      render(<LanguageSwitcher />);

      await waitFor(() => {
        const enButton = screen.getByText('EN');
        expect(enButton).toHaveClass('bg-blue-500', 'text-white', 'font-bold');
      });
    });

    it('should apply inactive styles to non-current locale', async () => {
      mockUsePathname.mockReturnValue('/en');
      render(<LanguageSwitcher />);

      await waitFor(() => {
        const viButton = screen.getByText('VI');
        expect(viButton).toHaveClass(
          'text-gray-700',
          'hover:bg-gray-100',
          'font-normal'
        );
      });
    });
  });

  describe('Mounting Behavior', () => {
    it('should not render until mounted', () => {
      mockUsePathname.mockReturnValue('/en');
      const { container } = render(<LanguageSwitcher />);
      // Component should return null initially
      expect(container.firstChild).toBeNull();
    });

    it('should render after mount', async () => {
      mockUsePathname.mockReturnValue('/en');
      render(<LanguageSwitcher />);

      await waitFor(() => {
        expect(screen.getByText('EN')).toBeInTheDocument();
      });
    });
  });
});
