import { JsonValue } from '@prisma/client/runtime/library';

// Base types
export interface Category {
  category_id: number;
  name: string;
  description: string | null;
}

export interface Destination {
  destination_id: number;
  name: string;
  country: string | null;
  image_url: string | null;
  description: string | null;
}

export interface TourGallery {
  image_id: number;
  tour_id: number;
  image_url: string;
  caption: string | null;
}

export interface TourPlan {
  plan_day_id: number;
  tour_id: number;
  day_number: number;
  title: string;
  description: string;
  inclusions: JsonValue | null;
}

export interface TourCategoryRelation {
  category: Category;
}

export interface TourDestinationRelation {
  destination: Destination;
}

export interface TourBase {
  tour_id: number;
  title: string;
  description: string;
  price_per_person: number;
  duration_days: number;
  max_guests: number;
  cover_image_url: string | null;
  departure_location: string | null;
  departure_time: Date | null;
  return_time: Date | null;
  start_date: Date | null;
  what_included: JsonValue | null;
  what_not_included: JsonValue | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface RatingBreakdown {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

// Tour with all relations (from getTours)
export interface TourReview {
  review_id: number;
  rating: number;
  comment: string | null;
  created_at: Date | null;
  user: {
    user_id: number;
    full_name: string;
    avatar_url: string | null;
  } | null;
}

export interface Tour extends TourBase {
  categories: TourCategoryRelation[];
  destinations: TourDestinationRelation[];
  gallery: TourGallery[];
  plans: TourPlan[];
  reviews: TourReview[];
  _count: {
    reviews: number;
  };
  averageRating: number;
  ratingBreakdown: RatingBreakdown | null;
}

export interface TrendingTour extends TourBase {
  categories: TourCategoryRelation[];
  destinations: TourDestinationRelation[];
  gallery: TourGallery[];
  plans: TourPlan[];
  reviews: TourReview[];
  _count: {
    reviews: number;
  };
  averageRating: number;
  ratingBreakdown: RatingBreakdown | null;
}

export interface ToursResponse {
  success: boolean;
  data: Tour[];
}

export interface TrendingToursResponse {
  success: boolean;
  data: TrendingTour[];
}

// Hook options types
export interface UseToursOptions {
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

export interface UseTrendingToursOptions {
  limit?: number;
  enabled?: boolean;
}

export interface UseCategoriesOptions {
  enabled?: boolean;
}

export interface GalleryItem {
  id: string;
  url: string | null;
  preview: string;
  uploading: boolean;
}
export interface TourWithRelations {
  tour_id: number;
  title: string;
  description: string;
  price_per_person: number;
  duration_days: number;
  max_guests: number;
  cover_image_url: string | null;
  departure_location: string | null;
  departure_time: Date | string | null;
  return_time: Date | string | null;
  start_date: Date | null;
  what_included: JsonValue | null;
  what_not_included: JsonValue | null;
  created_at: Date | null;
  updated_at: Date | null;
  categories: TourCategoryRelation[];
  destinations: TourDestinationRelation[];
  gallery?: TourGallery[];
  plans?: TourPlan[];
  _count: {
    bookings: number;
    reviews: number;
  };
  averageRating?: number;
  ratingBreakdown?: RatingBreakdown | null;
}
