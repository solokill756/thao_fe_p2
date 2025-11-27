'use server';
import { authOptions } from '@/app/lib/authOptions';
import { deleteBooking } from '@/app/lib/services/bookingService';
import { getServerSession } from 'next-auth';
import { ERROR_MESSAGES } from '@/app/lib/constants';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import { revalidateBookingsCache } from '@/app/lib/services/cacheUtils';
import prisma from '@/app/lib/prisma';

export async function deleteBookingAction(bookingId: number): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role;
    const isAdmin = userRole === 'admin';
    const userId = session?.user?.id ? parseInt(session.user.id) : null;

    if (!isAdmin && (!userId || Number.isNaN(userId))) {
      throw createUnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const booking = await prisma.booking.findUnique({
      where: { booking_id: bookingId },
      select: { user_id: true },
    });

    if (!booking) {
      return {
        success: false,
        error: 'Booking not found',
      };
    }

    if (!isAdmin && booking.user_id !== userId) {
      throw createUnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await deleteBooking(bookingId);

    revalidateBookingsCache();

    return {
      success: true,
      message: 'Booking deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting booking:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      action: 'deleteBookingAction',
      bookingId,
    });
    return {
      success: false,
      error: 'Error deleting booking',
    };
  }
}
