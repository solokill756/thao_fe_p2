import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Category, UseCategoriesOptions } from '../types/tourTypes';
import { getCategories } from '../services/categoriesService.server';

export const useCategories = (
  options: UseCategoriesOptions = {},
  queryOptions?: Omit<
    UseQueryOptions<Category[], Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const { enabled = true } = options;
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: async () => {
      const categories = await getCategories();
      return categories;
    },
    enabled,
    ...queryOptions,
  });
};
