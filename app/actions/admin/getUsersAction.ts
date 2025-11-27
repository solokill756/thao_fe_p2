'use server';

import { authOptions } from '@/app/lib/authOptions';
import { getServerSession } from 'next-auth';
import { ERROR_MESSAGES } from '@/app/lib/constants';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import type { UserWithStats } from '@/app/lib/types/userType';
import { fetchAdminUsers } from '@/app/lib/services/userService';

export type { UserWithStats } from '@/app/lib/types/userType';

export async function getUsersAction(): Promise<{
  success: boolean;
  users?: UserWithStats[];
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      throw createUnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const users = await fetchAdminUsers();
    return {
      success: true,
      users,
    };
  } catch (error) {
    console.error('Error getting users:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      action: 'getUsersAction',
    });
    return {
      success: false,
      error: 'Error getting users',
    };
  }
}
