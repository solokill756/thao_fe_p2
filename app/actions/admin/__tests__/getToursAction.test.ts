import { getToursAction } from '../getToursAction';
import { getServerSession } from 'next-auth';
import { fetchAdminTours } from '@/app/lib/services/tourService';
import { createUnauthorizedError } from '@/app/lib/utils/errors';

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/app/lib/services/tourService', () => ({
  fetchAdminTours: jest.fn(),
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
const mockFetchAdminTours = fetchAdminTours as jest.MockedFunction<
  typeof fetchAdminTours
>;
const mockCreateUnauthorizedError = createUnauthorizedError as jest.MockedFunction<
  typeof createUnauthorizedError
>;

describe('getToursAction', () => {
  const mockTours = [
    {
      tour_id: 1,
      title: 'Paris Tour',
      price_per_person: 1000,
    },
  ] as any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Successful Cases', () => {
    it('should return tours when admin session exists', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchAdminTours.mockResolvedValue(mockTours);

      const result = await getToursAction();

      expect(result.success).toBe(true);
      expect(result.tours).toEqual(mockTours);
      expect(mockFetchAdminTours).toHaveBeenCalledTimes(1);
    });

    it('should call fetchAdminTours when authorized', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchAdminTours.mockResolvedValue(mockTours);

      await getToursAction();

      expect(mockFetchAdminTours).toHaveBeenCalled();
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

      const result = await getToursAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error getting tours');
    });

    it('should throw unauthorized error when session is null', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await getToursAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error getting tours');
    });
  });

  describe('Error Handling', () => {
    it('should handle fetchAdminTours errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchAdminTours.mockRejectedValue(new Error('Database error'));

      const result = await getToursAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error getting tours');
      expect(console.error).toHaveBeenCalled();
    });
  });
});

