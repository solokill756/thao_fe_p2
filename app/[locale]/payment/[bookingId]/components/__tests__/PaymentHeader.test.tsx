import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentHeader from '../PaymentHeader';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';
import { PAYMENT_CONSTANTS } from '@/app/lib/constants';

// Mock useNavigationLoading
jest.mock('@/app/lib/hooks/useNavigationLoading', () => ({
  useNavigationLoading: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>;
  };
});

// Mock lucide-react
jest.mock('lucide-react', () => ({
  ChevronLeft: () => <div data-testid="chevron-left-icon" />,
}));

const mockUseNavigationLoading = useNavigationLoading as jest.MockedFunction<
  typeof useNavigationLoading
>;

describe('PaymentHeader Component', () => {
  const mockDictionary = {
    payment: {
      back: 'Back',
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigationLoading.mockReturnValue({
      isPending: false,
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    });
  });

  describe('Basic Rendering', () => {
    it('should render header', () => {
      const { container } = render(
        <PaymentHeader locale="en" dictionary={mockDictionary} />
      );
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should render back link', () => {
      render(
        <PaymentHeader locale="en" dictionary={mockDictionary} />
      );
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('should render chevron icon', () => {
      render(
        <PaymentHeader locale="en" dictionary={mockDictionary} />
      );
      expect(screen.getByTestId('chevron-left-icon')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should have correct href for back link', () => {
      render(
        <PaymentHeader locale="en" dictionary={mockDictionary} />
      );
      const backLink = screen.getByText('Back').closest('a');
      expect(backLink).toHaveAttribute('href', '/en/profile');
    });

    it('should use correct locale in link', () => {
      render(
        <PaymentHeader locale="vi" dictionary={mockDictionary} />
      );
      const backLink = screen.getByText('Back').closest('a');
      expect(backLink).toHaveAttribute('href', '/vi/profile');
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constant fallback when dictionary value is missing', () => {
      const incompleteDict = { payment: {} } as any;
      render(
        <PaymentHeader locale="en" dictionary={incompleteDict} />
      );
      expect(screen.getByText(PAYMENT_CONSTANTS.BACK)).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have correct header classes', () => {
      const { container } = render(
        <PaymentHeader locale="en" dictionary={mockDictionary} />
      );
      const header = container.querySelector('header');
      expect(header).toHaveClass(
        'bg-white',
        'border-b',
        'border-gray-200',
        'sticky',
        'top-0',
        'z-50'
      );
    });
  });
});

