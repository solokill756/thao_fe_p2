'use server';

import { authOptions } from '@/app/lib/authOptions';
import { getServerSession } from 'next-auth';
import { ERROR_MESSAGES } from '@/app/lib/constants';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import type { TourWithRelations } from '@/app/lib/types/tourTypes';
import { fetchAdminTours } from '@/app/lib/services/tourService';

export type { TourWithRelations } from '@/app/lib/types/tourTypes';

export async function getToursAction(): Promise<{
  success: boolean;
  tours?: TourWithRelations[];
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      throw createUnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const tours = await fetchAdminTours();
    return {
      success: true,
      tours,
    };
  } catch (error) {
    console.error('Error getting tours:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      action: 'getToursAction',
    });
    return {
      success: false,
      error: 'Error getting tours',
    };
  }
}
