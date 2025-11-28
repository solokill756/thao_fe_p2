import { useQuery } from '@tanstack/react-query';
import { getBookingForPaymentAction } from '@/app/actions/user/payment/getBookingForPaymentAction';

export function useBookingForPayment(bookingId: number | null) {
  return useQuery({
    queryKey: ['bookingForPayment', bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      return await getBookingForPaymentAction(bookingId);
    },
    enabled: !!bookingId,
  });
}
