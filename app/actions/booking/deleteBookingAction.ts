'use server';
import { authOptions } from '@/app/lib/authOptions';
import { deleteBooking } from '@/app/lib/services/bookingService';
import { getServerSession } from 'next-auth';
import { ERROR_MESSAGES } from '@/app/lib/constants';
import { createUnauthorizedError } from '@/app/lib/utils/errors';

export async function deleteBookingAction(bookingId: number): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      throw createUnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await deleteBooking(bookingId);

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
