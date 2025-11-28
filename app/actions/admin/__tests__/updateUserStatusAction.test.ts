import { updateUserStatusAction } from '../updateUserStatusAction';
import { getServerSession } from 'next-auth';
import { updateUserStatus } from '@/app/lib/services/userService';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import { revalidateAllUserCaches } from '@/app/lib/services/cacheUtils';

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/app/lib/services/userService', () => ({
  updateUserStatus: jest.fn(),
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
const mockUpdateUserStatus = updateUserStatus as jest.MockedFunction<
  typeof updateUserStatus
>;
const mockRevalidateAllUserCaches =
  revalidateAllUserCaches as jest.MockedFunction<
    typeof revalidateAllUserCaches
  >;
const mockCreateUnauthorizedError =
  createUnauthorizedError as jest.MockedFunction<
    typeof createUnauthorizedError
  >;

describe('updateUserStatusAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Successful Cases', () => {
    it('should update user status to admin successfully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockUpdateUserStatus.mockResolvedValue(undefined);

      const result = await updateUserStatusAction(1, 'admin');

      expect(result.success).toBe(true);
      expect(result.message).toBe('User status updated successfully');
      expect(mockUpdateUserStatus).toHaveBeenCalledWith(1, 'admin');
      expect(mockRevalidateAllUserCaches).toHaveBeenCalled();
    });

    it('should update user status to user successfully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockUpdateUserStatus.mockResolvedValue(undefined);

      const result = await updateUserStatusAction(1, 'user');

      expect(result.success).toBe(true);
      expect(mockUpdateUserStatus).toHaveBeenCalledWith(1, 'user');
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

      const result = await updateUserStatusAction(1, 'admin');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Unauthorized');
    });

    it('should throw unauthorized error when session is null', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await updateUserStatusAction(1, 'admin');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Unauthorized');
    });

    it('should throw unauthorized error when session user is null', async () => {
      mockGetServerSession.mockResolvedValue({
        user: null,
      } as any);

      const result = await updateUserStatusAction(1, 'admin');

      expect(result.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle updateUserStatus errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockUpdateUserStatus.mockRejectedValue(new Error('Database error'));

      const result = await updateUserStatusAction(1, 'admin');

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

      mockUpdateUserStatus.mockRejectedValue('String error');

      const result = await updateUserStatusAction(1, 'admin');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to update user status');
    });

    it('should log error details when error occurs', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const error = new Error('Test error');
      mockUpdateUserStatus.mockRejectedValue(error);

      await updateUserStatusAction(1, 'admin');

      expect(console.error).toHaveBeenCalledWith(
        'Error updating user status:',
        expect.objectContaining({
          error: 'Test error',
          action: 'updateUserStatusAction',
        })
      );
    });
  });
});
