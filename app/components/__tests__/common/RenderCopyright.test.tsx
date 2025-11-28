import React from 'react';
import { render, screen } from '@testing-library/react';
import RenderCopyright from '../../common/RenderCopyright';

describe('RenderCopyright Component', () => {
  describe('Basic Rendering', () => {
    it('should render copyright text with current year', () => {
      const currentYear = new Date().getFullYear();
      render(<RenderCopyright copyright="Travel Company" />);
      expect(
        screen.getByText(`© ${currentYear} Travel Company`)
      ).toBeInTheDocument();
    });

    it('should render with different copyright text', () => {
      const currentYear = new Date().getFullYear();
      render(<RenderCopyright copyright="My Company Name" />);
      expect(
        screen.getByText(`© ${currentYear} My Company Name`)
      ).toBeInTheDocument();
    });
  });

  describe('Year Calculation', () => {
    it('should use current year dynamically', () => {
      const currentYear = new Date().getFullYear();
      render(<RenderCopyright copyright="Test" />);
      const copyrightText = screen.getByText(new RegExp(`© ${currentYear}`));
      expect(copyrightText).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have correct CSS classes', () => {
      const { container } = render(
        <RenderCopyright copyright="Test Company" />
      );
      const copyrightElement = container.firstChild;
      expect(copyrightElement).toHaveClass(
        'text-center',
        'text-gray-500',
        'text-sm'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty copyright string', () => {
      const currentYear = new Date().getFullYear();
      const { container } = render(<RenderCopyright copyright="" />);
      expect(container.textContent).toBe(`© ${currentYear} `);
    });

    it('should handle special characters in copyright', () => {
      const currentYear = new Date().getFullYear();
      render(<RenderCopyright copyright="Company & Co. ©" />);
      expect(
        screen.getByText(`© ${currentYear} Company & Co. ©`)
      ).toBeInTheDocument();
    });
  });
});
