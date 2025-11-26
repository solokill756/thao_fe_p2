import { getCategoriesAndDestinationsAction } from '../getCategoriesAndDestinationsAction';
import { getServerSession } from 'next-auth';
import { fetchDestinations } from '@/app/lib/services/destinationService';
import { fetchCategories } from '@/app/lib/services/categoriesService';
import { createUnauthorizedError } from '@/app/lib/utils/errors';

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/app/lib/services/destinationService', () => ({
  fetchDestinations: jest.fn(),
}));

jest.mock('@/app/lib/services/categoriesService', () => ({
  fetchCategories: jest.fn(),
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
const mockFetchDestinations = fetchDestinations as jest.MockedFunction<
  typeof fetchDestinations
>;
const mockFetchCategories = fetchCategories as jest.MockedFunction<
  typeof fetchCategories
>;
const mockCreateUnauthorizedError = createUnauthorizedError as jest.MockedFunction<
  typeof createUnauthorizedError
>;

describe('getCategoriesAndDestinationsAction', () => {
  const mockCategories = [
    {
      category_id: 1,
      name: 'Adventure',
      description: 'Adventure tours',
    },
  ];

  const mockDestinations = [
    {
      destination_id: 1,
      name: 'Paris',
      country: 'France',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Successful Cases', () => {
    it('should return categories and destinations when admin session exists', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchCategories.mockResolvedValue(mockCategories as any);
      mockFetchDestinations.mockResolvedValue(mockDestinations as any);

      const result = await getCategoriesAndDestinationsAction();

      expect(result.success).toBe(true);
      expect(result.categories).toEqual(mockCategories);
      expect(result.destinations).toEqual(mockDestinations);
    });

    it('should fetch categories and destinations in parallel', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchCategories.mockResolvedValue(mockCategories as any);
      mockFetchDestinations.mockResolvedValue(mockDestinations as any);

      await getCategoriesAndDestinationsAction();

      expect(mockFetchCategories).toHaveBeenCalled();
      expect(mockFetchDestinations).toHaveBeenCalled();
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

      const result = await getCategoriesAndDestinationsAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'Error getting categories and destinations'
      );
    });

    it('should throw unauthorized error when session is null', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await getCategoriesAndDestinationsAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'Error getting categories and destinations'
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle fetchCategories errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchCategories.mockRejectedValue(new Error('Database error'));
      mockFetchDestinations.mockResolvedValue(mockDestinations as any);

      const result = await getCategoriesAndDestinationsAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'Error getting categories and destinations'
      );
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle fetchDestinations errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchCategories.mockResolvedValue(mockCategories as any);
      mockFetchDestinations.mockRejectedValue(new Error('Database error'));

      const result = await getCategoriesAndDestinationsAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'Error getting categories and destinations'
      );
    });
  });
});

