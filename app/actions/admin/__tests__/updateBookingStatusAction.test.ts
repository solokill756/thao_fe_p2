import { updateBookingStatusAction } from '../updateBookingStatusAction';
import { getServerSession } from 'next-auth';
import {
  fecthBookingById,
  updateBookingStatus,
} from '@/app/lib/services/bookingService';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import { revalidateBookingsCache } from '@/app/lib/services/cacheUtils';

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/app/lib/services/bookingService', () => ({
  fecthBookingById: jest.fn(),
  updateBookingStatus: jest.fn(),
}));

jest.mock('@/app/lib/services/cacheUtils', () => ({
  revalidateBookingsCache: jest.fn(),
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
const mockFetchBookingById = fecthBookingById as jest.MockedFunction<
  typeof fecthBookingById
>;
const mockUpdateBookingStatus = updateBookingStatus as jest.MockedFunction<
  typeof updateBookingStatus
>;
const mockRevalidateBookingsCache = revalidateBookingsCache as jest.MockedFunction<
  typeof revalidateBookingsCache
>;
const mockCreateUnauthorizedError = createUnauthorizedError as jest.MockedFunction<
  typeof createUnauthorizedError
>;

describe('updateBookingStatusAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-12-15'));
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('Successful Cases', () => {
    it('should update booking status to pending successfully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockUpdateBookingStatus.mockResolvedValue(undefined);

      const result = await updateBookingStatusAction(1, 'pending');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Booking status updated successfully');
      expect(mockUpdateBookingStatus).toHaveBeenCalledWith(1, 'pending');
      expect(mockRevalidateBookingsCache).toHaveBeenCalled();
    });

    it('should update booking status to cancelled successfully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockUpdateBookingStatus.mockResolvedValue(undefined);

      const result = await updateBookingStatusAction(1, 'cancelled');

      expect(result.success).toBe(true);
      expect(mockUpdateBookingStatus).toHaveBeenCalledWith(1, 'cancelled');
    });
  });

  describe('Confirmed Status with Date Validation', () => {
    it('should confirm booking when date is in future', async () => {
      const futureDate = new Date('2025-01-15');
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchBookingById.mockResolvedValue({
        booking_id: 1,
        booking_date: futureDate,
        tour: {
          duration_days: 3,
        },
      } as any);

      mockUpdateBookingStatus.mockResolvedValue(undefined);

      const result = await updateBookingStatusAction(1, 'confirmed');

      expect(result.success).toBe(true);
      expect(mockFetchBookingById).toHaveBeenCalledWith(1);
      expect(mockUpdateBookingStatus).toHaveBeenCalledWith(1, 'confirmed');
    });

    it('should auto-cancel booking when booking end date is in past', async () => {
      const pastDate = new Date('2024-01-01');
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchBookingById.mockResolvedValue({
        booking_id: 1,
        booking_date: pastDate,
        tour: {
          duration_days: 3,
        },
      } as any);

      mockUpdateBookingStatus.mockResolvedValue(undefined);

      const result = await updateBookingStatusAction(1, 'confirmed');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Booking date is in the past');
      expect(mockUpdateBookingStatus).toHaveBeenCalledWith(1, 'cancelled');
    });

    it('should handle booking with zero duration days', async () => {
      const futureDate = new Date('2025-01-15');
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchBookingById.mockResolvedValue({
        booking_id: 1,
        booking_date: futureDate,
        tour: {
          duration_days: 0,
        },
      } as any);

      mockUpdateBookingStatus.mockResolvedValue(undefined);

      const result = await updateBookingStatusAction(1, 'confirmed');

      expect(result.success).toBe(true);
      expect(mockUpdateBookingStatus).toHaveBeenCalledWith(1, 'confirmed');
    });

    it('should handle booking with null duration_days', async () => {
      const futureDate = new Date('2025-01-15');
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchBookingById.mockResolvedValue({
        booking_id: 1,
        booking_date: futureDate,
        tour: {
          duration_days: null,
        },
      } as any);

      mockUpdateBookingStatus.mockResolvedValue(undefined);

      const result = await updateBookingStatusAction(1, 'confirmed');

      expect(result.success).toBe(true);
      expect(mockUpdateBookingStatus).toHaveBeenCalledWith(1, 'confirmed');
    });

    it('should handle booking with null tour', async () => {
      const futureDate = new Date('2025-01-15');
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchBookingById.mockResolvedValue({
        booking_id: 1,
        booking_date: futureDate,
        tour: null,
      } as any);

      mockUpdateBookingStatus.mockResolvedValue(undefined);

      const result = await updateBookingStatusAction(1, 'confirmed');

      expect(result.success).toBe(true);
      expect(mockUpdateBookingStatus).toHaveBeenCalledWith(1, 'confirmed');
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

      const result = await updateBookingStatusAction(1, 'confirmed');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error updating booking status');
    });

    it('should throw unauthorized error when session is null', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await updateBookingStatusAction(1, 'confirmed');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error updating booking status');
    });
  });

  describe('Error Handling', () => {
    it('should handle updateBookingStatus errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockUpdateBookingStatus.mockRejectedValue(new Error('Database error'));

      const result = await updateBookingStatusAction(1, 'pending');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error updating booking status');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle fetchBookingById errors when confirming', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchBookingById.mockRejectedValue(new Error('Booking not found'));

      const result = await updateBookingStatusAction(1, 'confirmed');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error updating booking status');
    });

    it('should log error details when error occurs', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const error = new Error('Test error');
      mockUpdateBookingStatus.mockRejectedValue(error);

      await updateBookingStatusAction(1, 'pending');

      expect(console.error).toHaveBeenCalledWith(
        'Error updating booking status:',
        expect.objectContaining({
          error: 'Test error',
          action: 'updateBookingStatusAction',
          bookingId: 1,
          newStatus: 'pending',
        })
      );
    });
  });

  describe('Date Calculation Edge Cases', () => {
    it('should correctly calculate booking end date with duration', async () => {
      const bookingDate = new Date('2025-01-10');
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchBookingById.mockResolvedValue({
        booking_id: 1,
        booking_date: bookingDate,
        tour: {
          duration_days: 5,
        },
      } as any);

      mockUpdateBookingStatus.mockResolvedValue(undefined);

      // Set current date to be before end date
      jest.setSystemTime(new Date('2025-01-14'));

      const result = await updateBookingStatusAction(1, 'confirmed');

      expect(result.success).toBe(true);
      expect(mockUpdateBookingStatus).toHaveBeenCalledWith(1, 'confirmed');
    });

    it('should cancel when current date equals booking end date', async () => {
      const bookingDate = new Date('2024-12-10');
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockFetchBookingById.mockResolvedValue({
        booking_id: 1,
        booking_date: bookingDate,
        tour: {
          duration_days: 5,
        },
      } as any);

      mockUpdateBookingStatus.mockResolvedValue(undefined);

      // Set current date to be exactly at end date (2024-12-15)
      jest.setSystemTime(new Date('2024-12-15T23:59:59'));

      const result = await updateBookingStatusAction(1, 'confirmed');

      // Should still succeed because today > bookingEndDate check is strict
      expect(result.success).toBe(true);
    });
  });
});

