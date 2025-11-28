import React from 'react';
import { render } from '@testing-library/react';
import PaymentSkeleton from '../PaymentSkeleton';

describe('PaymentSkeleton Component', () => {
  describe('Basic Rendering', () => {
    it('should render payment skeleton', () => {
      const { container } = render(<PaymentSkeleton />);
      const mainDiv = container.querySelector('.min-h-screen');
      expect(mainDiv).toBeInTheDocument();
    });

    it('should render header skeleton', () => {
      const { container } = render(<PaymentSkeleton />);
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should render multiple skeleton elements', () => {
      const { container } = render(<PaymentSkeleton />);
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Structure', () => {
    it('should render trip info skeleton', () => {
      const { container } = render(<PaymentSkeleton />);
      const tripInfo = container.querySelector('.bg-white.p-6');
      expect(tripInfo).toBeInTheDocument();
    });

    it('should render payment method skeleton', () => {
      const { container } = render(<PaymentSkeleton />);
      const paymentMethod = container.querySelector('.grid.grid-cols-1');
      expect(paymentMethod).toBeInTheDocument();
    });

    it('should render order summary skeleton', () => {
      const { container } = render(<PaymentSkeleton />);
      const orderSummary = container.querySelector('.sticky.top-24');
      expect(orderSummary).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have correct main container classes', () => {
      const { container } = render(<PaymentSkeleton />);
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('min-h-screen', 'bg-gray-50', 'font-inter');
    });
  });
});

