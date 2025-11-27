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

type CreateTourMutationContext = {
  previousTours?: TourWithRelations[];
  tempId: number;
};

type ToursMutationContext = {
  previousTours?: TourWithRelations[];
};

const buildOptimisticTour = (
  data: CreateTourData,
  tempId: number
): TourWithRelations => {
  const now = new Date();
  return {
    tour_id: tempId,
    title: data.title,
    description: data.description,
    price_per_person: data.price_per_person,
    duration_days: data.duration_days,
    max_guests: data.max_guests,
    cover_image_url: data.cover_image_url || null,
    departure_location: data.departure_location || null,
    departure_time: data.departure_time || null,
    return_time: data.return_time || null,
    start_date: data.start_date ? new Date(data.start_date) : null,
    what_included: data.what_included ?? null,
    what_not_included: data.what_not_included ?? null,
    created_at: now,
    updated_at: now,
    categories: [],
    destinations: [],
    gallery: [],
    plans: (data.tour_plans || []).map((plan, index) => ({
      plan_day_id: tempId * 1000 - index - 1,
      tour_id: tempId,
      day_number: plan.day_number,
      title: plan.title,
      description: plan.description,
      inclusions: plan.inclusions ?? null,
    })),
    _count: {
      bookings: 0,
      reviews: 0,
    },
    averageRating: 0,
    ratingBreakdown: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  };
};

const applyTourPatch = (
  tour: TourWithRelations,
  data: UpdateTourData
): TourWithRelations => {
  const patched = { ...tour };

  if (data.title !== undefined) patched.title = data.title;
  if (data.description !== undefined) patched.description = data.description;
  if (data.price_per_person !== undefined)
    patched.price_per_person = data.price_per_person;
  if (data.duration_days !== undefined)
    patched.duration_days = data.duration_days;
  if (data.max_guests !== undefined) patched.max_guests = data.max_guests;
  if (data.cover_image_url !== undefined)
    patched.cover_image_url = data.cover_image_url || null;
  if (data.departure_location !== undefined)
    patched.departure_location = data.departure_location || null;
  if (data.departure_time !== undefined)
    patched.departure_time = data.departure_time || null;
  if (data.return_time !== undefined)
    patched.return_time = data.return_time || null;
  if (data.start_date !== undefined)
    patched.start_date = data.start_date ? new Date(data.start_date) : null;
  if (data.what_included !== undefined)
    patched.what_included = data.what_included ?? null;
  if (data.what_not_included !== undefined)
    patched.what_not_included = data.what_not_included ?? null;

  return patched;
};

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

  return useMutation<
    TourWithRelations,
    Error,
    CreateTourData,
    CreateTourMutationContext
  >({
    mutationFn: async (data) => {
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
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['adminTours'] });
      const previousTours = queryClient.getQueryData<TourWithRelations[]>([
        'adminTours',
      ]);
      const tempId = Date.now() * -1;
      const optimisticTour = buildOptimisticTour(data, tempId);

      queryClient.setQueryData<TourWithRelations[] | undefined>(
        ['adminTours'],
        (old) => (old ? [optimisticTour, ...old] : [optimisticTour])
      );

      return { previousTours, tempId };
    },
    onSuccess: (tour, _variables, context) => {
      queryClient.setQueryData<TourWithRelations[] | undefined>(
        ['adminTours'],
        (old) =>
          old?.map((item) =>
            context && item.tour_id === context.tempId ? tour : item
          )
      );
      toast.success('Tour created successfully');
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousTours) {
        queryClient.setQueryData(['adminTours'], context.previousTours);
      }
      toast.error(error.message || 'Failed to create tour');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTours'] });
    },
  });
}

export function useUpdateTour(locale: Locale = 'en') {
  const queryClient = useQueryClient();
  return useMutation<
    TourWithRelations,
    Error,
    UpdateTourData,
    ToursMutationContext
  >({
    mutationFn: async (data) => {
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
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['adminTours'] });
      const previousTours = queryClient.getQueryData<TourWithRelations[]>([
        'adminTours',
      ]);

      queryClient.setQueryData<TourWithRelations[] | undefined>(
        ['adminTours'],
        (old) =>
          old?.map((tour) =>
            tour.tour_id === data.tour_id ? applyTourPatch(tour, data) : tour
          )
      );

      return { previousTours };
    },
    onSuccess: () => {
      toast.success('Tour updated successfully');
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousTours) {
        queryClient.setQueryData(['adminTours'], context.previousTours);
      }
      toast.error(error.message || 'Failed to update tour');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTours'] });
    },
  });
}

export function useDeleteTour() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number, ToursMutationContext>({
    mutationFn: async (tourId: number) => {
      const result = await deleteTourAction(tourId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete tour');
      }
    },
    onMutate: async (tourId) => {
      await queryClient.cancelQueries({ queryKey: ['adminTours'] });
      const previousTours = queryClient.getQueryData<TourWithRelations[]>([
        'adminTours',
      ]);

      queryClient.setQueryData<TourWithRelations[] | undefined>(
        ['adminTours'],
        (old) => old?.filter((tour) => tour.tour_id !== tourId)
      );

      return { previousTours };
    },
    onSuccess: () => {
      toast.success('Tour deleted successfully');
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousTours) {
        queryClient.setQueryData(['adminTours'], context.previousTours);
      }
      toast.error(error.message || 'Failed to delete tour');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTours'] });
    },
  });
}
