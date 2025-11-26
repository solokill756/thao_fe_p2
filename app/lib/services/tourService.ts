import prisma from '../prisma';
import {
  TrendingTour,
  RatingBreakdown,
  Tour,
  TourWithRelations,
} from '../types/tourTypes';

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

// Admin functions
export const fetchAdminTours = async (): Promise<TourWithRelations[]> => {
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
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Calculate average ratings
    const tourIds = tours.map((tour) => tour.tour_id);
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

    const avgRatingMap = new Map<number, number>();
    averageRatings.forEach((item) => {
      if (item._avg.rating) {
        avgRatingMap.set(item.tour_id, item._avg.rating);
      }
    });

    const toursWithRating: TourWithRelations[] = tours.map((tour) => {
      const avgRating = avgRatingMap.get(tour.tour_id);
      const averageRating = avgRating ? Math.round(avgRating * 10) / 10 : 0;

      return {
        tour_id: tour.tour_id,
        title: tour.title,
        description: tour.description,
        price_per_person: Number(tour.price_per_person),
        duration_days: tour.duration_days,
        max_guests: tour.max_guests,
        cover_image_url: tour.cover_image_url,
        departure_location: tour.departure_location,
        departure_time: tour.departure_time || null,
        return_time: tour.return_time || null,
        start_date: (tour as { start_date?: Date | null }).start_date || null,
        what_included:
          (tour as { what_included?: unknown }).what_included || null,
        what_not_included:
          (tour as { what_not_included?: unknown }).what_not_included || null,
        created_at: tour.created_at,
        updated_at: tour.updated_at,
        categories: tour.categories,
        destinations: tour.destinations,
        gallery: tour.gallery,
        plans: tour.plans || [],
        _count: tour._count,
        averageRating,
        ratingBreakdown: null,
      };
    });

    return toursWithRating;
  } catch (error) {
    console.error('Error fetching admin tours:', error);
    throw error;
  }
};

export interface TourPlanData {
  day_number: number;
  title: string;
  description: string;
  inclusions?: string[];
}

export interface CreateTourData {
  title: string;
  description: string;
  price_per_person: number;
  duration_days: number;
  max_guests: number;
  cover_image_url?: string;
  gallery_images?: string[];
  departure_location?: string;
  departure_time?: string;
  return_time?: string;
  start_date?: Date;
  category_ids?: number[];
  destination_ids?: number[];
  tour_plans?: TourPlanData[];
  what_included?: string[];
  what_not_included?: string[];
}

export interface UpdateTourData extends Partial<CreateTourData> {
  tour_id: number;
}

const parseTimeString = (
  timeString: string | undefined | null
): Date | null => {
  if (!timeString || timeString.trim() === '') {
    return null;
  }

  try {
    if (timeString.includes('T') || timeString.includes(' ')) {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) {
        return null;
      }
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      return new Date(1970, 0, 1, hours, minutes, seconds);
    }

    const timeRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
    const match = timeString.match(timeRegex);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const seconds = match[3] ? parseInt(match[3], 10) : 0;

      if (
        hours >= 0 &&
        hours < 24 &&
        minutes >= 0 &&
        minutes < 60 &&
        seconds >= 0 &&
        seconds < 60
      ) {
        return new Date(1970, 0, 1, hours, minutes, seconds);
      }
    }

    return null;
  } catch {
    return null;
  }
};

