import React from 'react';
import { render, screen } from '@testing-library/react';
import SubmitButton from '../../common/SubmitButton';
import { HERO_SECTION_CONSTANTS } from '@/app/lib/constants';

// Mock react-dom
const mockUseFormStatus = jest.fn();
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormStatus: () => mockUseFormStatus(),
}));

describe('SubmitButton Component', () => {
  const mockDictionary = {
    homepage: {
      findTour: 'Find Tour',
      searching: 'Searching...',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFormStatus.mockReturnValue({
      pending: false,
      data: null,
      method: null,
      action: null,
    });
  });

  describe('Basic Rendering', () => {
    it('should render button with default text when not pending', () => {
      render(<SubmitButton dictionary={mockDictionary} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Find Tour');
    });

    it('should render button with searching text when pending', () => {
      mockUseFormStatus.mockReturnValue({
        pending: true,
        data: null,
        method: null,
        action: null,
      });

      render(<SubmitButton dictionary={mockDictionary} />);
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Searching...');
    });
  });

  describe('Button States', () => {
    it('should disable button when pending', () => {
      mockUseFormStatus.mockReturnValue({
        pending: true,
        data: null,
        method: null,
        action: null,
      });

      render(<SubmitButton dictionary={mockDictionary} />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should enable button when not pending', () => {
      render(<SubmitButton dictionary={mockDictionary} />);
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('should have correct disabled styles when pending', () => {
      mockUseFormStatus.mockReturnValue({
        pending: true,
        data: null,
        method: null,
        action: null,
      });

      render(<SubmitButton dictionary={mockDictionary} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:bg-orange-300');
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constant fallback when dictionary.findTour is missing', () => {
      const incompleteDict = {
        homepage: {},
      };

      render(<SubmitButton dictionary={incompleteDict as any} />);
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(HERO_SECTION_CONSTANTS.FIND_TOUR);
    });

    it('should use constant fallback when dictionary.searching is missing', () => {
      const incompleteDict = {
        homepage: {},
      };

      mockUseFormStatus.mockReturnValue({
        pending: true,
        data: null,
        method: null,
        action: null,
      });

      render(<SubmitButton dictionary={incompleteDict as any} />);
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(HERO_SECTION_CONSTANTS.SEARCHING);
    });

    it('should use constant fallback when dictionary is undefined', () => {
      render(<SubmitButton dictionary={undefined as any} />);
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(HERO_SECTION_CONSTANTS.FIND_TOUR);
    });
  });

  describe('Button Attributes', () => {
    it('should have type="submit"', () => {
      render(<SubmitButton dictionary={mockDictionary} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should have correct styling classes', () => {
      render(<SubmitButton dictionary={mockDictionary} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'bg-orange-500',
        'hover:bg-orange-600',
        'text-white',
        'font-bold',
        'rounded-xl'
      );
    });
  });
});
