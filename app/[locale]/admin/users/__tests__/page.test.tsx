import { getDictionary } from '@/app/lib/get-dictionary';
import { getAdminUsers } from '@/app/lib/services/userService.server';
import AdminUsersPage from '../page';

// Mock dependencies
jest.mock('@/app/lib/get-dictionary', () => ({
  getDictionary: jest.fn(),
}));

jest.mock('@/app/lib/services/userService.server', () => ({
  getAdminUsers: jest.fn(),
}));

jest.mock('../AdminUsersClient', () => ({
  __esModule: true,
  default: ({ locale, dictionary, initialUsers }: any) => (
    <div data-testid="admin-users-client">
      Locale: {locale}, Users: {initialUsers?.length || 0}
    </div>
  ),
}));

const mockGetDictionary = getDictionary as jest.MockedFunction<
  typeof getDictionary
>;
const mockGetAdminUsers = getAdminUsers as jest.MockedFunction<
  typeof getAdminUsers
>;

describe('AdminUsersPage', () => {
  const mockDictionary = {
    admin: {
      users: {
        userManagement: 'User Management',
      },
    },
  };

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
    mockGetDictionary.mockResolvedValue(mockDictionary as any);
    mockGetAdminUsers.mockResolvedValue(mockUsers);
  });

  describe('async params handling', () => {
    it('should await params and extract locale correctly', async () => {
      const params = Promise.resolve({ locale: 'en' });
      await AdminUsersPage({ params });

      expect(mockGetDictionary).toHaveBeenCalledWith('en');
      expect(mockGetAdminUsers).toHaveBeenCalled();
    });

    it('should handle English locale', async () => {
      const params = Promise.resolve({ locale: 'en' });
      await AdminUsersPage({ params });

      expect(mockGetDictionary).toHaveBeenCalledWith('en');
      expect(mockGetDictionary).toHaveBeenCalledTimes(1);
    });

    it('should handle Vietnamese locale', async () => {
      jest.clearAllMocks();
      const params = Promise.resolve({ locale: 'vi' });
      await AdminUsersPage({ params });

      expect(mockGetDictionary).toHaveBeenCalledWith('vi');
    });

    it('should handle different locale values', async () => {
      const testCases = ['en', 'vi'] as const;

      for (const locale of testCases) {
        jest.clearAllMocks();
        const params = Promise.resolve({ locale });
        await AdminUsersPage({ params });
        expect(mockGetDictionary).toHaveBeenCalledWith(locale);
      }
    });
  });

  describe('data fetching', () => {
    it('should fetch dictionary for the locale', async () => {
      jest.clearAllMocks();
      const params = Promise.resolve({ locale: 'en' });
      await AdminUsersPage({ params });

      expect(mockGetDictionary).toHaveBeenCalledTimes(1);
      expect(mockGetDictionary).toHaveBeenCalledWith('en');
    });

    it('should fetch users', async () => {
      jest.clearAllMocks();
      const params = Promise.resolve({ locale: 'en' });
      await AdminUsersPage({ params });

      expect(mockGetAdminUsers).toHaveBeenCalledTimes(1);
    });

    it('should await params before fetching dictionary and users', async () => {
      jest.clearAllMocks();
      const params = Promise.resolve({ locale: 'vi' });
      await AdminUsersPage({ params });

      expect(mockGetDictionary).toHaveBeenCalledWith('vi');
      expect(mockGetAdminUsers).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle dictionary fetch errors', async () => {
      mockGetDictionary.mockRejectedValueOnce(
        new Error('Failed to fetch dictionary')
      );

      const params = Promise.resolve({ locale: 'en' });

      await expect(AdminUsersPage({ params })).rejects.toThrow(
        'Failed to fetch dictionary'
      );
    });

    it('should handle users fetch errors', async () => {
      mockGetAdminUsers.mockRejectedValueOnce(new Error('Failed to fetch users'));

      const params = Promise.resolve({ locale: 'en' });

      await expect(AdminUsersPage({ params })).rejects.toThrow(
        'Failed to fetch users'
      );
    });

    it('should propagate errors from getAdminUsers', async () => {
      const error = new Error('Network error');
      mockGetAdminUsers.mockRejectedValueOnce(error);

      const params = Promise.resolve({ locale: 'en' });

      await expect(AdminUsersPage({ params })).rejects.toThrow('Network error');
    });
  });

  describe('locale type handling', () => {
    it('should cast locale to correct type', async () => {
      const params = Promise.resolve({ locale: 'en' });
      await AdminUsersPage({ params });

      expect(mockGetDictionary).toHaveBeenCalledWith('en');
    });

    it('should handle vi locale type', async () => {
      const params = Promise.resolve({ locale: 'vi' });
      await AdminUsersPage({ params });

      expect(mockGetDictionary).toHaveBeenCalledWith('vi');
    });
  });
});

