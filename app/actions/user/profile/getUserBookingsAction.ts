'use server';

import { authOptions } from '@/app/lib/authOptions';
import {
  BookingWithRelations,
  fetchUserBookings,
} from '@/app/lib/services/bookingService';
import { getServerSession } from 'next-auth';

export type { BookingWithRelations } from '@/app/lib/services/bookingService';

export async function getUserBookingsAction(): Promise<{
  success: boolean;
  bookings?: BookingWithRelations[];
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return {
        success: false,
        error: 'Invalid user ID',
      };
    }

    const bookings = await fetchUserBookings(userId);
    return {
      success: true,
      bookings,
    };
  } catch (error) {
    console.error('Error getting user bookings:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      action: 'getUserBookingsAction',
    });
    return {
      success: false,
      error: 'Error getting bookings',
    };
  }
}
