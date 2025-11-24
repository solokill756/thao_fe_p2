'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';
import prisma from '@/app/lib/prisma';
import { getReviewByUserAndTour } from '@/app/lib/services/reviewService';

interface BookingForReviewResponse {
  success: boolean;
  booking?: {
    booking_id: number;
    tour_id: number;
    tour_title: string;
    tour_cover_image_url: string | null;
    start_date: Date | null;
    duration_days: number | null;
    booking_date: Date;
    num_guests: number;
    total_price: number;
  };
  existingReview?: {
    rating: number;
    comment: string | null;
  } | null;
  error?: string;
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

export async function getBookingForReviewAction(
  bookingId: number
): Promise<BookingForReviewResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

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
            title: true,
            cover_image_url: true,
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

    const existingReview = await getReviewByUserAndTour(
      userId,
      booking.tour.tour_id
    );

    return {
      success: true,
      booking: {
        booking_id: booking.booking_id,
        tour_id: booking.tour.tour_id,
        tour_title: booking.tour.title,
        tour_cover_image_url: booking.tour.cover_image_url,
        start_date: booking.tour.start_date,
        duration_days: booking.tour.duration_days,
        booking_date: booking.booking_date,
        num_guests: booking.num_guests,
        total_price: Number(booking.total_price),
      },
      existingReview: existingReview
        ? {
            rating: existingReview.rating,
            comment: existingReview.comment,
          }
        : null,
    };
  } catch (error) {
    console.error('Error getting booking for review:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      action: 'getBookingForReviewAction',
      bookingId,
    });
    return { success: false, error: 'Failed to load booking' };
  }
}
