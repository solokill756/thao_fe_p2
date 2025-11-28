import { cacheTag } from 'next/cache';
import { fetchCategories } from './categoriesService';

export const getCategories = async () => {
  'use cache';
  cacheTag('categories');
  return fetchCategories();
};
