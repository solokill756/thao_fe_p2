'use server';

import { createUser } from '@/app/lib/services/userService';
import { registerState } from '@/app/lib/types/actionType';
import bcrypt from 'bcryptjs';
import z from 'zod';
import { getDictionary } from '@/app/lib/get-dictionary';
import { DictType } from '@/app/lib/types/dictType';

type Locale = 'en' | 'vi';

import { AUTH_CONFIG } from '@/app/lib/constants';

const MIN_PASSWORD_LENGTH = AUTH_CONFIG.MIN_PASSWORD_LENGTH;
const CONFIRM_PASSWORD_FIELD = 'confirmPassword' as const;

const createRegisterSchema = (dict: DictType) =>
  z
    .object({
      fullName: z
        .string()
        .min(1, dict.auth?.register?.name_too_short || 'Name is required'),
      email: z
        .string()
        .email(dict.auth?.register?.email_invalid || 'email is not valid'),
      password: z
        .string()
        .min(
          MIN_PASSWORD_LENGTH,
          dict.auth?.register?.password_too_short || 'password is too short'
        ),
      confirmPassword: z
        .string()
        .min(
          MIN_PASSWORD_LENGTH,
          dict.auth?.register?.confirm_password_too_short ||
            'Passwords do not match'
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message:
        dict.auth?.register?.passwordMismatch || 'Passwords do not match',
      path: [CONFIRM_PASSWORD_FIELD],
    });

export async function registerAction(
  prevState: registerState,
  formData: FormData
): Promise<registerState> {
  const locale = (formData.get('locale') as Locale) || 'en';
  const dict = await getDictionary(locale);

  const rawData = {
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const RegisterSchema = createRegisterSchema(dict);
  const validationResult = RegisterSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      message: '',
    };
  }

  try {
    const { fullName, email, password } = validationResult.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await createUser(fullName, email, hashedPassword);

    if (!res) {
      return {
        message: '',
        errors: {
          server_error: [
            dict.auth?.register?.registrationFailed || 'Registration failed',
          ],
        },
      };
    }

    return {
      message:
        dict.auth?.register?.successful_registration ||
        'Registration successful',
      errors: {},
    };
  } catch (error) {
    const errorMessageText =
      error instanceof Error ? error.message : String(error);

    if (
      errorMessageText.includes(
        'Unique constraint failed on the fields: (`email`)'
      ) ||
      (errorMessageText.toLowerCase().includes('unique constraint') &&
        errorMessageText.toLowerCase().includes('email'))
    ) {
      return {
        message: '',
        errors: {
          email: [dict.auth?.register?.emailExists || 'Email already exists'],
        },
      };
    }

    return {
      message: '',
      errors: {
        server_error: [
          dict.auth?.register?.server_error || 'Server error occurred',
        ],
      },
    };
  }
}
