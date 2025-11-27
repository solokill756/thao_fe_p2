'use server';

import { authOptions } from '@/app/lib/authOptions';
import { getServerSession } from 'next-auth';
import { ERROR_MESSAGES } from '@/app/lib/constants';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import { updateUserStatus } from '@/app/lib/services/userService';
import { Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { revalidateAllUserCaches } from '@/app/lib/services/cacheUtils';

export async function updateUserStatusAction(
  userId: number,
  role: Role
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      throw createUnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await updateUserStatus(userId, role);
    revalidateAllUserCaches();
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error updating user status:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      action: 'updateUserStatusAction',
    });
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update user status',
    };
  }
}
