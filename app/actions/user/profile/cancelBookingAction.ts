'use server';
import { authOptions } from '@/app/lib/authOptions';
import { updateBookingStatus } from '@/app/lib/services/bookingService';
import { getServerSession } from 'next-auth';
import { ERROR_MESSAGES } from '@/app/lib/constants';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import prisma from '@/app/lib/prisma';

export async function cancelBookingAction(bookingId: number): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw createUnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return {
        success: false,
        error: 'Invalid user ID',
      };
    }

    const booking = await prisma.booking.findUnique({
      where: { booking_id: bookingId },
      select: { user_id: true, status: true },
    });

    if (!booking) {
      return {
        success: false,
        error: 'Booking not found',
      };
    }

    if (booking.user_id !== userId) {
      throw createUnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (booking.status === 'cancelled') {
      return {
        success: false,
        error: 'Booking is already cancelled',
      };
    }

    // Update booking status to cancelled
    await updateBookingStatus(bookingId, 'cancelled');

    return {
      success: true,
      message: 'Booking cancelled successfully',
    };
  } catch (error) {
    console.error('Error cancelling booking:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      action: 'cancelBookingAction',
      bookingId,
    });
    return {
      success: false,
      error: 'Error cancelling booking',
    };
  }
}