export const createTour = async (
  data: CreateTourData
): Promise<TourWithRelations> => {
  try {
    const tour = await prisma.tour.create({
      data: {
        title: data.title,
        description: data.description,
        price_per_person: data.price_per_person,
        duration_days: data.duration_days,
        max_guests: data.max_guests,
        cover_image_url: data.cover_image_url || null,
        departure_location: data.departure_location || null,
        departure_time: parseTimeString(data.departure_time),
        return_time: parseTimeString(data.return_time),
        ...(data.start_date ? { start_date: data.start_date } : {}),
        what_included:
          data.what_included && data.what_included.length > 0
            ? data.what_included
            : undefined,
        what_not_included:
          data.what_not_included && data.what_not_included.length > 0
            ? data.what_not_included
            : undefined,
        gallery: data.gallery_images?.length
          ? {
              create: data.gallery_images.map((image_url) => ({
                image_url,
              })),
            }
          : undefined,
        categories: data.category_ids
          ? {
              create: data.category_ids.map((category_id) => ({
                category_id,
              })),
            }
          : undefined,
        destinations: data.destination_ids
          ? {
              create: data.destination_ids.map((destination_id) => ({
                destination_id,
              })),
            }
          : undefined,
        plans: data.tour_plans?.length
          ? {
              create: data.tour_plans.map((plan) => ({
                day_number: plan.day_number,
                title: plan.title,
                description: plan.description,
                ...(plan.inclusions && plan.inclusions.length > 0
                  ? { inclusions: plan.inclusions }
                  : {}),
              })),
            }
          : undefined,
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
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    });

    return await mapTourToTourWithRelations(tour);
  } catch (error) {
    console.error('Error creating tour:', error);
    throw error;
  }
};

const mapTourToTourWithRelations = async (
  tour: Record<string, unknown> & {
    tour_id: number;
    title: string;
    description: string;
    price_per_person: unknown;
    duration_days: number;
    max_guests: number;
    cover_image_url: string | null;
    departure_location: string | null;
    departure_time: Date | null;
    return_time: Date | null;
    start_date?: Date | null;
    created_at: Date | null;
    updated_at: Date | null;
    categories: unknown[];
    destinations: unknown[];
    gallery?: unknown[];
    plans?: unknown[];
    _count: {
      bookings: number;
      reviews: number;
    };
  }
): Promise<TourWithRelations> => {
  const avgRating = await prisma.review.groupBy({
    by: ['tour_id'],
    where: {
      tour_id: tour.tour_id,
    },
    _avg: {
      rating: true,
    },
  });

  const averageRating = avgRating[0]?._avg.rating
    ? Math.round(avgRating[0]._avg.rating * 10) / 10
    : 0;

  return {
    tour_id: tour.tour_id,
    title: tour.title,
    description: tour.description,
    price_per_person: Number(tour.price_per_person),
    duration_days: tour.duration_days,
    max_guests: tour.max_guests,
    cover_image_url: tour.cover_image_url,
    departure_location: tour.departure_location,
    departure_time: tour.departure_time || null,
    return_time: tour.return_time || null,
    start_date: tour.start_date ?? null,
    what_included: (tour as { what_included?: unknown }).what_included || null,
    what_not_included:
      (tour as { what_not_included?: unknown }).what_not_included || null,
    created_at: tour.created_at,
    updated_at: tour.updated_at,
    categories: tour.categories as TourWithRelations['categories'],
    destinations: tour.destinations as TourWithRelations['destinations'],
    gallery: (tour.gallery || []) as TourWithRelations['gallery'],
    plans: (tour.plans || []) as TourWithRelations['plans'],
    _count: tour._count,
    averageRating,
    ratingBreakdown: null,
  };
};

const buildCategoriesUpdate = (
  existingIds: number[],
  newIds: number[] | undefined
) => {
  if (!newIds) {
    return undefined;
  }

  const sortedExisting = [...existingIds].sort((a, b) => a - b);
  const sortedNew = [...newIds].sort((a, b) => a - b);

  if (
    sortedExisting.length === sortedNew.length &&
    sortedExisting.every((val, idx) => val === sortedNew[idx])
  ) {
    return undefined;
  }

  const toDelete = existingIds.filter((id) => !newIds.includes(id));
  const toCreate = newIds.filter((id) => !existingIds.includes(id));

  return {
    deleteMany: toDelete.length > 0 ? { category_id: { in: toDelete } } : {},
    create: toCreate.map((category_id) => ({ category_id })),
  };
};

const buildDestinationsUpdate = (
  existingIds: number[],
  newIds: number[] | undefined
) => {
  if (!newIds) {
    return undefined;
  }

  const sortedExisting = [...existingIds].sort((a, b) => a - b);
  const sortedNew = [...newIds].sort((a, b) => a - b);

  if (
    sortedExisting.length === sortedNew.length &&
    sortedExisting.every((val, idx) => val === sortedNew[idx])
  ) {
    return undefined;
  }

  const toDelete = existingIds.filter((id) => !newIds.includes(id));
  const toCreate = newIds.filter((id) => !existingIds.includes(id));

  return {
    deleteMany: toDelete.length > 0 ? { destination_id: { in: toDelete } } : {},
    create: toCreate.map((destination_id) => ({ destination_id })),
  };
};

export const updateTour = async (
  data: UpdateTourData
): Promise<TourWithRelations> => {
  try {
    const existingTour = await prisma.tour.findUnique({
      where: { tour_id: data.tour_id },
      include: {
        categories: true,
        destinations: true,
        gallery: true,
        plans: true,
      },
    });

    if (!existingTour) {
      throw new Error('Tour not found');
    }

    const existingCategoryIds = existingTour.categories.map(
      (tc) => tc.category_id
    );
    const existingDestinationIds = existingTour.destinations.map(
      (td) => td.destination_id
    );

    const categoriesUpdate = buildCategoriesUpdate(
      existingCategoryIds,
      data.category_ids
    );
    const destinationsUpdate = buildDestinationsUpdate(
      existingDestinationIds,
      data.destination_ids
    );

    const tour = await prisma.tour.update({
      where: { tour_id: data.tour_id },
      data: {
        title: data.title,
        description: data.description,
        price_per_person: data.price_per_person,
        duration_days: data.duration_days,
        max_guests: data.max_guests,
        cover_image_url: data.cover_image_url,
        departure_location: data.departure_location,
        departure_time:
          data.departure_time !== undefined
            ? parseTimeString(data.departure_time)
            : undefined,
        return_time:
          data.return_time !== undefined
            ? parseTimeString(data.return_time)
            : undefined,
        ...(data.start_date !== undefined
          ? { start_date: data.start_date }
          : {}),
        // Update categories only if changed
        categories: categoriesUpdate,
        // Update destinations only if changed
        destinations: destinationsUpdate,
        gallery:
          data.gallery_images !== undefined
            ? {
                deleteMany: {},
                create: data.gallery_images.map((image_url) => ({
                  image_url,
                })),
              }
            : undefined,
        plans:
          data.tour_plans !== undefined
            ? {
                deleteMany: {},
                create: data.tour_plans.map((plan) => ({
                  day_number: plan.day_number,
                  title: plan.title,
                  description: plan.description,
                  ...(plan.inclusions && plan.inclusions.length > 0
                    ? { inclusions: plan.inclusions }
                    : {}),
                })),
              }
            : undefined,
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
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    });

    return await mapTourToTourWithRelations(tour);
  } catch (error) {
    console.error('Error updating tour:', error);
    throw error;
  }
};

export const deleteTour = async (tourId: number): Promise<void> => {
  try {
    await prisma.tour.delete({
      where: { tour_id: tourId },
    });
  } catch (error) {
    console.error('Error deleting tour:', error);
    throw error;
  }
};
