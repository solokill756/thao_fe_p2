import React from 'react';
import { render, screen } from '@testing-library/react';
import RenderFooter from '../RenderFooter';
import { FOOTER_CONSTANTS } from '@/app/lib/constants';

// Mock RenderCopyright
jest.mock('@/app/components/common/RenderCopyright', () => {
  return function MockRenderCopyright({ copyright }: { copyright: string }) {
    return <div data-testid="copyright">{copyright}</div>;
  };
});

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>;
  };
});

describe('RenderFooter Component', () => {
  const mockDictionary = {
    footer: {
      description: 'Travel helps companies manage payments easily.',
      company: 'Company',
      aboutUs: 'About Us',
      careers: 'Careers',
      blog: 'Blog',
      pricing: 'Pricing',
      destinations: 'Destinations',
      maldives: 'Maldives',
      losAngeles: 'Los Angeles',
      lasVegas: 'Las Vegas',
      toronto: 'Toronto',
      joinOurNewsletter: 'Join Our Newsletter',
      newsletterDescription:
        'Will send you weekly updates for your better tour packages.',
      subscribe: 'Subscribe',
      copyright: 'Travel. All Rights Reserved.',
    },
  } as any;

  describe('Basic Rendering', () => {
    it('should render footer', () => {
      const { container } = render(
        <RenderFooter dictionary={mockDictionary} />
      );
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('should render company logo', () => {
      const { container } = render(
        <RenderFooter dictionary={mockDictionary} />
      );
      const logo = container.querySelector('h4');
      expect(logo).toBeInTheDocument();
      expect(logo?.textContent).toContain('Travel');
    });

    it('should render description', () => {
      render(<RenderFooter dictionary={mockDictionary} />);
      expect(
        screen.getByText('Travel helps companies manage payments easily.')
      ).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should render company section links', () => {
      render(<RenderFooter dictionary={mockDictionary} />);
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Careers')).toBeInTheDocument();
      expect(screen.getByText('Blog')).toBeInTheDocument();
      expect(screen.getByText('Pricing')).toBeInTheDocument();
    });

    it('should render destinations section links', () => {
      render(<RenderFooter dictionary={mockDictionary} />);
      expect(screen.getByText('Maldives')).toBeInTheDocument();
      expect(screen.getByText('Los Angeles')).toBeInTheDocument();
      expect(screen.getByText('Las Vegas')).toBeInTheDocument();
      expect(screen.getByText('Toronto')).toBeInTheDocument();
    });
  });

  describe('Newsletter Section', () => {
    it('should render newsletter section', () => {
      render(<RenderFooter dictionary={mockDictionary} />);
      expect(screen.getByText('Join Our Newsletter')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Will send you weekly updates for your better tour packages.'
        )
      ).toBeInTheDocument();
    });

    it('should render email input', () => {
      render(<RenderFooter dictionary={mockDictionary} />);
      const emailInput = screen.getByPlaceholderText('Your email');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should render subscribe button', () => {
      render(<RenderFooter dictionary={mockDictionary} />);
      expect(screen.getByText('Subscribe')).toBeInTheDocument();
    });
  });

  describe('Copyright', () => {
    it('should render copyright component', () => {
      render(<RenderFooter dictionary={mockDictionary} />);
      expect(screen.getByTestId('copyright')).toBeInTheDocument();
      expect(screen.getByTestId('copyright')).toHaveTextContent(
        'Travel. All Rights Reserved.'
      );
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', () => {
      const incompleteDict = { footer: {} } as any;
      render(<RenderFooter dictionary={incompleteDict} />);

      expect(
        screen.getByText(FOOTER_CONSTANTS.DESCRIPTION)
      ).toBeInTheDocument();
      expect(screen.getByText(FOOTER_CONSTANTS.COMPANY)).toBeInTheDocument();
      expect(screen.getByText(FOOTER_CONSTANTS.ABOUT_US)).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have correct footer classes', () => {
      const { container } = render(
        <RenderFooter dictionary={mockDictionary} />
      );
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('bg-gray-800', 'text-white', 'py-12');
    });
  });
});
