'use server';

import prisma from '../prisma';

export interface ReviewRecord {
  review_id: number;
  user_id: number;
  tour_id: number;
  rating: number;
  comment: string | null;
  created_at: Date | null;
}

export const getReviewByUserAndTour = async (
  userId: number,
  tourId: number
): Promise<ReviewRecord | null> => {
  try {
    const review = await prisma.review.findUnique({
      where: {
        user_id_tour_id: {
          user_id: userId,
          tour_id: tourId,
        },
      },
    });
    return review;
  } catch (error) {
    console.error('Error fetching review:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      action: 'getReviewByUserAndTour',
      userId,
      tourId,
    });
    throw error;
  }
};

export const upsertReview = async (
  userId: number,
  tourId: number,
  rating: number,
  comment: string | null
): Promise<ReviewRecord> => {
  try {
    const review = await prisma.review.upsert({
      where: {
        user_id_tour_id: {
          user_id: userId,
          tour_id: tourId,
        },
      },
      update: {
        rating,
        comment,
      },
      create: {
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
      userId,
      tourId,
    });
    throw error;
  }
};
