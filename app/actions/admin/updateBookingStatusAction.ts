'use server';

import { revalidatePath } from 'next/cache';
import { updateBookingStatus } from '@/app/lib/services/bookingService';
import { authOptions } from '@/app/lib/authOptions';
import { getServerSession } from 'next-auth';
import { ERROR_MESSAGES } from '@/app/lib/constants';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import { revalidateBookingsCache } from '@/app/lib/services/cacheUtils';

export async function updateBookingStatusAction(
  bookingId: number,
  newStatus: 'pending' | 'confirmed' | 'cancelled'
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      throw createUnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await updateBookingStatus(bookingId, newStatus);
    revalidateBookingsCache();
    return {
      success: true,
      message: 'Booking status updated successfully',
    };
  } catch (error) {
    console.error('Error updating booking status:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      action: 'updateBookingStatusAction',
      bookingId,
      newStatus,
    });
    return {
      success: false,
      error: 'Error updating booking status',
    };
  }
}
