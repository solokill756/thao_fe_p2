import { getUsersAction } from '../getUsersAction';
import { getServerSession } from 'next-auth';
import { fetchAdminUsers } from '@/app/lib/services/userService';
import { createUnauthorizedError } from '@/app/lib/utils/errors';

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/app/lib/services/userService', () => ({
  fetchAdminUsers: jest.fn(),
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
const mockFetchAdminUsers = fetchAdminUsers as jest.MockedFunction<
  typeof fetchAdminUsers
>;
const mockCreateUnauthorizedError = createUnauthorizedError as jest.MockedFunction<
  typeof createUnauthorizedError
>;

describe('getUsersAction', () => {
  const mockUsers = [
    {
      user_id: 1,
      full_name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
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
    it('should return users when admin session exists', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchAdminUsers.mockResolvedValue(mockUsers);

      const result = await getUsersAction();

      expect(result.success).toBe(true);
      expect(result.users).toEqual(mockUsers);
      expect(mockFetchAdminUsers).toHaveBeenCalledTimes(1);
    });

    it('should call fetchAdminUsers when authorized', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchAdminUsers.mockResolvedValue(mockUsers);

      await getUsersAction();

      expect(mockFetchAdminUsers).toHaveBeenCalled();
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

      const result = await getUsersAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error getting users');
    });

    it('should throw unauthorized error when session is null', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await getUsersAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error getting users');
    });

    it('should throw unauthorized error when session user is null', async () => {
      mockGetServerSession.mockResolvedValue({
        user: null,
      } as any);

      const result = await getUsersAction();

      expect(result.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle fetchAdminUsers errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchAdminUsers.mockRejectedValue(new Error('Database error'));

      const result = await getUsersAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error getting users');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle non-Error exceptions', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchAdminUsers.mockRejectedValue('String error');

      const result = await getUsersAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error getting users');
    });

    it('should log error details when error occurs', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const error = new Error('Test error');
      mockFetchAdminUsers.mockRejectedValue(error);

      await getUsersAction();

      expect(console.error).toHaveBeenCalledWith(
        'Error getting users:',
        expect.objectContaining({
          error: 'Test error',
          action: 'getUsersAction',
        })
      );
    });
  });
});

