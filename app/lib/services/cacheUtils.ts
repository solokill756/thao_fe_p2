'use server';

import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from './cacheTags';

export async function revalidateToursCache() {
  revalidateTag(CACHE_TAGS.TOURS, 'max');
}

export async function revalidateTrendingToursCache() {
  revalidateTag(CACHE_TAGS.TOURS, 'max');
  revalidateTag(CACHE_TAGS.TOURS_TRENDING, 'max');
}

export async function revalidateToursListCache() {
  revalidateTag(CACHE_TAGS.TOURS, 'max');
  revalidateTag(CACHE_TAGS.TOURS_LIST, 'max');
}

export async function revalidateSearchCache() {
  revalidateTag(CACHE_TAGS.TOURS, 'max');
  revalidateTag(CACHE_TAGS.TOURS_SEARCH, 'max');
}

export async function revalidateTourDetailCache() {
  revalidateTag(CACHE_TAGS.TOURS, 'max');
  revalidateTag(CACHE_TAGS.TOUR_DETAIL, 'max');
}

export async function revalidateAdminToursCache() {
  revalidateTag(CACHE_TAGS.TOURS_ADMIN, 'max');
}

export async function revalidateBookingsCache() {
  revalidateTag(CACHE_TAGS.BOOKINGS, 'max');
}

export async function revalidateAllUserCaches() {
  revalidateTag(CACHE_TAGS.USERS, 'max');
  revalidateTag(CACHE_TAGS.USERS_ADMIN, 'max');
}
export async function revalidateAllTourCaches() {
  revalidateTag(CACHE_TAGS.TOURS, 'max');
  revalidateTag(CACHE_TAGS.TOURS_LIST, 'max');
  revalidateTag(CACHE_TAGS.TOURS_TRENDING, 'max');
  revalidateTag(CACHE_TAGS.TOURS_SEARCH, 'max');
  revalidateTag(CACHE_TAGS.TOUR_DETAIL, 'max');
  revalidateTag(CACHE_TAGS.TOURS_ADMIN, 'max');
  revalidateTag(CACHE_TAGS.BOOKINGS, 'max');
  revalidateTag(CACHE_TAGS.USERS, 'max');
  revalidateTag(CACHE_TAGS.USERS_ADMIN, 'max');
}
