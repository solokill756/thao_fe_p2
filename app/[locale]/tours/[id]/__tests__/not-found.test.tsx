import React from 'react';
import { render, screen } from '@testing-library/react';
import RenderTourNotFound from '../not-found';
import { getDictionary } from '@/app/lib/get-dictionary';
import { ROUTES } from '@/app/lib/constants';

// Mock getDictionary
jest.mock('@/app/lib/get-dictionary', () => ({
  getDictionary: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: any) {
    return <a href={href}>{children}</a>;
  };
});

const mockGetDictionary = getDictionary as jest.MockedFunction<typeof getDictionary>;

describe('RenderTourNotFound Component', () => {
  const mockDictionary = {
    tourDetail: {
      tourNotFound: 'Tour Not Found',
      tourNotFoundDescription: "The tour you're looking for doesn't exist.",
      backToTours: 'Back to Tours',
    },
    homepage: {
      backToHome: 'Back to Home',
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDictionary.mockResolvedValue(mockDictionary);
  });

  describe('Basic Rendering', () => {
    it('should render not found message', async () => {
      const component = await RenderTourNotFound({});
      render(component);
      expect(screen.getByText('Tour Not Found')).toBeInTheDocument();
    });

    it('should render description', async () => {
      const component = await RenderTourNotFound({});
      render(component);
      expect(
        screen.getByText("The tour you're looking for doesn't exist.")
      ).toBeInTheDocument();
    });

    it('should render back to tours link', async () => {
      const component = await RenderTourNotFound({});
      render(component);
      const link = screen.getByText('Back to Tours');
      expect(link.closest('a')).toHaveAttribute('href', `/en${ROUTES.TOURS_SEARCH}`);
    });
  });

  describe('Locale Handling', () => {
    it('should use default locale when no params', async () => {
      const component = await RenderTourNotFound({});
      render(component);
      expect(mockGetDictionary).toHaveBeenCalledWith('en');
    });

    it('should use locale from params', async () => {
      const params = Promise.resolve({ locale: 'vi' });
      const component = await RenderTourNotFound({ params });
      render(component);
      expect(mockGetDictionary).toHaveBeenCalledWith('vi');
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use homepage fallback when tourDetail.backToTours is missing', async () => {
      const incompleteDict = {
        tourDetail: {
          tourNotFound: 'Tour Not Found',
        },
        homepage: {
          backToHome: 'Back to Home',
        },
      };
      mockGetDictionary.mockResolvedValue(incompleteDict as any);
      const component = await RenderTourNotFound({});
      render(component);
      expect(screen.getByText('Back to Home')).toBeInTheDocument();
    });
  });
});

