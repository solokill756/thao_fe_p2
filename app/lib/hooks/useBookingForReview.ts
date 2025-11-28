'use client';

import { useQuery } from '@tanstack/react-query';
import { getBookingForReviewAction } from '@/app/actions/user/review/getBookingForReviewAction';

export const useBookingForReview = (bookingId: number) => {
  return useQuery({
    queryKey: ['bookingReview', bookingId],
    queryFn: async () => {
      return await getBookingForReviewAction(bookingId);
    },
    enabled: Boolean(bookingId),
  });
};
