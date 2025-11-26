import { cacheLife, cacheTag } from 'next/cache';
import { fetchBookings } from './bookingService';
import { CACHE_TAGS } from './cacheTags';

export async function getBookings() {
  'use cache';
  cacheTag(CACHE_TAGS.BOOKINGS);
  return fetchBookings();
}
