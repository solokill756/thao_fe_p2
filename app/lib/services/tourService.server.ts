'use server';

import { cacheLife, cacheTag } from 'next/cache';
import {
  fetchAdminTours,
  fetchTourById,
  fetchTours,
  fetchTrendingTours,
  searchTours,
} from './tourService';
import type { SearchToursParams } from './tourService';
import { CACHE_TAGS } from './cacheTags';

export const getTours = async (limit: number = 10, offset: number = 0) => {
  'use cache';
  cacheTag(CACHE_TAGS.TOURS);
  cacheTag(CACHE_TAGS.TOURS_LIST);
  return fetchTours(limit, offset);
};

export const getTrendingTours = async (limit: number = 10) => {
  'use cache';
  cacheTag(CACHE_TAGS.TOURS);
  cacheTag(CACHE_TAGS.TOURS_TRENDING);
  return fetchTrendingTours(limit);
};

export const searchToursAction = async (params: SearchToursParams) => {
  'use cache';
  cacheTag(CACHE_TAGS.TOURS);
  cacheTag(CACHE_TAGS.TOURS_SEARCH);
  return searchTours(params);
};

export const getTourById = async (tourId: number) => {
  'use cache';
  cacheTag(CACHE_TAGS.TOURS);
  cacheTag(CACHE_TAGS.TOUR_DETAIL);
  return fetchTourById(tourId);
};

export const getAdminTours = async () => {
  'use cache';
  cacheTag(CACHE_TAGS.TOURS);
  cacheTag(CACHE_TAGS.TOURS_ADMIN);
  return fetchAdminTours();
};
