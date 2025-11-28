import { getBookingsAction } from '../getBookingsAction';
import { getServerSession } from 'next-auth';
import { fetchBookings } from '@/app/lib/services/bookingService';
import { createUnauthorizedError } from '@/app/lib/utils/errors';

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/app/lib/services/bookingService', () => ({
  fetchBookings: jest.fn(),
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
const mockFetchBookings = fetchBookings as jest.MockedFunction<
  typeof fetchBookings
>;
const mockCreateUnauthorizedError = createUnauthorizedError as jest.MockedFunction<
  typeof createUnauthorizedError
>;

describe('getBookingsAction', () => {
  const mockBookings = [
    {
      booking_id: 1,
      status: 'pending',
      total_price: 1000,
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
    it('should return bookings when admin session exists', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchBookings.mockResolvedValue(mockBookings);

      const result = await getBookingsAction();

      expect(result.success).toBe(true);
      expect(result.bookings).toEqual(mockBookings);
      expect(mockFetchBookings).toHaveBeenCalledTimes(1);
    });

    it('should call fetchBookings when authorized', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchBookings.mockResolvedValue(mockBookings);

      await getBookingsAction();

      expect(mockFetchBookings).toHaveBeenCalled();
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

      const result = await getBookingsAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error getting bookings');
    });

    it('should throw unauthorized error when session is null', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await getBookingsAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error getting bookings');
    });

    it('should throw unauthorized error when session user is null', async () => {
      mockGetServerSession.mockResolvedValue({
        user: null,
      } as any);

      const result = await getBookingsAction();

      expect(result.success).toBe(false);
    });

    it('should throw unauthorized error when session user role is undefined', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: '1',
        },
      } as any);

      const result = await getBookingsAction();

      expect(result.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle fetchBookings errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchBookings.mockRejectedValue(new Error('Database error'));

      const result = await getBookingsAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error getting bookings');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle non-Error exceptions', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchBookings.mockRejectedValue('String error');

      const result = await getBookingsAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error getting bookings');
    });

    it('should log error details when error occurs', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const error = new Error('Test error');
      mockFetchBookings.mockRejectedValue(error);

      await getBookingsAction();

      expect(console.error).toHaveBeenCalledWith(
        'Error getting bookings:',
        expect.objectContaining({
          error: 'Test error',
          action: 'getBookingsAction',
        })
      );
    });
  });
});

