'use server';

import { authOptions } from '@/app/lib/authOptions';
import { getServerSession } from 'next-auth';
import {
  createPayment,
  updatePaymentStatus,
  getPaymentByBookingId,
} from '@/app/lib/services/paymentService';
import { fetchUserBookings } from '@/app/lib/services/bookingService';
import { PAYMENT_METHODS } from '@/app/lib/constants';

export async function submitPaymentAction(
  bookingId: number,
  paymentMethod: 'card' | 'internet_banking',
  cardData?: {
    cardNumber: string;
    expiration: string;
    cvc: string;
  }
): Promise<{
  success: boolean;
  paymentId?: number;
  transactionId?: string;
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

    const existingPayment = await getPaymentByBookingId(bookingId);
    if (existingPayment?.status === 'completed') {
      return {
        success: false,
        error: 'Payment already completed',
      };
    }

    let payment;
    if (existingPayment) {
      const transactionId = `TXN-${Date.now()}-${bookingId}`;
      payment = await updatePaymentStatus(
        existingPayment.payment_id,
        'completed',
        transactionId
      );
    } else {
      payment = await createPayment(
        bookingId,
        paymentMethod,
        booking.total_price
      );
      const transactionId = `TXN-${Date.now()}-${bookingId}`;
      payment = await updatePaymentStatus(
        payment.payment_id,
        'completed',
        transactionId
      );
    }

    return {
      success: true,
      paymentId: payment.payment_id,
      transactionId: payment.transaction_id || undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error processing payment',
    };
  }
}
