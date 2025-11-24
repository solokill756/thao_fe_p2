'use server';

import { authOptions } from '@/app/lib/authOptions';
import { fetchUserBookings } from '@/app/lib/services/bookingService';
import { getServerSession } from 'next-auth';
import type { BookingWithRelations } from '@/app/lib/services/bookingService';

export async function getBookingForPaymentAction(bookingId: number): Promise<{
  success: boolean;
  booking?: BookingWithRelations;
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
    const booking = bookings.find((b) => b.booking_id === bookingId);

    if (!booking) {
      return {
        success: false,
        error: 'Booking not found',
      };
    }

    if (booking.status !== 'confirmed') {
      return {
        success: false,
        error: 'Booking is not confirmed',
      };
    }

    if (booking.payment?.status === 'completed') {
      return {
        success: false,
        error: 'Payment already completed',
      };
    }

    return {
      success: true,
      booking,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error getting booking',
    };
  }
}
