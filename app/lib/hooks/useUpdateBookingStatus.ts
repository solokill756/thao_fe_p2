'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBookingStatusAction } from '@/app/actions/admin/updateBookingStatusAction';
import type { BookingWithRelations } from '@/app/lib/services/bookingService';
import toast from 'react-hot-toast';

interface UpdateBookingStatusVariables {
  bookingId: number;
  newStatus: 'pending' | 'confirmed' | 'cancelled';
}

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  type MutationContext = {
    previousBookings?: BookingWithRelations[];
    previousStatus?: 'pending' | 'confirmed' | 'cancelled';
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

      const previousBooking = previousBookings?.find(
        (b) => b.booking_id === bookingId
      );
      const previousStatus = previousBooking?.status;

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
      return { previousBookings, previousStatus };
    },
    onSuccess: (result, variables, context) => {
      if (result.success) {
        toast.success(result.message || 'Booking status updated successfully');
      } else {
        if (context?.previousBookings) {
          queryClient.setQueryData(['bookings'], context.previousBookings);
        }
        toast.error(result.message || 'Failed to update booking status');
      }
    },
    onError: (error, _variables, context) => {
      if (context?.previousBookings) {
        queryClient.setQueryData(['bookings'], context.previousBookings);
      }
      toast.error(error.message || 'Failed to update booking status');
    },
  });
};
