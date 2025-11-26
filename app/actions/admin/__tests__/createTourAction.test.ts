import { createTourAction } from '../createTourAction';
import { getServerSession } from 'next-auth';
import { createTour } from '@/app/lib/services/tourService';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import { getDictionary } from '@/app/lib/get-dictionary';
import { revalidateAllTourCaches } from '@/app/lib/services/cacheUtils';

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/app/lib/services/tourService', () => ({
  createTour: jest.fn(),
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
const mockCreateTour = createTour as jest.MockedFunction<typeof createTour>;
const mockGetDictionary = getDictionary as jest.MockedFunction<
  typeof getDictionary
>;
const mockRevalidateAllTourCaches = revalidateAllTourCaches as jest.MockedFunction<
  typeof revalidateAllTourCaches
>;
const mockCreateUnauthorizedError = createUnauthorizedError as jest.MockedFunction<
  typeof createUnauthorizedError
>;

describe('createTourAction', () => {
  const mockDict = {
    admin: {
      tours: {
        validation: {
          titleRequired: 'Title is required',
          descriptionRequired: 'Description is required',
          priceMustBePositive: 'Price must be positive',
        },
        validationFailed: 'Validation failed',
      },
    },
  };

  const validTourData = {
    title: 'Paris Tour',
    description: 'A beautiful tour of Paris',
    price_per_person: 1000,
    duration_days: 5,
    max_guests: 20,
    locale: 'en' as const,
  };

  const mockCreatedTour = {
    tour_id: 1,
    title: 'Paris Tour',
    price_per_person: 1000,
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
    it('should create tour successfully with valid data', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockCreateTour.mockResolvedValue(mockCreatedTour);

      const result = await createTourAction(validTourData);

      expect(result.success).toBe(true);
      expect(result.tour).toEqual(mockCreatedTour);
      expect(mockCreateTour).toHaveBeenCalled();
      expect(mockRevalidateAllTourCaches).toHaveBeenCalled();
    });

    it('should use default locale when locale is not provided', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockCreateTour.mockResolvedValue(mockCreatedTour);

      const { locale, ...dataWithoutLocale } = validTourData;
      await createTourAction(dataWithoutLocale);

      expect(mockGetDictionary).toHaveBeenCalledWith('en');
    });

    it('should use provided locale', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockCreateTour.mockResolvedValue(mockCreatedTour);

      await createTourAction({ ...validTourData, locale: 'vi' });

      expect(mockGetDictionary).toHaveBeenCalledWith('vi');
    });
  });

  describe('Validation', () => {
    it('should return validation errors for missing title', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const result = await createTourAction({
        ...validTourData,
        title: '',
      });

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.error).toBe('Validation failed');
    });

    it('should return validation errors for short description', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const result = await createTourAction({
        ...validTourData,
        description: 'Short',
      });

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should return validation errors for negative price', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const result = await createTourAction({
        ...validTourData,
        price_per_person: -100,
      });

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should return validation errors for zero duration', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const result = await createTourAction({
        ...validTourData,
        duration_days: 0,
      });

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should accept optional fields', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockCreateTour.mockResolvedValue(mockCreatedTour);

      const result = await createTourAction({
        ...validTourData,
        cover_image_url: '/images/tour.jpg',
        gallery_images: ['/images/gallery1.jpg'],
        start_date: new Date('2025-01-01'),
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

      const result = await createTourAction(validTourData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });

    it('should throw unauthorized error when session is null', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await createTourAction(validTourData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });

  describe('Error Handling', () => {
    it('should handle createTour errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockCreateTour.mockRejectedValue(new Error('Database error'));

      const result = await createTourAction(validTourData);

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

      mockCreateTour.mockRejectedValue('String error');

      const result = await createTourAction(validTourData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error creating tour');
    });
  });
});

