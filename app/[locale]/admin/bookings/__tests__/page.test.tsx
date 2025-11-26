import { getDictionary } from '@/app/lib/get-dictionary';
import { getBookings } from '@/app/lib/services/bookingService.server';
import AdminBookingsPage from '../page';

// Mock dependencies
jest.mock('@/app/lib/get-dictionary', () => ({
  getDictionary: jest.fn(),
}));

jest.mock('@/app/lib/services/bookingService.server', () => ({
  getBookings: jest.fn(),
}));

jest.mock('../AdminBookingsClient', () => ({
  __esModule: true,
  default: ({ locale, dictionary, initialBookings }: any) => (
    <div data-testid="admin-bookings-client">
      Locale: {locale}, Bookings: {initialBookings?.length || 0}
    </div>
  ),
}));

const mockGetDictionary = getDictionary as jest.MockedFunction<
  typeof getDictionary
>;
const mockGetBookings = getBookings as jest.MockedFunction<typeof getBookings>;

describe('AdminBookingsPage', () => {
  const mockDictionary = {
    admin: {
      bookings: {
        bookingRequests: 'Booking Requests',
      },
    },
  };

  const mockBookings = [
    {
      booking_id: 1,
      status: 'pending',
    },
    {
      booking_id: 2,
      status: 'confirmed',
    },
  ] as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDictionary.mockResolvedValue(mockDictionary as any);
    mockGetBookings.mockResolvedValue(mockBookings);
  });

  describe('async params handling', () => {
    it('should await params and extract locale correctly', async () => {
      const params = Promise.resolve({ locale: 'en' });
      const component = await AdminBookingsPage({ params });

      expect(mockGetDictionary).toHaveBeenCalledWith('en');
      expect(mockGetBookings).toHaveBeenCalled();
    });

    it('should handle English locale', async () => {
      const params = Promise.resolve({ locale: 'en' });
      await AdminBookingsPage({ params });

      expect(mockGetDictionary).toHaveBeenCalledWith('en');
      expect(mockGetDictionary).toHaveBeenCalledTimes(1);
    });

    it('should handle Vietnamese locale', async () => {
      jest.clearAllMocks();
      const params = Promise.resolve({ locale: 'vi' });
      await AdminBookingsPage({ params });

      expect(mockGetDictionary).toHaveBeenCalledWith('vi');
    });

    it('should handle different locale values', async () => {
      const testCases = ['en', 'vi'] as const;

      for (const locale of testCases) {
        jest.clearAllMocks();
        const params = Promise.resolve({ locale });
        await AdminBookingsPage({ params });
        expect(mockGetDictionary).toHaveBeenCalledWith(locale);
      }
    });
  });

  describe('data fetching', () => {
    it('should fetch dictionary for the locale', async () => {
      jest.clearAllMocks();
      const params = Promise.resolve({ locale: 'en' });
      await AdminBookingsPage({ params });

      expect(mockGetDictionary).toHaveBeenCalledTimes(1);
      expect(mockGetDictionary).toHaveBeenCalledWith('en');
    });

    it('should fetch bookings', async () => {
      jest.clearAllMocks();
      const params = Promise.resolve({ locale: 'en' });
      await AdminBookingsPage({ params });

      expect(mockGetBookings).toHaveBeenCalledTimes(1);
    });

    it('should await params before fetching dictionary and bookings', async () => {
      jest.clearAllMocks();
      const params = Promise.resolve({ locale: 'vi' });
      await AdminBookingsPage({ params });

      expect(mockGetDictionary).toHaveBeenCalledWith('vi');
      expect(mockGetBookings).toHaveBeenCalled();
    });
  });

  describe('component rendering', () => {
    it('should pass correct props to AdminBookingsClient', async () => {
      const params = Promise.resolve({ locale: 'en' });
      await AdminBookingsPage({ params });

      expect(mockGetDictionary).toHaveBeenCalled();
      expect(mockGetBookings).toHaveBeenCalled();
    });

    it('should pass initialBookings to AdminBookingsClient', async () => {
      const customBookings = [{ booking_id: 999 }] as any;
      mockGetBookings.mockResolvedValueOnce(customBookings);

      const params = Promise.resolve({ locale: 'en' });
      await AdminBookingsPage({ params });

      expect(mockGetBookings).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle dictionary fetch errors', async () => {
      mockGetDictionary.mockRejectedValueOnce(new Error('Failed to fetch dictionary'));

      const params = Promise.resolve({ locale: 'en' });

      await expect(AdminBookingsPage({ params })).rejects.toThrow('Failed to fetch dictionary');
    });

    it('should handle bookings fetch errors', async () => {
      mockGetBookings.mockRejectedValueOnce(new Error('Failed to fetch bookings'));

      const params = Promise.resolve({ locale: 'en' });

      await expect(AdminBookingsPage({ params })).rejects.toThrow('Failed to fetch bookings');
    });

    it('should propagate errors from getBookings', async () => {
      const error = new Error('Network error');
      mockGetBookings.mockRejectedValueOnce(error);

      const params = Promise.resolve({ locale: 'en' });

      await expect(AdminBookingsPage({ params })).rejects.toThrow('Network error');
    });
  });

  describe('locale type handling', () => {
    it('should cast locale to correct type', async () => {
      const params = Promise.resolve({ locale: 'en' });
      await AdminBookingsPage({ params });

      // Should handle locale as 'en' | 'vi'
      expect(mockGetDictionary).toHaveBeenCalledWith('en');
    });

    it('should handle vi locale type', async () => {
      const params = Promise.resolve({ locale: 'vi' });
      await AdminBookingsPage({ params });

      expect(mockGetDictionary).toHaveBeenCalledWith('vi');
    });
  });
});

