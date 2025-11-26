import React from 'react';
import { render, screen } from '@testing-library/react';
import RenderHeader from '../RenderHeader';

// Mock HeaderAuthSection
jest.mock('../HeaderAuthSection', () => {
  return function MockHeaderAuthSection() {
    return <div data-testid="header-auth-section">Auth Section</div>;
  };
});

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>;
  };
});

describe('RenderHeader Component', () => {
  const mockDictionary = {
    common: {
      header: {},
    },
  } as any;

  describe('Basic Rendering', () => {
    it('should render header', async () => {
      const { container } = render(
        await RenderHeader({ locale: 'en', dictionary: mockDictionary })
      );
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should render logo', async () => {
      render(await RenderHeader({ locale: 'en', dictionary: mockDictionary }));
      const logo = screen.getByText((content, element) => {
        return element?.textContent?.includes('Travel') || false;
      });
      expect(logo).toBeInTheDocument();
    });

    it('should render HeaderAuthSection', async () => {
      render(await RenderHeader({ locale: 'en', dictionary: mockDictionary }));
      expect(screen.getByTestId('header-auth-section')).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should render all navigation links', async () => {
      render(await RenderHeader({ locale: 'en', dictionary: mockDictionary }));
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(screen.getByText('Tours')).toBeInTheDocument();
      expect(screen.getByText('Destinations')).toBeInTheDocument();
      expect(screen.getByText('Blog')).toBeInTheDocument();
    });

    it('should have correct hrefs with locale prefix', async () => {
      render(await RenderHeader({ locale: 'en', dictionary: mockDictionary }));
      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink?.getAttribute('href')).toMatch(/^\/en\//);
    });

    it('should have correct hrefs for vi locale', async () => {
      render(await RenderHeader({ locale: 'vi', dictionary: mockDictionary }));
      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink?.getAttribute('href')).toMatch(/^\/vi\//);
    });
  });

  describe('Styling', () => {
    it('should have correct header classes', async () => {
      const { container } = render(
        await RenderHeader({ locale: 'en', dictionary: mockDictionary })
      );
      const header = container.querySelector('header');
      expect(header).toHaveClass(
        'bg-white/90',
        'sticky',
        'top-0',
        'z-50',
        'shadow-md'
      );
    });
  });
});
