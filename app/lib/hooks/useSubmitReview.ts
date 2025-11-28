'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitReviewAction } from '@/app/actions/user/review/submitReviewAction';
import {
  revalidateTourDetailCache,
  revalidateToursCache,
} from '../services/cacheUtils';

export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitReviewAction,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['bookingReview', variables.bookingId],
      });
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      revalidateTourDetailCache();
      revalidateToursCache();
    },
  });
};
