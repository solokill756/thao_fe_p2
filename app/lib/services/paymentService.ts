import prisma from '../prisma';

export interface PaymentData {
  payment_id: number;
  booking_id: number;
  amount: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed';
  transaction_id: string | null;
  paid_at: Date | null;
  created_at: Date | null;
}

export const createPayment = async (
  bookingId: number,
  paymentMethod: 'card' | 'internet_banking',
  amount: number
): Promise<PaymentData> => {
  try {
    const payment = await prisma.payment.create({
      data: {
        booking_id: bookingId,
        amount,
        payment_method: paymentMethod,
        status: 'pending',
      },
    });

    return {
      payment_id: payment.payment_id,
      booking_id: payment.booking_id,
      amount: Number(payment.amount),
      payment_method: payment.payment_method,
      status: payment.status as 'pending' | 'completed' | 'failed',
      transaction_id: payment.transaction_id,
      paid_at: payment.paid_at,
      created_at: payment.created_at,
    };
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const updatePaymentStatus = async (
  paymentId: number,
  status: 'pending' | 'completed' | 'failed',
  transactionId?: string
): Promise<PaymentData> => {
  try {
    const payment = await prisma.payment.update({
      where: { payment_id: paymentId },
      data: {
        status,
        transaction_id: transactionId,
        paid_at: status === 'completed' ? new Date() : null,
      },
    });

    return {
      payment_id: payment.payment_id,
      booking_id: payment.booking_id,
      amount: Number(payment.amount),
      payment_method: payment.payment_method,
      status: payment.status as 'pending' | 'completed' | 'failed',
      transaction_id: payment.transaction_id,
      paid_at: payment.paid_at,
      created_at: payment.created_at,
    };
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

export const getPaymentByBookingId = async (
  bookingId: number
): Promise<PaymentData | null> => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { booking_id: bookingId },
    });

    if (!payment) {
      return null;
    }

    return {
      payment_id: payment.payment_id,
      booking_id: payment.booking_id,
      amount: Number(payment.amount),
      payment_method: payment.payment_method,
      status: payment.status as 'pending' | 'completed' | 'failed',
      transaction_id: payment.transaction_id,
      paid_at: payment.paid_at,
      created_at: payment.created_at,
    };
  } catch (error) {
    console.error('Error getting payment by booking ID:', error);
    throw error;
  }
};
