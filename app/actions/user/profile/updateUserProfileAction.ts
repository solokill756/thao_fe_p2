'use server';
import { authOptions } from '@/app/lib/authOptions';
import { updateUser } from '@/app/lib/services/userService';
import { getServerSession } from 'next-auth';
import { ERROR_MESSAGES, USER_PROFILE_CONSTANTS } from '@/app/lib/constants';
import { createUnauthorizedError } from '@/app/lib/utils/errors';
import z from 'zod';
import { getDictionary } from '@/app/lib/get-dictionary';
import type { DictType } from '@/app/lib/types/dictType';

type Locale = 'en' | 'vi';

const createUpdateProfileSchema = (dict: DictType) =>
  z.object({
    fullName: z
      .string()
      .min(
        2,
        dict.useProfile?.fullNameTooShort ||
          USER_PROFILE_CONSTANTS.FULL_NAME_TOO_SHORT
      )
      .max(
        100,
        dict.useProfile?.fullNameTooLong ||
          USER_PROFILE_CONSTANTS.FULL_NAME_TOO_LONG
      )
      .trim(),
    phoneNumber: z
      .string()
      .max(
        20,
        dict.useProfile?.phoneNumberTooLong ||
          USER_PROFILE_CONSTANTS.PHONE_NUMBER_TOO_LONG
      )
      .optional()
      .nullable()
      .transform((val) => (val && val.trim() ? val.trim() : null)),
  });

export async function updateUserProfileAction(
  data: {
    fullName?: string;
    phoneNumber?: string | null;
  },
  locale: Locale = 'en'
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw createUnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const userId = parseInt(session.user.id);
    if (isNaN(userId)) {
      return {
        success: false,
        error: 'Invalid user ID',
      };
    }

    const dict = await getDictionary(locale);

    const UpdateProfileSchema = createUpdateProfileSchema(dict);
    const validationResult = UpdateProfileSchema.safeParse({
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
    });

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const errors: Record<string, string[]> = {};

      if (fieldErrors.fullName) {
        errors.fullName = fieldErrors.fullName;
      }
      if (fieldErrors.phoneNumber) {
        errors.phoneNumber = fieldErrors.phoneNumber;
      }

      return {
        success: false,
        error:
          dict.useProfile?.validationFailed || ERROR_MESSAGES.VALIDATION_FAILED,
        errors,
      };
    }

    await updateUser(userId, {
      full_name: validationResult.data.fullName,
      phone_number: validationResult.data.phoneNumber,
    });

    return {
      success: true,
      message:
        dict.useProfile?.profileUpdated || ERROR_MESSAGES.PROFILE_UPDATED,
    };
  } catch (error) {
    return {
      success: false,
      error: ERROR_MESSAGES.PROFILE_UPDATE_FAILED,
    };
  }
}
