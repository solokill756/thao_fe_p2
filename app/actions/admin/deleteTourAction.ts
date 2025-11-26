'use server';

import { authOptions } from '@/app/lib/authOptions';
import { deleteTour } from '@/app/lib/services/tourService';
import { getServerSession } from 'next-auth';
import { ERROR_MESSAGES } from '@/app/lib/constants';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import { revalidateAllTourCaches } from '@/app/lib/services/cacheUtils';

export async function deleteTourAction(tourId: number): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      throw createUnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }
    await deleteTour(tourId);
    revalidateAllTourCaches();
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting tour:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      action: 'deleteTourAction',
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error deleting tour',
    };
  }
}
