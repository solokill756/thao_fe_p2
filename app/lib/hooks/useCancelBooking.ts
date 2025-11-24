import { cancelBookingAction } from '@/app/actions/user/profile/cancelBookingAction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CancelBookingVariables {
  bookingId: number;
}

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { success: boolean; message?: string; error?: string },
    Error,
    CancelBookingVariables
  >({
    mutationFn: async ({ bookingId }) => {
      return await cancelBookingAction(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
    },
  });
};
