'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getToursAction,
  TourWithRelations,
} from '@/app/actions/admin/getToursAction';
import { createTourAction } from '@/app/actions/admin/createTourAction';
import { updateTourAction } from '@/app/actions/admin/updateTourAction';
import { deleteTourAction } from '@/app/actions/admin/deleteTourAction';
import type {
  CreateTourData,
  UpdateTourData,
} from '@/app/lib/services/tourService';

type Locale = 'en' | 'vi';
import toast from 'react-hot-toast';
import { revalidateAllTourCaches } from '../services/cacheUtils';

export function useTours(initialTours: TourWithRelations[]) {
  return useQuery({
    initialData: initialTours,
    queryKey: ['adminTours'],
    queryFn: async () => {
      const result = await getToursAction();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch tours');
      }
      return result.tours || [];
    },
  });
}

export function useCreateTour(locale: Locale = 'en') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTourData) => {
      const result = await createTourAction({ ...data, locale });
      if (!result.success) {
        const errorMessage =
          result.errors && Object.keys(result.errors).length > 0
            ? Object.values(result.errors).flat().join(', ')
            : result.error || 'Failed to create tour';
        throw new Error(errorMessage);
      }
      return result.tour!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTours'] });

      toast.success('Tour created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create tour');
    },
  });
}

export function useUpdateTour(locale: Locale = 'en') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateTourData) => {
      const result = await updateTourAction({ ...data, locale });
      if (!result.success) {
        const errorMessage =
          result.errors && Object.keys(result.errors).length > 0
            ? Object.values(result.errors).flat().join(', ')
            : result.error || 'Failed to update tour';
        throw new Error(errorMessage);
      }
      return result.tour!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTours'] });

      toast.success('Tour updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update tour');
    },
  });
}

export function useDeleteTour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tourId: number) => {
      const result = await deleteTourAction(tourId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete tour');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTours'] });
      toast.success('Tour deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete tour');
    },
  });
}
