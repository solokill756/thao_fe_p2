import { getDashboardStatsAction } from '../getDashboardStatsAction';
import { getServerSession } from 'next-auth';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import prisma from '@/app/lib/prisma';

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/app/lib/prisma', () => ({
  __esModule: true,
  default: {
    booking: {
      findMany: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
    },
    tour: {
      findMany: jest.fn(),
    },
  },
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
const mockPrismaBooking = prisma.booking as any;
const mockPrismaUser = prisma.user as any;
const mockPrismaTour = prisma.tour as any;
const mockCreateUnauthorizedError = createUnauthorizedError as jest.MockedFunction<
  typeof createUnauthorizedError
>;

describe('getDashboardStatsAction', () => {
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
    it('should return dashboard stats when admin session exists', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const currentMonthBookings = [
        { total_price: 1000, created_at: new Date('2024-12-01') },
        { total_price: 2000, created_at: new Date('2024-12-10') },
      ];
      const lastMonthBookings = [{ total_price: 500, created_at: new Date('2024-11-15') }];
      const allBookings = [...currentMonthBookings, ...lastMonthBookings];
      const currentMonthUsers = [{ user_id: 1 }];
      const lastMonthUsers = [{ user_id: 2 }];
      const allUsers = [...currentMonthUsers, ...lastMonthUsers];
      const allTours = [{ tour_id: 1 }];
      const recentBookings = [
        {
          booking_id: 1,
          user_id: 1,
          tour_id: 1,
          booking_date: new Date('2024-12-20'),
          num_guests: 2,
          total_price: 1000,
          status: 'confirmed',
          guest_full_name: 'John Doe',
          guest_email: 'john@example.com',
          guest_phone: '123456789',
          created_at: new Date('2024-12-01'),
          user: {
            user_id: 1,
            full_name: 'John',
            email: 'john@example.com',
            avatar_url: null,
          },
          tour: {
            tour_id: 1,
            title: 'Paris Tour',
            cover_image_url: null,
            start_date: new Date('2024-12-20'),
            price_per_person: 500,
            duration_days: 3,
          },
          payment: {
            payment_id: 1,
            status: 'completed',
            payment_method: 'credit_card',
          },
        },
      ];

      mockPrismaBooking.findMany
        .mockResolvedValueOnce(currentMonthBookings) // Current month bookings
        .mockResolvedValueOnce(lastMonthBookings) // Last month bookings
        .mockResolvedValueOnce(allBookings) // All bookings
        .mockResolvedValueOnce(recentBookings); // Recent bookings

      mockPrismaUser.findMany
        .mockResolvedValueOnce(currentMonthUsers) // Current month users
        .mockResolvedValueOnce(lastMonthUsers) // Last month users
        .mockResolvedValueOnce(allUsers); // All users

      mockPrismaTour.findMany.mockResolvedValueOnce(allTours);

      const result = await getDashboardStatsAction();

      expect(result.success).toBe(true);
      expect(result.stats).toBeDefined();
      expect(result.stats?.totalRevenue).toBe(3000);
      expect(result.stats?.totalBookings).toBe(3);
      expect(result.stats?.activeUsers).toBe(2);
      expect(result.stats?.activeTours).toBe(1);
      expect(result.stats?.recentBookings).toHaveLength(1);
    });

    it('should calculate revenue change correctly when last month has revenue', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const currentMonthBookings = [{ total_price: 2000 }];
      const lastMonthBookings = [{ total_price: 1000 }];
      const allBookings = [...currentMonthBookings, ...lastMonthBookings];
      const allUsers = [];
      const allTours = [];
      const recentBookings = [];

      mockPrismaBooking.findMany
        .mockResolvedValueOnce(currentMonthBookings)
        .mockResolvedValueOnce(lastMonthBookings)
        .mockResolvedValueOnce(allBookings)
        .mockResolvedValueOnce(recentBookings);

      mockPrismaUser.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(allUsers);

      mockPrismaTour.findMany.mockResolvedValueOnce(allTours);

      const result = await getDashboardStatsAction();

      expect(result.success).toBe(true);
      // Revenue change: ((2000 - 1000) / 1000) * 100 = 100%
      expect(result.stats?.revenueChange).toBe(100);
    });

    it('should calculate revenue change as 100% when last month has no revenue but current month has', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const currentMonthBookings = [{ total_price: 1000 }];
      const lastMonthBookings = [];
      const allBookings = [...currentMonthBookings, ...lastMonthBookings];
      const allUsers = [];
      const allTours = [];
      const recentBookings = [];

      mockPrismaBooking.findMany
        .mockResolvedValueOnce(currentMonthBookings)
        .mockResolvedValueOnce(lastMonthBookings)
        .mockResolvedValueOnce(allBookings)
        .mockResolvedValueOnce(recentBookings);

      mockPrismaUser.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(allUsers);

      mockPrismaTour.findMany.mockResolvedValueOnce(allTours);

      const result = await getDashboardStatsAction();

      expect(result.success).toBe(true);
      expect(result.stats?.revenueChange).toBe(100);
    });

    it('should calculate revenue change as 0% when both months have no revenue', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const currentMonthBookings = [];
      const lastMonthBookings = [];
      const allBookings = [];
      const allUsers = [];
      const allTours = [];
      const recentBookings = [];

      mockPrismaBooking.findMany
        .mockResolvedValueOnce(currentMonthBookings)
        .mockResolvedValueOnce(lastMonthBookings)
        .mockResolvedValueOnce(allBookings)
        .mockResolvedValueOnce(recentBookings);

      mockPrismaUser.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(allUsers);

      mockPrismaTour.findMany.mockResolvedValueOnce(allTours);

      const result = await getDashboardStatsAction();

      expect(result.success).toBe(true);
      expect(result.stats?.revenueChange).toBe(0);
    });
  });

  describe('Change Calculations', () => {
    it('should calculate bookings change correctly', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const currentMonthBookings = [{ total_price: 100 }, { total_price: 200 }];
      const lastMonthBookings = [{ total_price: 50 }];
      const allBookings = [...currentMonthBookings, ...lastMonthBookings];
      const allUsers = [];
      const allTours = [];
      const recentBookings = [];

      mockPrismaBooking.findMany
        .mockResolvedValueOnce(currentMonthBookings)
        .mockResolvedValueOnce(lastMonthBookings)
        .mockResolvedValueOnce(allBookings)
        .mockResolvedValueOnce(recentBookings);

      mockPrismaUser.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(allUsers);

      mockPrismaTour.findMany.mockResolvedValueOnce(allTours);

      const result = await getDashboardStatsAction();

      expect(result.success).toBe(true);
      // Bookings change: ((2 - 1) / 1) * 100 = 100%
      expect(result.stats?.bookingsChange).toBe(100);
    });

    it('should calculate users change correctly', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const currentMonthBookings = [];
      const lastMonthBookings = [];
      const allBookings = [];
      const currentMonthUsers = [{ user_id: 1 }, { user_id: 2 }];
      const lastMonthUsers = [{ user_id: 3 }];
      const allUsers = [...currentMonthUsers, ...lastMonthUsers];
      const allTours = [];
      const recentBookings = [];

      mockPrismaBooking.findMany
        .mockResolvedValueOnce(currentMonthBookings)
        .mockResolvedValueOnce(lastMonthBookings)
        .mockResolvedValueOnce(allBookings)
        .mockResolvedValueOnce(recentBookings);

      mockPrismaUser.findMany
        .mockResolvedValueOnce(currentMonthUsers)
        .mockResolvedValueOnce(lastMonthUsers)
        .mockResolvedValueOnce(allUsers);

      mockPrismaTour.findMany.mockResolvedValueOnce(allTours);

      const result = await getDashboardStatsAction();

      expect(result.success).toBe(true);
      // Users change: ((2 - 1) / 1) * 100 = 100%
      expect(result.stats?.usersChange).toBe(100);
    });

    it('should handle negative changes', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const currentMonthBookings = [{ total_price: 500 }];
      const lastMonthBookings = [
        { total_price: 1000 },
        { total_price: 1000 },
      ];
      const allBookings = [...currentMonthBookings, ...lastMonthBookings];
      const allUsers = [];
      const allTours = [];
      const recentBookings = [];

      mockPrismaBooking.findMany
        .mockResolvedValueOnce(currentMonthBookings)
        .mockResolvedValueOnce(lastMonthBookings)
        .mockResolvedValueOnce(allBookings)
        .mockResolvedValueOnce(recentBookings);

      mockPrismaUser.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(allUsers);

      mockPrismaTour.findMany.mockResolvedValueOnce(allTours);

      const result = await getDashboardStatsAction();

      expect(result.success).toBe(true);
      // Revenue change: ((500 - 2000) / 2000) * 100 = -75%
      expect(result.stats?.revenueChange).toBe(-75);
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

      const result = await getDashboardStatsAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error getting dashboard stats');
    });

    it('should throw unauthorized error when session is null', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await getDashboardStatsAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error getting dashboard stats');
    });
  });

  describe('Error Handling', () => {
    it('should handle prisma errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      mockPrismaBooking.findMany.mockRejectedValue(new Error('Database error'));

      const result = await getDashboardStatsAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error getting dashboard stats');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Recent Bookings Transformation', () => {
    it('should transform recent bookings correctly', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          role: 'admin',
          id: '1',
        },
      } as any);

      const bookingData = {
        booking_id: 1,
        user_id: 1,
        tour_id: 1,
        booking_date: new Date('2024-12-20'),
        num_guests: 2,
        total_price: 1000,
        status: 'confirmed',
        guest_full_name: 'John Doe',
        guest_email: 'john@example.com',
        guest_phone: '123456789',
        created_at: new Date('2024-12-01'),
        user: {
          user_id: 1,
          full_name: 'John',
          email: 'john@example.com',
          avatar_url: null,
        },
        tour: {
          tour_id: 1,
          title: 'Paris Tour',
          cover_image_url: null,
          start_date: new Date('2024-12-20'),
          price_per_person: '500',
          duration_days: 3,
        },
        payment: {
          payment_id: 1,
          status: 'completed',
          payment_method: 'credit_card',
        },
      };

      mockPrismaBooking.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([bookingData]);

      mockPrismaUser.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      mockPrismaTour.findMany.mockResolvedValueOnce([]);

      const result = await getDashboardStatsAction();

      expect(result.success).toBe(true);
      expect(result.stats?.recentBookings).toHaveLength(1);
      expect(result.stats?.recentBookings[0].total_price).toBe(1000);
      expect(result.stats?.recentBookings[0].tour.price_per_person).toBe(500);
    });
  });
});

