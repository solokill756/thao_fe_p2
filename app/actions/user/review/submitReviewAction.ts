'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';
import prisma from '@/app/lib/prisma';
import {
  getReviewByBookingId,
  upsertReview,
} from '@/app/lib/services/reviewService';
import z from 'zod';

interface SubmitReviewPayload {
  bookingId: number;
  rating: number;
  comment?: string;
}

interface SubmitReviewResponse {
  success: boolean;
  error?: string;
  message?: string;
}

const hasTripCompleted = (
  startDate: Date | null,
  bookingDate: Date,
  durationDays: number | null
) => {
  const baseDate = startDate ?? bookingDate;
  const completionDate = new Date(baseDate);
  completionDate.setDate(
    completionDate.getDate() + Math.max(durationDays ?? 0, 1)
  );
  return new Date() >= completionDate;
};

const SubmitReviewSchema = z.object({
  bookingId: z.number().int().positive('Booking ID must be positive'),
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
  comment: z
    .union([z.string(), z.undefined(), z.null()])
    .transform((value) => {
      const trimmed = typeof value === 'string' ? value.trim() : undefined;
      return trimmed && trimmed.length > 0 ? trimmed : undefined;
    })
    .refine(
      (value) => !value || value.length <= 1000,
      'Comment must be at most 1000 characters'
    ),
});

export async function submitReviewAction(
  payload: SubmitReviewPayload
): Promise<SubmitReviewResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validationResult = SubmitReviewSchema.safeParse(payload);
    if (!validationResult.success) {
      return {
        success: false,
        error:
          validationResult.error.issues[0]?.message || 'Invalid review payload',
      };
    }

    const { bookingId, rating, comment } = validationResult.data;

    const userId = Number(session.user.id);
    if (Number.isNaN(userId)) {
      return { success: false, error: 'Invalid user' };
    }

    const booking = await prisma.booking.findFirst({
      where: {
        booking_id: bookingId,
        user_id: userId,
      },
      include: {
        tour: {
          select: {
            tour_id: true,
            start_date: true,
            duration_days: true,
          },
        },
        payment: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!booking || !booking.tour) {
      return { success: false, error: 'Booking not found' };
    }

    const isEligible =
      booking.status === 'confirmed' &&
      booking.payment?.status === 'completed' &&
      hasTripCompleted(
        booking.tour.start_date,
        booking.booking_date,
        booking.tour.duration_days
      );

    if (!isEligible) {
      return { success: false, error: 'Booking is not eligible for review' };
    }

    const existingReview = await getReviewByBookingId(bookingId);

    if (existingReview) {
      await upsertReview(
        bookingId,
        userId,
        booking.tour.tour_id,
        rating,
        comment ?? null
      );
      return { success: true, message: 'Review updated successfully' };
    }

    await upsertReview(
      bookingId,
      userId,
      booking.tour.tour_id,
      rating,
      comment ?? null
    );

    return { success: true, message: 'Review submitted' };
  } catch (error) {
    console.error('Error submitting review:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      action: 'submitReviewAction',
      bookingId: payload.bookingId,
    });
    return { success: false, error: 'Failed to submit review' };
  }
}
