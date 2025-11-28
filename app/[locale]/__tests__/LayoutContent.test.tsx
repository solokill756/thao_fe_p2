import React from 'react';
import { render } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import LayoutContent from '../LayoutContent';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<
  typeof usePathname
>;

describe('LayoutContent Component', () => {
  const mockHeader = <div data-testid="header">Header</div>;
  const mockFooter = <div data-testid="footer">Footer</div>;
  const mockLanguageSwitcher = (
    <div data-testid="language-switcher">Language Switcher</div>
  );
  const mockChildren = <div data-testid="children">Children</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When shouldShowLayout is false', () => {
    it('should render only children', () => {
      mockUsePathname.mockReturnValue('/en/');
      const { getByTestId, queryByTestId } = render(
        <LayoutContent
          shouldShowLayout={false}
          locale="en"
          dictionary={{}}
          headerComponent={mockHeader}
          footerComponent={mockFooter}
          languageSwitcher={mockLanguageSwitcher}
        >
          {mockChildren}
        </LayoutContent>
      );
      expect(getByTestId('children')).toBeInTheDocument();
      expect(queryByTestId('header')).not.toBeInTheDocument();
      expect(queryByTestId('footer')).not.toBeInTheDocument();
    });
  });

  describe('When pathname includes /admin', () => {
    it('should render only children', () => {
      mockUsePathname.mockReturnValue('/en/admin/bookings');
      const { getByTestId, queryByTestId } = render(
        <LayoutContent
          shouldShowLayout={true}
          locale="en"
          dictionary={{}}
          headerComponent={mockHeader}
          footerComponent={mockFooter}
          languageSwitcher={mockLanguageSwitcher}
        >
          {mockChildren}
        </LayoutContent>
      );
      expect(getByTestId('children')).toBeInTheDocument();
      expect(queryByTestId('header')).not.toBeInTheDocument();
    });
  });

  describe('When pathname includes /auth', () => {
    it('should render only children', () => {
      mockUsePathname.mockReturnValue('/en/auth');
      const { getByTestId, queryByTestId } = render(
        <LayoutContent
          shouldShowLayout={true}
          locale="en"
          dictionary={{}}
          headerComponent={mockHeader}
          footerComponent={mockFooter}
          languageSwitcher={mockLanguageSwitcher}
        >
          {mockChildren}
        </LayoutContent>
      );
      expect(getByTestId('children')).toBeInTheDocument();
      expect(queryByTestId('header')).not.toBeInTheDocument();
    });
  });

  describe('When pathname is null or undefined', () => {
    it('should render full layout when pathname is null', () => {
      mockUsePathname.mockReturnValue(null);
      const { getByTestId } = render(
        <LayoutContent
          shouldShowLayout={true}
          locale="en"
          dictionary={{}}
          headerComponent={mockHeader}
          footerComponent={mockFooter}
          languageSwitcher={mockLanguageSwitcher}
        >
          {mockChildren}
        </LayoutContent>
      );
      expect(getByTestId('header')).toBeInTheDocument();
      expect(getByTestId('footer')).toBeInTheDocument();
      expect(getByTestId('children')).toBeInTheDocument();
    });

    it('should render only children when pathname is null and shouldShowLayout is false', () => {
      mockUsePathname.mockReturnValue(null);
      const { getByTestId, queryByTestId } = render(
        <LayoutContent
          shouldShowLayout={false}
          locale="en"
          dictionary={{}}
          headerComponent={mockHeader}
          footerComponent={mockFooter}
          languageSwitcher={mockLanguageSwitcher}
        >
          {mockChildren}
        </LayoutContent>
      );
      expect(getByTestId('children')).toBeInTheDocument();
      expect(queryByTestId('header')).not.toBeInTheDocument();
    });
  });

  describe('When pathname includes both /admin and /auth patterns', () => {
    it('should handle admin route when pathname contains /admin/dashboard', () => {
      mockUsePathname.mockReturnValue('/en/admin/dashboard');
      const { getByTestId, queryByTestId } = render(
        <LayoutContent
          shouldShowLayout={true}
          locale="en"
          dictionary={{}}
          headerComponent={mockHeader}
          footerComponent={mockFooter}
          languageSwitcher={mockLanguageSwitcher}
        >
          {mockChildren}
        </LayoutContent>
      );
      expect(getByTestId('children')).toBeInTheDocument();
      expect(queryByTestId('header')).not.toBeInTheDocument();
    });

    it('should handle auth route with different patterns', () => {
      mockUsePathname.mockReturnValue('/en/auth/login');
      const { getByTestId, queryByTestId } = render(
        <LayoutContent
          shouldShowLayout={true}
          locale="en"
          dictionary={{}}
          headerComponent={mockHeader}
          footerComponent={mockFooter}
          languageSwitcher={mockLanguageSwitcher}
        >
          {mockChildren}
        </LayoutContent>
      );
      expect(getByTestId('children')).toBeInTheDocument();
      expect(queryByTestId('header')).not.toBeInTheDocument();
    });
  });

  describe('When shouldShowLayout is true and not admin/auth route', () => {
    it('should render full layout with header, footer, and language switcher', () => {
      mockUsePathname.mockReturnValue('/en/');
      const { getByTestId } = render(
        <LayoutContent
          shouldShowLayout={true}
          locale="en"
          dictionary={{}}
          headerComponent={mockHeader}
          footerComponent={mockFooter}
          languageSwitcher={mockLanguageSwitcher}
        >
          {mockChildren}
        </LayoutContent>
      );
      expect(getByTestId('header')).toBeInTheDocument();
      expect(getByTestId('footer')).toBeInTheDocument();
      expect(getByTestId('language-switcher')).toBeInTheDocument();
      expect(getByTestId('children')).toBeInTheDocument();
    });

    it('should have correct container classes', () => {
      mockUsePathname.mockReturnValue('/en/');
      const { container } = render(
        <LayoutContent
          shouldShowLayout={true}
          locale="en"
          dictionary={{}}
          headerComponent={mockHeader}
          footerComponent={mockFooter}
          languageSwitcher={mockLanguageSwitcher}
        >
          {mockChildren}
        </LayoutContent>
      );
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass(
        'min-h-screen',
        'bg-white',
        'font-inter',
        'flex',
        'flex-col'
      );
    });

    it('should render layout for different locales', () => {
      mockUsePathname.mockReturnValue('/vi/');
      const { getByTestId } = render(
        <LayoutContent
          shouldShowLayout={true}
          locale="vi"
          dictionary={{}}
          headerComponent={mockHeader}
          footerComponent={mockFooter}
          languageSwitcher={mockLanguageSwitcher}
        >
          {mockChildren}
        </LayoutContent>
      );
      expect(getByTestId('header')).toBeInTheDocument();
      expect(getByTestId('footer')).toBeInTheDocument();
      expect(getByTestId('children')).toBeInTheDocument();
    });

    it('should render layout for tours route', () => {
      mockUsePathname.mockReturnValue('/en/tours');
      const { getByTestId } = render(
        <LayoutContent
          shouldShowLayout={true}
          locale="en"
          dictionary={{}}
          headerComponent={mockHeader}
          footerComponent={mockFooter}
          languageSwitcher={mockLanguageSwitcher}
        >
          {mockChildren}
        </LayoutContent>
      );
      expect(getByTestId('header')).toBeInTheDocument();
      expect(getByTestId('footer')).toBeInTheDocument();
      expect(getByTestId('children')).toBeInTheDocument();
    });
  });
});

