import { updateTourAction } from '../updateTourAction';
import { getServerSession } from 'next-auth';
import { updateTour } from '@/app/lib/services/tourService';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import { getDictionary } from '@/app/lib/get-dictionary';
import { revalidateAllTourCaches } from '@/app/lib/services/cacheUtils';

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/app/lib/services/tourService', () => ({
  updateTour: jest.fn(),
}));

jest.mock('@/app/lib/services/cacheUtils', () => ({
  revalidateAllTourCaches: jest.fn(),
}));

jest.mock('@/app/lib/get-dictionary', () => ({
  getDictionary: jest.fn(),
}));

jest.mock('@/app/lib/utils/errors', () => ({
  createUnauthorizedError: jest.fn((message) => new Error(message)),
}));

jest.mock('@/app/lib/authOptions', () => ({
  authOptions: {},
}));

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockUpdateTour = updateTour as jest.MockedFunction<typeof updateTour>;
const mockGetDictionary = getDictionary as jest.MockedFunction<
  typeof getDictionary
>;
const mockRevalidateAllTourCaches = revalidateAllTourCaches as jest.MockedFunction<
  typeof revalidateAllTourCaches
>;
const mockCreateUnauthorizedError = createUnauthorizedError as jest.MockedFunction<
  typeof createUnauthorizedError
>;

describe('updateTourAction', () => {
  const mockDict = {
    admin: {
      tours: {
        validation: {
          tourIdMustBeNumber: 'Tour ID must be a number',
          titleRequired: 'Title is required',
          descriptionRequired: 'Description is required',
          priceMustBePositive: 'Price must be positive',
        },
        validationFailed: 'Validation failed',
      },
    },
  };

  const validTourData = {
    tour_id: 1,
    title: 'Updated Paris Tour',
    description: 'An updated beautiful tour of Paris',
    price_per_person: 1200,
    duration_days: 6,
    max_guests: 25,
    locale: 'en' as const,
  };

  const mockUpdatedTour = {
    tour_id: 1,
    title: 'Updated Paris Tour',
    price_per_person: 1200,
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDictionary.mockResolvedValue(mockDict as any);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Successful Cases', () => {
    it('should update tour successfully with valid data', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockUpdateTour.mockResolvedValue(mockUpdatedTour);

      const result = await updateTourAction(validTourData);

      expect(result.success).toBe(true);
      expect(result.tour).toEqual(mockUpdatedTour);
      expect(mockUpdateTour).toHaveBeenCalled();
      expect(mockRevalidateAllTourCaches).toHaveBeenCalled();
    });

    it('should update tour with only tour_id and optional fields', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockUpdateTour.mockResolvedValue(mockUpdatedTour);

      const result = await updateTourAction({
        tour_id: 1,
        title: 'Updated Title',
        locale: 'en' as const,
      });

      expect(result.success).toBe(true);
    });

    it('should use default locale when locale is not provided', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockUpdateTour.mockResolvedValue(mockUpdatedTour);

      const { locale, ...dataWithoutLocale } = validTourData;
      await updateTourAction(dataWithoutLocale);

      expect(mockGetDictionary).toHaveBeenCalledWith('en');
    });
  });

  describe('Validation', () => {
    it('should return validation errors for missing tour_id', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const result = await updateTourAction({
        ...validTourData,
        tour_id: undefined as any,
      });

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should return validation errors for invalid tour_id', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const result = await updateTourAction({
        ...validTourData,
        tour_id: -1,
      });

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should return validation errors for short description when provided', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const result = await updateTourAction({
        tour_id: 1,
        description: 'Short',
        locale: 'en' as const,
      });

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should accept partial updates with only tour_id', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockUpdateTour.mockResolvedValue(mockUpdatedTour);

      const result = await updateTourAction({
        tour_id: 1,
        locale: 'en' as const,
      });

      expect(result.success).toBe(true);
    });
  });

  describe('Authorization', () => {
    it('should throw unauthorized error when user is not admin', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'user',
          id: '1',
        },
      } as any);

      mockCreateUnauthorizedError.mockReturnValue(new Error('Unauthorized'));

      const result = await updateTourAction(validTourData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });

    it('should throw unauthorized error when session is null', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await updateTourAction(validTourData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });

  describe('Error Handling', () => {
    it('should handle updateTour errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockUpdateTour.mockRejectedValue(new Error('Database error'));

      const result = await updateTourAction(validTourData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle non-Error exceptions', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockUpdateTour.mockRejectedValue('String error');

      const result = await updateTourAction(validTourData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error updating tour');
    });
  });
});

