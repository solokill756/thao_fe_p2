import React from 'react';
import { render, screen } from '@testing-library/react';
import RenderServicesSection from '../RenderServicesSection';
import { SERVICES_SECTION_CONSTANTS } from '@/app/lib/constants';

describe('RenderServicesSection Component', () => {
  const mockDictionary = {
    services: {
      category: 'CATEGORY',
      title: 'We Offer Best Services',
      guidedTours: 'Guided Tours',
      guidedToursDescription:
        "Professional guided tours to explore the world's most iconic destinations.",
      bestFlightsOptions: 'Best Flights Options',
      bestFlightsOptionsDescription:
        'Best flight options with competitive pricing and flexible booking.',
      religiousTours: 'Religious Tours',
      religiousToursDescription:
        'Religious tours to sacred sites and cultural heritage.',
      medicalInsurance: 'Medical Insurance',
      medicalInsuranceDescription:
        'Comprehensive medical insurance for your journey.',
    },
  } as any;

  describe('Basic Rendering', () => {
    it('should render services section', () => {
      const { container } = render(
        <RenderServicesSection dictionary={mockDictionary} />
      );
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('id', 'services');
    });

    it('should render category label', () => {
      render(<RenderServicesSection dictionary={mockDictionary} />);
      expect(screen.getByText('CATEGORY')).toBeInTheDocument();
    });

    it('should render title', () => {
      render(<RenderServicesSection dictionary={mockDictionary} />);
      expect(screen.getByText('We Offer Best Services')).toBeInTheDocument();
    });
  });

  describe('Services List', () => {
    it('should render all 4 services', () => {
      render(<RenderServicesSection dictionary={mockDictionary} />);
      expect(screen.getByText('Guided Tours')).toBeInTheDocument();
      expect(screen.getByText('Best Flights Options')).toBeInTheDocument();
      expect(screen.getByText('Religious Tours')).toBeInTheDocument();
      expect(screen.getByText('Medical Insurance')).toBeInTheDocument();
    });

    it('should render service descriptions', () => {
      render(<RenderServicesSection dictionary={mockDictionary} />);
      expect(
        screen.getByText(
          "Professional guided tours to explore the world's most iconic destinations."
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Best flight options with competitive pricing and flexible booking.'
        )
      ).toBeInTheDocument();
    });

    it('should render service icons', () => {
      const { container } = render(
        <RenderServicesSection dictionary={mockDictionary} />
      );
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBe(4);
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', () => {
      const incompleteDict = { services: {} } as any;
      render(<RenderServicesSection dictionary={incompleteDict} />);

      expect(
        screen.getByText(SERVICES_SECTION_CONSTANTS.CATEGORY)
      ).toBeInTheDocument();
      expect(
        screen.getByText(SERVICES_SECTION_CONSTANTS.DEFAULT_TITLE)
      ).toBeInTheDocument();
      expect(
        screen.getByText(SERVICES_SECTION_CONSTANTS.GUIDED_TOURS)
      ).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have correct section classes', () => {
      const { container } = render(
        <RenderServicesSection dictionary={mockDictionary} />
      );
      const section = container.querySelector('section');
      expect(section).toHaveClass('py-20', 'bg-white');
    });

    it('should render services in grid layout', () => {
      const { container } = render(
        <RenderServicesSection dictionary={mockDictionary} />
      );
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass(
        'grid-cols-1',
        'md:grid-cols-2',
        'lg:grid-cols-4'
      );
    });
  });
});
