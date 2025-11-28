import { deleteTourAction } from '../deleteTourAction';
import { getServerSession } from 'next-auth';
import { deleteTour } from '@/app/lib/services/tourService';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import { revalidateAllTourCaches } from '@/app/lib/services/cacheUtils';

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/app/lib/services/tourService', () => ({
  deleteTour: jest.fn(),
}));

jest.mock('@/app/lib/services/cacheUtils', () => ({
  revalidateAllTourCaches: jest.fn(),
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
const mockDeleteTour = deleteTour as jest.MockedFunction<typeof deleteTour>;
const mockRevalidateAllTourCaches = revalidateAllTourCaches as jest.MockedFunction<
  typeof revalidateAllTourCaches
>;
const mockCreateUnauthorizedError = createUnauthorizedError as jest.MockedFunction<
  typeof createUnauthorizedError
>;

describe('deleteTourAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Successful Cases', () => {
    it('should delete tour successfully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockDeleteTour.mockResolvedValue(undefined);

      const result = await deleteTourAction(1);

      expect(result.success).toBe(true);
      expect(mockDeleteTour).toHaveBeenCalledWith(1);
      expect(mockRevalidateAllTourCaches).toHaveBeenCalled();
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

      const result = await deleteTourAction(1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });

    it('should throw unauthorized error when session is null', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await deleteTourAction(1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });

  describe('Error Handling', () => {
    it('should handle deleteTour errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockDeleteTour.mockRejectedValue(new Error('Database error'));

      const result = await deleteTourAction(1);

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

      mockDeleteTour.mockRejectedValue('String error');

      const result = await deleteTourAction(1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error deleting tour');
    });

    it('should log error details when error occurs', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const error = new Error('Test error');
      mockDeleteTour.mockRejectedValue(error);

      await deleteTourAction(1);

      expect(console.error).toHaveBeenCalledWith(
        'Error deleting tour:',
        expect.objectContaining({
          error: 'Test error',
          action: 'deleteTourAction',
        })
      );
    });
  });
});

