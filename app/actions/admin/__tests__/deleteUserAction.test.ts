import { deleteUserAction } from '../deleteUserAction';
import { getServerSession } from 'next-auth';
import { deleteUserById } from '@/app/lib/services/userService';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import { revalidateAllUserCaches } from '@/app/lib/services/cacheUtils';

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/app/lib/services/userService', () => ({
  deleteUserById: jest.fn(),
}));

jest.mock('@/app/lib/services/cacheUtils', () => ({
  revalidateAllUserCaches: jest.fn(),
}));

jest.mock('@/app/lib/utils/errors', () => ({
  createUnauthorizedError: jest.fn((message) => new Error(message)),
}));

jest.mock('@/app/lib/authOptions', () => ({
  authOptions: {},
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockDeleteUserById = deleteUserById as jest.MockedFunction<
  typeof deleteUserById
>;
const mockRevalidateAllUserCaches = revalidateAllUserCaches as jest.MockedFunction<
  typeof revalidateAllUserCaches
>;
const mockCreateUnauthorizedError = createUnauthorizedError as jest.MockedFunction<
  typeof createUnauthorizedError
>;

describe('deleteUserAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Successful Cases', () => {
    it('should delete user successfully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockDeleteUserById.mockResolvedValue(undefined);

      const result = await deleteUserAction(1);

      expect(result.success).toBe(true);
      expect(result.message).toBe('User deleted successfully');
      expect(mockDeleteUserById).toHaveBeenCalledWith(1);
      expect(mockRevalidateAllUserCaches).toHaveBeenCalled();
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

      const result = await deleteUserAction(1);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Unauthorized');
    });

    it('should throw unauthorized error when session is null', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await deleteUserAction(1);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Unauthorized');
    });

    it('should throw unauthorized error when session user is null', async () => {
      mockGetServerSession.mockResolvedValue({
        user: null,
      } as any);

      const result = await deleteUserAction(1);

      expect(result.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle deleteUserById errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockDeleteUserById.mockRejectedValue(new Error('Database error'));

      const result = await deleteUserAction(1);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Database error');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle non-Error exceptions', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockDeleteUserById.mockRejectedValue('String error');

      const result = await deleteUserAction(1);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to delete user');
    });

    it('should log error details when error occurs', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const error = new Error('Test error');
      mockDeleteUserById.mockRejectedValue(error);

      await deleteUserAction(1);

      expect(console.error).toHaveBeenCalledWith(
        'Error deleting user:',
        expect.objectContaining({
          error: 'Test error',
          action: 'deleteUserAction',
        })
      );
    });
  });
});

