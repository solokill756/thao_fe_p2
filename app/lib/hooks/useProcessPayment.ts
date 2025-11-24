import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitPaymentAction } from '@/app/actions/user/payment/processPaymentAction';

interface ProcessPaymentParams {
  bookingId: number;
  paymentMethod: 'card' | 'internet_banking';
  cardData?: {
    cardNumber: string;
    expiration: string;
    cvc: string;
  };
}

export function useProcessPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: ProcessPaymentParams) => {
      return await submitPaymentAction(
        params.bookingId,
        params.paymentMethod,
        params.cardData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
    },
  });
}
