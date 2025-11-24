import prisma from '../prisma';
import { TrendingTour, RatingBreakdown, Tour } from '../types/tourTypes';

export const fetchTours = async (limit: number = 10, offset: number = 0) => {
  try {
    const tours = await prisma.tour.findMany({
      take: limit,
      skip: offset,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        destinations: {
          include: {
            destination: true,
          },
        },
        gallery: {
          select: {
            image_id: true,
            tour_id: true,
            image_url: true,
            caption: true,
          },
        },
        plans: {
          select: {
            plan_day_id: true,
            tour_id: true,
            day_number: true,
            title: true,
            description: true,
            inclusions: true,
          },
          orderBy: {
            day_number: 'asc',
          },
        },
        reviews: {
          select: {
            review_id: true,
            rating: true,
            comment: true,
            created_at: true,
            user: {
              select: {
                user_id: true,
                full_name: true,
                avatar_url: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const tourIds = tours.map((tour) => tour.tour_id);

    const ratingBreakdowns = await prisma.review.groupBy({
      by: ['tour_id', 'rating'],
      where: {
        tour_id: {
          in: tourIds,
        },
      },
      _count: {
        review_id: true,
      },
    });

    const averageRatings = await prisma.review.groupBy({
      by: ['tour_id'],
      where: {
        tour_id: {
          in: tourIds,
        },
      },
      _avg: {
        rating: true,
      },
    });

    const breakdownMap = new Map<number, RatingBreakdown>();
    const avgRatingMap = new Map<number, number>();

    ratingBreakdowns.forEach((item) => {
      if (!breakdownMap.has(item.tour_id)) {
        breakdownMap.set(item.tour_id, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      }
      const breakdown = breakdownMap.get(item.tour_id)!;
      breakdown[item.rating as keyof RatingBreakdown] = item._count.review_id;
    });

    averageRatings.forEach((item) => {
      if (item._avg.rating) {
        avgRatingMap.set(item.tour_id, item._avg.rating);
      }
    });

    const toursWithRating: Tour[] = tours.map((tour) => {
      const reviewCount = tour._count.reviews;
      const avgRating = avgRatingMap.get(tour.tour_id);
      const averageRating = avgRating ? Math.round(avgRating * 10) / 10 : 0;
      const ratingBreakdown: RatingBreakdown = breakdownMap.get(
        tour.tour_id
      ) || {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      return {
        ...tour,
        price_per_person: Number(tour.price_per_person),
        _count: {
          reviews: reviewCount,
        },
        averageRating,
        ratingBreakdown,
      } as unknown as Tour;
    });

    return toursWithRating;
  } catch (error) {
    console.error('Error fetching tours:', error);
    throw error;
  }
};

export const fetchTrendingTours = async (
  limit: number = 10
): Promise<TrendingTour[]> => {
  try {
    const tours = await prisma.tour.findMany({
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        destinations: {
          include: {
            destination: true,
          },
        },
        gallery: {
          select: {
            image_id: true,
            tour_id: true,
            image_url: true,
            caption: true,
          },
        },
        plans: {
          select: {
            plan_day_id: true,
            tour_id: true,
            day_number: true,
            title: true,
            description: true,
            inclusions: true,
          },
          orderBy: {
            day_number: 'asc',
          },
        },
        reviews: {
          select: {
            review_id: true,
            rating: true,
            comment: true,
            created_at: true,
            user: {
              select: {
                user_id: true,
                full_name: true,
                avatar_url: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const tourIds = tours.map((tour) => tour.tour_id);

    const ratingBreakdowns = await prisma.review.groupBy({
      by: ['tour_id', 'rating'],
      where: {
        tour_id: {
          in: tourIds,
        },
      },
      _count: {
        review_id: true,
      },
    });

    const averageRatings = await prisma.review.groupBy({
      by: ['tour_id'],
      where: {
        tour_id: {
          in: tourIds,
        },
      },
      _avg: {
        rating: true,
      },
    });

    const breakdownMap = new Map<number, RatingBreakdown>();
    const avgRatingMap = new Map<number, number>();

    ratingBreakdowns.forEach((item) => {
      if (!breakdownMap.has(item.tour_id)) {
        breakdownMap.set(item.tour_id, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      }
      const breakdown = breakdownMap.get(item.tour_id)!;
      breakdown[item.rating as keyof RatingBreakdown] = item._count.review_id;
    });

    averageRatings.forEach((item) => {
      if (item._avg.rating) {
        avgRatingMap.set(item.tour_id, item._avg.rating);
      }
    });

    const toursWithRating = tours.map((tour) => {
      const reviewCount = tour._count.reviews;
      const avgRating = avgRatingMap.get(tour.tour_id);
      const averageRating = avgRating ? Math.round(avgRating * 10) / 10 : 0;
      const ratingBreakdown: RatingBreakdown = breakdownMap.get(
        tour.tour_id
      ) || {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      return {
        ...tour,
        price_per_person: Number(tour.price_per_person),
        _count: {
          reviews: reviewCount,
        },
        averageRating,
        ratingBreakdown,
      } as unknown as TrendingTour;
    });

    const sortedTours = toursWithRating.sort(
      (a, b) => b._count.reviews - a._count.reviews
    );

    return sortedTours.slice(0, limit);
  } catch (error) {
    console.error('Error fetching trending tours:', error);
    throw error;
  }
};

export interface SearchToursParams {
  destinationId?: number;
  date?: string;
  guests?: number;
  limit?: number;
  offset?: number;
}

export const searchTours = async (
  params: SearchToursParams
): Promise<Tour[]> => {
  try {
    const { destinationId, date, guests, limit = 20, offset = 0 } = params;

    const where: {
      destinations?: {
        some: {
          destination_id: number;
        };
      };
      max_guests?: {
        gte: number;
      };
      start_date?: {
        gte: Date;
      };
    } = {};

    if (destinationId) {
      where.destinations = {
        some: {
          destination_id: destinationId,
        },
      };
    }

    if (guests) {
      where.max_guests = {
        gte: guests,
      };
    }

    if (date) {
      const startDate = new Date(date);

      startDate.setHours(0, 0, 0, 0);
      where.start_date = {
        gte: startDate,
      };
    }

    const tours = await prisma.tour.findMany({
      where,
      take: limit,
      skip: offset,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        destinations: {
          include: {
            destination: true,
          },
        },
        gallery: {
          select: {
            image_id: true,
            tour_id: true,
            image_url: true,
            caption: true,
          },
        },
        plans: {
          select: {
            plan_day_id: true,
            tour_id: true,
            day_number: true,
            title: true,
            description: true,
            inclusions: true,
          },
          orderBy: {
            day_number: 'asc',
          },
        },
        reviews: {
          select: {
            review_id: true,
            rating: true,
            comment: true,
            created_at: true,
            user: {
              select: {
                user_id: true,
                full_name: true,
                avatar_url: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const tourIds = tours.map((tour) => tour.tour_id);

    const ratingBreakdowns = await prisma.review.groupBy({
      by: ['tour_id', 'rating'],
      where: {
        tour_id: {
          in: tourIds,
        },
      },
      _count: {
        review_id: true,
      },
    });

    const averageRatings = await prisma.review.groupBy({
      by: ['tour_id'],
      where: {
        tour_id: {
          in: tourIds,
        },
      },
      _avg: {
        rating: true,
      },
    });

    const breakdownMap = new Map<number, RatingBreakdown>();
    const avgRatingMap = new Map<number, number>();

    ratingBreakdowns.forEach((item) => {
      if (!breakdownMap.has(item.tour_id)) {
        breakdownMap.set(item.tour_id, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      }
      const breakdown = breakdownMap.get(item.tour_id)!;
      breakdown[item.rating as keyof RatingBreakdown] = item._count.review_id;
    });

    averageRatings.forEach((item) => {
      if (item._avg.rating) {
        avgRatingMap.set(item.tour_id, item._avg.rating);
      }
    });

    const toursWithRating: Tour[] = tours.map((tour) => {
      const reviewCount = tour._count.reviews;
      const avgRating = avgRatingMap.get(tour.tour_id);
      const averageRating = avgRating ? Math.round(avgRating * 10) / 10 : 0;
      const ratingBreakdown: RatingBreakdown = breakdownMap.get(
        tour.tour_id
      ) || {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      return {
        ...tour,
        price_per_person: Number(tour.price_per_person),
        _count: {
          reviews: reviewCount,
        },
        averageRating,
        ratingBreakdown,
      } as unknown as Tour;
    });

    return toursWithRating;
  } catch (error) {
    console.error('Error searching tours:', error);
    throw error;
  }
};

export const fetchTourById = async (tourId: number): Promise<Tour | null> => {
  try {
    const tour = await prisma.tour.findUnique({
      where: {
        tour_id: tourId,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        destinations: {
          include: {
            destination: true,
          },
        },
        gallery: {
          select: {
            image_id: true,
            tour_id: true,
            image_url: true,
            caption: true,
          },
        },
        plans: {
          select: {
            plan_day_id: true,
            tour_id: true,
            day_number: true,
            title: true,
            description: true,
            inclusions: true,
          },
          orderBy: {
            day_number: 'asc',
          },
        },
        reviews: {
          select: {
            review_id: true,
            rating: true,
            comment: true,
            created_at: true,
            user: {
              select: {
                user_id: true,
                full_name: true,
                avatar_url: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!tour) {
      return null;
    }

    const ratingBreakdowns = await prisma.review.groupBy({
      by: ['tour_id', 'rating'],
      where: {
        tour_id: tourId,
      },
      _count: {
        review_id: true,
      },
    });

    const averageRatings = await prisma.review.groupBy({
      by: ['tour_id'],
      where: {
        tour_id: tourId,
      },
      _avg: {
        rating: true,
      },
    });

    const breakdownMap = new Map<number, RatingBreakdown>();
    const avgRatingMap = new Map<number, number>();

    ratingBreakdowns.forEach((item) => {
      if (!breakdownMap.has(item.tour_id)) {
        breakdownMap.set(item.tour_id, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      }
      const breakdown = breakdownMap.get(item.tour_id)!;
      breakdown[item.rating as keyof RatingBreakdown] = item._count.review_id;
    });

    averageRatings.forEach((item) => {
      if (item._avg.rating) {
        avgRatingMap.set(item.tour_id, item._avg.rating);
      }
    });

    const reviewCount = tour._count.reviews;
    const avgRating = avgRatingMap.get(tour.tour_id);
    const averageRating = avgRating ? Math.round(avgRating * 10) / 10 : 0;
    const ratingBreakdown: RatingBreakdown = breakdownMap.get(tour.tour_id) || {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    return {
      ...tour,
      price_per_person: Number(tour.price_per_person),
      _count: {
        reviews: reviewCount,
      },
      averageRating,
      ratingBreakdown,
    } as unknown as Tour;
  } catch (error) {
    console.error('Error fetching tour by ID:', error);
    throw error;
  }
};
