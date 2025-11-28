import { QueryClient, dehydrate } from '@tanstack/react-query';
import { makeQueryClient } from '@/app/lib/utils/queryClient';

export async function prefetchQuery<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  options?: {
    staleTime?: number;
  }
): Promise<QueryClient> {
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: options?.staleTime ?? 60 * 1000,
  });

  return queryClient;
}

export function dehydrateQueryClient(queryClient: QueryClient) {
  return dehydrate(queryClient);
}
