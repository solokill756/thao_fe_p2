'use server';

import { authOptions } from '@/app/lib/authOptions';
import { getServerSession } from 'next-auth';
import { ERROR_MESSAGES } from '@/app/lib/constants';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import prisma from '@/app/lib/prisma';
import type { BookingWithRelations } from '@/app/lib/services/bookingService';

export interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  activeUsers: number;
  activeTours: number;
  revenueChange: number;
  bookingsChange: number;
  usersChange: number;
  toursChange: number;
  recentBookings: BookingWithRelations[];
}

export async function getDashboardStatsAction(): Promise<{
  success: boolean;
  stats?: DashboardStats;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      throw createUnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    // Get current month and last month dates
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Fetch all data in parallel
    const [
      currentMonthBookings,
      lastMonthBookings,
      allBookings,
      currentMonthUsers,
      lastMonthUsers,
      allUsers,
      allTours,
      recentBookingsData,
    ] = await Promise.all([
      // Current month bookings with completed payments
      prisma.booking.findMany({
        where: {
          created_at: {
            gte: currentMonthStart,
          },
          payment: {
            status: 'completed',
          },
        },
        include: {
          payment: true,
        },
      }),
      // Last month bookings with completed payments
      prisma.booking.findMany({
        where: {
          created_at: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
          payment: {
            status: 'completed',
          },
        },
        include: {
          payment: true,
        },
      }),
      // All bookings for total count
      prisma.booking.findMany(),
      // Current month new users
      prisma.user.findMany({
        where: {
          created_at: {
            gte: currentMonthStart,
          },
        },
      }),
      // Last month new users
      prisma.user.findMany({
        where: {
          created_at: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),
      // All users
      prisma.user.findMany(),
      // All tours
      prisma.tour.findMany(),
      // Recent bookings (last 5)
      prisma.booking.findMany({
        take: 5,
        include: {
          user: {
            select: {
              user_id: true,
              full_name: true,
              email: true,
              avatar_url: true,
            },
          },
          tour: {
            select: {
              tour_id: true,
              title: true,
              cover_image_url: true,
              start_date: true,
              price_per_person: true,
              duration_days: true,
            },
          },
          payment: {
            select: {
              payment_id: true,
              status: true,
              payment_method: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
    ]);

    // Calculate revenue
    const currentMonthRevenue = currentMonthBookings.reduce(
      (sum, booking) => sum + Number(booking.total_price || 0),
      0
    );
    const lastMonthRevenue = lastMonthBookings.reduce(
      (sum, booking) => sum + Number(booking.total_price || 0),
      0
    );

    // Calculate changes
    const revenueChange =
      lastMonthRevenue > 0
        ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : currentMonthRevenue > 0
          ? 100
          : 0;

    const bookingsChange =
      lastMonthBookings.length > 0
        ? ((currentMonthBookings.length - lastMonthBookings.length) /
            lastMonthBookings.length) *
          100
        : currentMonthBookings.length > 0
          ? 100
          : 0;

    const usersChange =
      lastMonthUsers.length > 0
        ? ((currentMonthUsers.length - lastMonthUsers.length) /
            lastMonthUsers.length) *
          100
        : currentMonthUsers.length > 0
          ? 100
          : 0;

    // Transform recent bookings
    const recentBookings: BookingWithRelations[] = recentBookingsData.map(
      (booking) => ({
        booking_id: booking.booking_id,
        user_id: booking.user_id,
        tour_id: booking.tour_id,
        booking_date: booking.booking_date,
        num_guests: booking.num_guests,
        total_price: Number(booking.total_price),
        status: booking.status as 'pending' | 'confirmed' | 'cancelled',
        guest_full_name: booking.guest_full_name,
        guest_email: booking.guest_email,
        guest_phone: booking.guest_phone,
        created_at: booking.created_at,
        user: booking.user,
        tour: {
          ...booking.tour,
          start_date: booking.tour.start_date,
          price_per_person: booking.tour.price_per_person
            ? Number(booking.tour.price_per_person)
            : null,
          duration_days: booking.tour.duration_days,
        },
        payment: booking.payment,
      })
    );

    const stats: DashboardStats = {
      totalRevenue: currentMonthRevenue,
      totalBookings: allBookings.length,
      activeUsers: allUsers.length,
      activeTours: allTours.length,
      revenueChange,
      bookingsChange,
      usersChange,
      toursChange: 0, // Can be calculated if needed
      recentBookings,
    };

    return {
      success: true,
      stats,
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      action: 'getDashboardStatsAction',
    });
    return {
      success: false,
      error: 'Error getting dashboard stats',
    };
  }
}
