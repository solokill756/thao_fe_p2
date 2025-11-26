'use server';

import prisma from '../prisma';

export interface ReviewRecord {
  review_id: number;
  booking_id: number;
  user_id: number;
  tour_id: number;
  rating: number;
  comment: string | null;
  created_at: Date | null;
}

export const getReviewByBookingId = async (
  bookingId: number
): Promise<ReviewRecord | null> => {
  try {
    const review = await prisma.review.findUnique({
      where: {
        booking_id: bookingId,
      },
    });
    return review;
  } catch (error) {
    console.error('Error fetching review:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      action: 'getReviewByBookingId',
      bookingId,
    });
    throw error;
  }
};

export const upsertReview = async (
  bookingId: number,
  userId: number,
  tourId: number,
  rating: number,
  comment: string | null
): Promise<ReviewRecord> => {
  try {
    const review = await prisma.review.upsert({
      where: {
        booking_id: bookingId,
      },
      update: {
        rating,
        comment,
      },
      create: {
        booking_id: bookingId,
        user_id: userId,
        tour_id: tourId,
        rating,
        comment,
      },
    });
    return review;
  } catch (error) {
    console.error('Error upserting review:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      action: 'upsertReview',
      bookingId,
      userId,
      tourId,
    });
    throw error;
  }
};
