'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getUserBookingsAction } from '@/app/actions/user/profile/getUserBookingsAction';
import type { BookingWithRelations } from '@/app/actions/user/profile/getUserBookingsAction';

interface UseUserBookingsOptions {
  enabled?: boolean;
}

export const useUserBookings = (
  options: UseUserBookingsOptions = {},
  queryOptions?: Omit<
    UseQueryOptions<BookingWithRelations[], Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const { enabled = true } = options;

  return useQuery<BookingWithRelations[], Error>({
    queryKey: ['userBookings'],
    queryFn: async (): Promise<BookingWithRelations[]> => {
      const result = await getUserBookingsAction();
      if (result.success && result.bookings) {
        return result.bookings || [];
      }
      throw new Error(result.error || 'Failed to fetch bookings');
    },
    enabled,
    ...queryOptions,
  });
};
