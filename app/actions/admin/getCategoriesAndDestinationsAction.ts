'use server';

import { authOptions } from '@/app/lib/authOptions';
import { getServerSession } from 'next-auth';
import { ERROR_MESSAGES } from '@/app/lib/constants';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import { fetchDestinations } from '@/app/lib/services/destinationService';
import { fetchCategories } from '@/app/lib/services/categoriesService';

export async function getCategoriesAndDestinationsAction(): Promise<{
  success: boolean;
  categories?: Array<{
    category_id: number;
    name: string;
    description: string | null;
  }>;
  destinations?: Array<{
    destination_id: number;
    name: string;
    country: string | null;
  }>;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      throw createUnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const [categories, destinations] = await Promise.all([
      fetchCategories(),
      fetchDestinations(),
    ]);

    return {
      success: true,
      categories,
      destinations,
    };
  } catch (error) {
    console.error('Error getting categories and destinations:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      action: 'getCategoriesAndDestinationsAction',
    });
    return {
      success: false,
      error: 'Error getting categories and destinations',
    };
  }
}
