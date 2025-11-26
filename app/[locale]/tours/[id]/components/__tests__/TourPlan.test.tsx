import React from 'react';
import { render, screen } from '@testing-library/react';
import TourPlan from '../TourPlan';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  CheckCircle: () => <div data-testid="check-circle-icon" />,
}));

describe('TourPlan Component', () => {
  const mockPlans = [
    {
      plan_day_id: 1,
      day_number: 1,
      title: 'Arrival',
      description: 'Arrive in Paris',
      inclusions: ['Airport pickup', 'Hotel check-in'],
    },
    {
      plan_day_id: 2,
      day_number: 2,
      title: 'City Tour',
      description: 'Explore the city',
      inclusions: ['Guided tour', 'Lunch'],
    },
  ] as any;

  const mockDictionary = {
    tourDetail: {
      tourPlan: 'Tour Plan',
      day: 'Day',
    },
  } as any;

  describe('Basic Rendering', () => {
    it('should render tour plan', () => {
      const { container } = render(
        <TourPlan plans={mockPlans} dictionary={mockDictionary} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render tour plan title', () => {
      render(<TourPlan plans={mockPlans} dictionary={mockDictionary} />);
      expect(screen.getByText('Tour Plan')).toBeInTheDocument();
    });

    it('should render all plan days', () => {
      render(<TourPlan plans={mockPlans} dictionary={mockDictionary} />);
      expect(screen.getByText('Day 1: Arrival')).toBeInTheDocument();
      expect(screen.getByText('Day 2: City Tour')).toBeInTheDocument();
    });

    it('should render plan descriptions', () => {
      render(<TourPlan plans={mockPlans} dictionary={mockDictionary} />);
      expect(screen.getByText('Arrive in Paris')).toBeInTheDocument();
      expect(screen.getByText('Explore the city')).toBeInTheDocument();
    });

    it('should render plan inclusions', () => {
      render(<TourPlan plans={mockPlans} dictionary={mockDictionary} />);
      expect(screen.getByText('Airport pickup')).toBeInTheDocument();
      expect(screen.getByText('Hotel check-in')).toBeInTheDocument();
      expect(screen.getByText('Guided tour')).toBeInTheDocument();
    });
  });

  describe('Empty Plans', () => {
    it('should render when plans array is empty', () => {
      render(<TourPlan plans={[]} dictionary={mockDictionary} />);
      expect(screen.getByText('Tour Plan')).toBeInTheDocument();
    });
  });
});

