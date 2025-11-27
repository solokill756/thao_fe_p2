'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBookingStatusAction } from '@/app/actions/admin/updateBookingStatusAction';
import type { BookingWithRelations } from '@/app/lib/services/bookingService';

interface UpdateBookingStatusVariables {
  bookingId: number;
  newStatus: 'pending' | 'confirmed' | 'cancelled';
}

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  type MutationContext = {
    previousBookings?: BookingWithRelations[];
  };

  return useMutation<
    { success: boolean; message?: string; error?: string },
    Error,
    UpdateBookingStatusVariables,
    MutationContext
  >({
    mutationFn: async ({ bookingId, newStatus }) => {
      return await updateBookingStatusAction(bookingId, newStatus);
    },
    onMutate: async ({ bookingId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['bookings'] });

      const previousBookings = queryClient.getQueryData<BookingWithRelations[]>(
        ['bookings']
      );
      const updateCachedBookings = (
        bookings: BookingWithRelations[] | undefined
      ) => {
        if (!bookings) return bookings;
        return bookings.map((booking) =>
          booking.booking_id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        );
      };

      queryClient.setQueryData(['bookings'], updateCachedBookings);
      return { previousBookings };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousBookings) {
        queryClient.setQueryData(['bookings'], context.previousBookings);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
