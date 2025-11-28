'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { DictType } from '@/app/lib/types/dictType';
import { registerState } from '@/app/lib/types/actionType';
import { registerAction } from '@/app/actions/auth/registerAction';
import toast from 'react-hot-toast';
import AuthInput from './RenderAuthInput';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import {
  AUTH_MESSAGES,
  AUTH_LABELS,
  AUTH_PLACEHOLDERS,
  TOAST_DURATIONS,
} from '@/app/lib/constants';

interface RegisterFormProps {
  dictionary: DictType;
  locale: 'en' | 'vi';
}

const ERROR_TEXT_CLASSES = 'text-red-500 text-sm mt-1';

export default function RenderRegisterForm({
  dictionary,
  locale,
}: RegisterFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const initialState: registerState = {
    errors: {},
    message: '',
  };
  const toastShownRef = useRef(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleAction = async (
    prevState: registerState | undefined,
    formData: FormData
  ): Promise<registerState> => {
    const result = await registerAction(prevState || initialState, formData);

    return result || { errors: {}, message: '' };
  };

  const [state, formAction, isPending] = useActionState(
    handleAction,
    initialState
  ) as [registerState, (payload: FormData) => void, boolean];

  const handleFormSubmit = async (fd: FormData) => {
    fd.set('fullName', formData.fullName);
    fd.set('email', formData.email);
    fd.set('password', formData.password);
    fd.set('confirmPassword', formData.confirmPassword);
    fd.set('locale', locale);
    formAction(fd);
    toastShownRef.current = false;
  };

  useEffect(() => {
    if (toastShownRef.current) return;

    const hasErrors =
      state.errors &&
      Object.values(state.errors).some(
        (messages) => messages && messages.length > 0
      );

    if (state.message && !hasErrors) {
      toast.success(
        state.message ||
          (dictionary.auth?.register?.successful_registration ??
            AUTH_MESSAGES.REGISTRATION_SUCCESSFUL)
      );
      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      }, 100);
      toastShownRef.current = true;
    } else if (hasErrors) {
      const allErrors: string[] = [];
      const errorFields = [
        'email',
        'fullName',
        'password',
        'confirmPassword',
        'server_error',
      ];

      errorFields.forEach((field) => {
        const fieldErrors = state.errors?.[field as keyof typeof state.errors];
        if (fieldErrors && fieldErrors.length > 0) {
          fieldErrors.forEach((error) => {
            if (error && !allErrors.includes(error)) {
              allErrors.push(error);
            }
          });
        }
      });

      if (allErrors.length === 0) {
        const defaultMessage =
          dictionary.auth?.register?.registrationFailed ??
          AUTH_MESSAGES.REGISTRATION_FAILED;
        toast.error(defaultMessage);
      } else if (allErrors.length === 1) {
        toast.error(allErrors[0]);
      } else {
        const errorList = allErrors
          .map((error, index) => `${index + 1}. ${error}`)
          .join('\n');
        const multipleErrorsLabel =
          dictionary.auth?.register?.multipleErrors ??
          AUTH_MESSAGES.MULTIPLE_ERRORS;
        toast.error(`${multipleErrorsLabel}\n${errorList}`, {
          duration: TOAST_DURATIONS.ERROR,
        });
      }
      toastShownRef.current = true;
    }
  }, [state, locale, dictionary]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        {dictionary.auth?.register?.title ?? AUTH_LABELS.REGISTER}
      </h2>
      <p className="text-gray-600 mb-6">
        {dictionary.auth?.register?.subtitle ?? AUTH_LABELS.CREATE_YOUR_ACCOUNT}
      </p>

      <form action={handleFormSubmit}>
        <AuthInput
          id="register-name"
          name="fullName"
          label={dictionary.auth?.register?.fullName ?? AUTH_LABELS.FULL_NAME}
          type="text"
          placeholder={AUTH_PLACEHOLDERS.FULL_NAME}
          icon={<FaUser />}
          value={formData.fullName}
          onChange={handleChange}
        />
        {state.errors?.fullName && state.errors.fullName.length > 0 && (
          <p className={ERROR_TEXT_CLASSES}>{state.errors.fullName[0]}</p>
        )}
        <AuthInput
          id="register-email"
          name="email"
          label={dictionary.auth?.register?.email ?? AUTH_LABELS.EMAIL}
          type="email"
          placeholder={AUTH_PLACEHOLDERS.EMAIL_EXAMPLE}
          icon={<FaEnvelope />}
          value={formData.email}
          onChange={handleChange}
        />
        {state.errors?.email && state.errors.email.length > 0 && (
          <p className={ERROR_TEXT_CLASSES}>{state.errors.email[0]}</p>
        )}
        <AuthInput
          id="register-password"
          name="password"
          label={dictionary.auth?.register?.password ?? AUTH_LABELS.PASSWORD}
          type="password"
          placeholder={AUTH_PLACEHOLDERS.PASSWORD}
          icon={<FaLock />}
          value={formData.password}
          onChange={handleChange}
        />
        {state.errors?.password && state.errors.password.length > 0 && (
          <p className={ERROR_TEXT_CLASSES}>{state.errors.password[0]}</p>
        )}
        <AuthInput
          id="register-confirm-password"
          name="confirmPassword"
          label={
            dictionary.auth?.register?.confirmPassword ??
            AUTH_LABELS.CONFIRM_PASSWORD
          }
          type="password"
          placeholder={AUTH_PLACEHOLDERS.PASSWORD}
          icon={<FaLock />}
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {state.errors?.confirmPassword &&
          state.errors.confirmPassword.length > 0 && (
            <p className={ERROR_TEXT_CLASSES}>
              {state.errors.confirmPassword[0]}
            </p>
          )}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full mt-2 bg-orange-500 text-white font-bold py-3 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-200 shadow-lg ${
            isPending ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isPending
            ? `${dictionary.auth?.register?.signingUp ?? AUTH_LABELS.SIGNING_UP}...`
            : (dictionary.auth?.register?.signUp ?? AUTH_LABELS.SIGN_UP)}
        </button>
      </form>
    </div>
  );
}
