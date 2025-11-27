'use server';

import { fetchAdminUsers } from './userService';
import { CACHE_TAGS } from './cacheTags';
import { cacheTag } from 'next/cache';

export const getAdminUsers = async () => {
  'use cache';
  cacheTag(CACHE_TAGS.USERS);
  cacheTag(CACHE_TAGS.USERS_ADMIN);
  return fetchAdminUsers();
};
