'use server';

import { authOptions } from '@/app/lib/authOptions';
import { UpdateTourData, updateTour } from '@/app/lib/services/tourService';
import { getServerSession } from 'next-auth';
import { ERROR_MESSAGES, DEFAULT_LOCALE } from '@/app/lib/constants';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import { TourWithRelations } from '@/app/lib/types/tourTypes';
import { DictType } from '@/app/lib/types/dictType';
import { getDictionary } from '@/app/lib/get-dictionary';
import z from 'zod';
import { revalidateAllTourCaches } from '@/app/lib/services/cacheUtils';

type Locale = 'en' | 'vi';

const updateTourSchema = (dict: DictType) => {
  const validateImageUrl = (value: string) => {
    if (!value || value === '') {
      return true;
    }
    if (value.startsWith('/')) {
      return true;
    }
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const imageUrlMessage =
    dict.admin?.tours?.validation?.invalidImageUrl || 'Invalid image URL';

  return z.object({
    tour_id: z
      .number(
        dict.admin?.tours?.validation?.tourIdMustBeNumber ||
          'Tour ID must be a number'
      )
      .int(
        dict.admin?.tours?.validation?.tourIdMustBeInteger ||
          'Tour ID must be an integer'
      )
      .positive(
        dict.admin?.tours?.validation?.tourIdMustBePositive ||
          'Tour ID must be positive'
      ),
    title: z
      .string()
      .min(
        1,
        dict.admin?.tours?.validation?.titleRequired || 'Tour title is required'
      )
      .max(
        255,
        dict.admin?.tours?.validation?.titleMaxLength ||
          'Tour title must be less than 255 characters'
      )
      .optional(),
    description: z
      .string()
      .min(
        1,
        dict.admin?.tours?.validation?.descriptionRequired ||
          'Tour description is required'
      )
      .min(
        10,
        dict.admin?.tours?.validation?.descriptionMinLength ||
          'Tour description must be at least 10 characters'
      )
      .optional(),
    price_per_person: z
      .number(
        dict.admin?.tours?.validation?.priceMustBeNumber ||
          'Price must be a number'
      )
      .positive(
        dict.admin?.tours?.validation?.priceMustBePositive ||
          'Price must be positive'
      )
      .min(
        0.01,
        dict.admin?.tours?.validation?.priceMin || 'Price must be at least 0.01'
      )
      .optional(),
    duration_days: z
      .number(
        dict.admin?.tours?.validation?.durationMustBeNumber ||
          'Duration must be a number'
      )
      .int(
        dict.admin?.tours?.validation?.durationMustBeInteger ||
          'Duration must be an integer'
      )
      .positive(
        dict.admin?.tours?.validation?.durationMustBePositive ||
          'Duration must be positive'
      )
      .min(
        1,
        dict.admin?.tours?.validation?.durationMin ||
          'Duration must be at least 1 day'
      )
      .optional(),
    max_guests: z
      .number(
        dict.admin?.tours?.validation?.maxGuestsMustBeNumber ||
          'Max guests must be a number'
      )
      .int(
        dict.admin?.tours?.validation?.maxGuestsMustBeInteger ||
          'Max guests must be an integer'
      )
      .positive(
        dict.admin?.tours?.validation?.maxGuestsMustBePositive ||
          'Max guests must be positive'
      )
      .min(
        1,
        dict.admin?.tours?.validation?.maxGuestsMin ||
          'Max guests must be at least 1'
      )
      .optional(),
    cover_image_url: z
      .string()
      .refine(validateImageUrl, {
        message: imageUrlMessage,
      })
      .optional()
      .or(z.literal('')),
    gallery_images: z
      .array(
        z.string().refine(validateImageUrl, {
          message: imageUrlMessage,
        })
      )
      .optional(),
    departure_location: z
      .string()
      .max(
        255,
        dict.admin?.tours?.validation?.departureLocationMaxLength ||
          'Departure location must be less than 255 characters'
      )
      .optional()
      .or(z.literal('')),
    departure_time: z.string().optional().or(z.literal('')),
    return_time: z.string().optional().or(z.literal('')),
    start_date: z.date().optional(),
    category_ids: z.array(z.number().int().positive()).optional(),
    destination_ids: z.array(z.number().int().positive()).optional(),
    tour_plans: z
      .array(
        z.object({
          day_number: z.number().int().positive(),
          title: z.string().min(1).max(255),
          description: z.string().min(1),
          inclusions: z.array(z.string()).optional(),
        })
      )
      .optional(),
    what_included: z.array(z.string()).optional(),
    what_not_included: z.array(z.string()).optional(),
  });
};

export async function updateTourAction(
  data: UpdateTourData & { locale?: Locale }
): Promise<{
  success: boolean;
  tour?: TourWithRelations;
  error?: string;
  errors?: {
    [key: string]: string[];
  };
}> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      throw createUnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const locale = data.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    const validationResult = updateTourSchema(dict).safeParse(data);

    if (!validationResult.success) {
      return {
        success: false,
        error:
          dict.admin?.tours?.validation?.validationFailed ||
          'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const tour = await updateTour({
      ...validationResult.data,
      start_date: validationResult.data.start_date || undefined,
    });
    revalidateAllTourCaches();
    return {
      success: true,
      tour,
    };
  } catch (error) {
    console.error('Error updating tour:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      action: 'updateTourAction',
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error updating tour',
    };
  }
}
