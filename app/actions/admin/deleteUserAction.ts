'use server';

import { authOptions } from '@/app/lib/authOptions';
import { getServerSession } from 'next-auth';
import { ERROR_MESSAGES } from '@/app/lib/constants';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import { deleteUserById } from '@/app/lib/services/userService';
import { revalidateAllUserCaches } from '@/app/lib/services/cacheUtils';

export async function deleteUserAction(userId: number): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      throw createUnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await deleteUserById(userId);
    revalidateAllUserCaches();
    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting user:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      action: 'deleteUserAction',
    });
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete user',
    };
  }
}
