import { deleteBookingAction } from '@/app/actions/booking/deleteBookingAction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface deleteBookingVariables {
  bookingId: number;
}

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { success: boolean; message?: string; error?: string },
    Error,
    deleteBookingVariables
  >({
    mutationFn: async ({ bookingId }) => {
      return await deleteBookingAction(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
    },
  });
};
