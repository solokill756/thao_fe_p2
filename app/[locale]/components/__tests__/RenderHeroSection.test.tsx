import React from 'react';
import { render, screen } from '@testing-library/react';
import RenderHeroSection from '../RenderHeroSection';
import { HERO_SECTION_CONSTANTS } from '@/app/lib/constants';

// Mock getDestinations
jest.mock('@/app/lib/services/destinationService.server', () => ({
  getDestinations: jest.fn(),
}));

// Mock findTourAction
jest.mock('@/app/actions/home/findTourAction', () => ({
  findTourAction: jest.fn(),
}));

// Mock SubmitButton
jest.mock('@/app/components/common/SubmitButton', () => {
  return function MockSubmitButton() {
    return <button type="submit">Find Tour</button>;
  };
});

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="map-pin-icon" />,
  Search: () => <div data-testid="search-icon" />,
}));

const {
  getDestinations,
} = require('@/app/lib/services/destinationService.server');

describe('RenderHeroSection Component', () => {
  const mockDictionary = {
    homepage: {
      title: 'Test Title',
      greeting: 'Test Greeting',
    },
  } as any;

  const mockDestinations = [
    {
      destination_id: 1,
      name: 'Paris',
      country: 'France',
    },
    {
      destination_id: 2,
      name: 'Tokyo',
      country: 'Japan',
    },
    {
      destination_id: 3,
      name: 'New York',
      country: null,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    getDestinations.mockResolvedValue(mockDestinations);
  });

  describe('Basic Rendering', () => {
    it('should render hero section', async () => {
      const component = await RenderHeroSection({ dictionary: mockDictionary });
      const { container } = render(component);
      const heroSection = container.querySelector('.relative.h-\\[600px\\]');
      expect(heroSection).toBeInTheDocument();
    });

    it('should render title from dictionary', async () => {
      const component = await RenderHeroSection({ dictionary: mockDictionary });
      render(component);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render greeting from dictionary', async () => {
      const component = await RenderHeroSection({ dictionary: mockDictionary });
      render(component);
      expect(screen.getByText('Test Greeting')).toBeInTheDocument();
    });

    it('should use constant fallback when dictionary values are missing', async () => {
      const incompleteDict = { homepage: {} } as any;
      const component = await RenderHeroSection({ dictionary: incompleteDict });
      render(component);
      expect(
        screen.getByText(HERO_SECTION_CONSTANTS.DEFAULT_TITLE)
      ).toBeInTheDocument();
      expect(
        screen.getByText(HERO_SECTION_CONSTANTS.DEFAULT_GREETING)
      ).toBeInTheDocument();
    });
  });

  describe('Background Image', () => {
    it('should render background image', async () => {
      const component = await RenderHeroSection({ dictionary: mockDictionary });
      const { container } = render(component);
      const image = container.querySelector(
        'img[alt="Hero Section Background"]'
      );
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/images/home_bg.jpg');
    });
  });

  describe('Search Form', () => {
    it('should render search form', async () => {
      const component = await RenderHeroSection({ dictionary: mockDictionary });
      const { container } = render(component);
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('should render destination select', async () => {
      const component = await RenderHeroSection({ dictionary: mockDictionary });
      const { container } = render(component);
      const select = container.querySelector('select[name="destination"]');
      expect(select).toBeInTheDocument();
    });

    it('should render date input', async () => {
      const component = await RenderHeroSection({ dictionary: mockDictionary });
      render(component);
      const dateInput = screen.getByPlaceholderText(
        HERO_SECTION_CONSTANTS.DATE_LABEL
      );
      expect(dateInput).toBeInTheDocument();
      expect(dateInput).toHaveAttribute('type', 'date');
    });

    it('should render guests input', async () => {
      const component = await RenderHeroSection({ dictionary: mockDictionary });
      render(component);
      const guestsInput = screen.getByPlaceholderText(
        HERO_SECTION_CONSTANTS.GUESTS_LABEL
      );
      expect(guestsInput).toBeInTheDocument();
      expect(guestsInput).toHaveAttribute('type', 'number');
      expect(guestsInput).toHaveAttribute('min', '1');
    });

    it('should render submit button', async () => {
      const component = await RenderHeroSection({ dictionary: mockDictionary });
      render(component);
      expect(screen.getByText('Find Tour')).toBeInTheDocument();
    });
  });

  describe('Destinations Dropdown', () => {
    it('should render destinations in select', async () => {
      const component = await RenderHeroSection({ dictionary: mockDictionary });
      render(component);
      expect(screen.getByText('Paris, France')).toBeInTheDocument();
      expect(screen.getByText('Tokyo, Japan')).toBeInTheDocument();
      expect(screen.getByText('New York')).toBeInTheDocument();
    });

    it('should render placeholder option', async () => {
      const component = await RenderHeroSection({ dictionary: mockDictionary });
      render(component);
      expect(
        screen.getByText(HERO_SECTION_CONSTANTS.WHERE_TO_PLACEHOLDER)
      ).toBeInTheDocument();
    });

    it('should handle empty destinations list', async () => {
      getDestinations.mockResolvedValue([]);
      const component = await RenderHeroSection({ dictionary: mockDictionary });
      const { container } = render(component);
      const select = container.querySelector('select[name="destination"]');
      expect(select).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('should render MapPin icon in destination field', async () => {
      const component = await RenderHeroSection({ dictionary: mockDictionary });
      render(component);
      const icons = screen.getAllByTestId('map-pin-icon');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should render Search icons in date and guests fields', async () => {
      const component = await RenderHeroSection({ dictionary: mockDictionary });
      render(component);
      const searchIcons = screen.getAllByTestId('search-icon');
      expect(searchIcons.length).toBe(2);
    });
  });

  describe('Styling', () => {
    it('should have correct container classes', async () => {
      const component = await RenderHeroSection({ dictionary: mockDictionary });
      const { container } = render(component);
      const heroSection = container.querySelector('.relative.h-\\[600px\\]');
      expect(heroSection).toHaveClass('bg-gray-100', 'overflow-hidden');
    });

    it('should have correct form container classes', async () => {
      const component = await RenderHeroSection({ dictionary: mockDictionary });
      const { container } = render(component);
      const formContainer = container.querySelector('.bg-white');
      expect(formContainer).toHaveClass('rounded-2xl', 'shadow-2xl');
    });
  });
});
