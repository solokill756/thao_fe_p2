'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getBookingsAction } from '@/app/actions/admin/getBookingsAction';
import type { BookingWithRelations } from '@/app/actions/admin/getBookingsAction';

interface UseBookingsOptions {
  enabled?: boolean;
}

export const useBookings = (
  initialBookings: BookingWithRelations[],
  options: UseBookingsOptions = {},
  queryOptions?: Omit<
    UseQueryOptions<BookingWithRelations[], Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const { enabled = true } = options;

  return useQuery<BookingWithRelations[], Error>({
    initialData: initialBookings,
    queryKey: ['bookings'],
    queryFn: async (): Promise<BookingWithRelations[]> => {
      const result = await getBookingsAction();
      if (result.success && result.bookings) {
        return result.bookings || [];
      }
      throw new Error(result.error || 'Failed to fetch bookings');
    },
    enabled,
    ...queryOptions,
  });
};
