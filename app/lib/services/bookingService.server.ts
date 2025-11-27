import { cacheTag } from 'next/cache';
import { fetchBookings, fetchUserBookings } from './bookingService';
import { CACHE_TAGS } from './cacheTags';

export async function getBookings() {
  'use cache';
  cacheTag(CACHE_TAGS.BOOKINGS);
  return fetchBookings();
}

export async function getUserBookings(userId: number) {
  'use cache';
  cacheTag(CACHE_TAGS.BOOKINGS);
  return fetchUserBookings(userId);
}
