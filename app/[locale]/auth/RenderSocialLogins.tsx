'use client';

import { signIn } from 'next-auth/react';
import { DictType } from '@/app/lib/type/dictType';
import { FaGoogle } from 'react-icons/fa';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';
import {
  AUTH_MESSAGES,
  AUTH_LABELS,
  AUTH_ERROR_MESSAGES,
} from '@/app/lib/constants';

interface SocialLoginsProps {
  dictionary: DictType;
  locale: 'en' | 'vi';
}

export default function RenderSocialLogins({
  dictionary,
  locale,
}: SocialLoginsProps) {
  const loginDict = dictionary.auth?.login;
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useNavigationLoading();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: `/${locale}/user/home`,
      });

      if (result?.error) {
        toast.error(loginDict?.googleSignInError || AUTH_MESSAGES.GOOGLE_SIGN_IN_FAILED);
      } else if (result?.ok) {
        toast.success(loginDict?.login_successful || AUTH_MESSAGES.LOGIN_SUCCESSFUL);
        push(`/${locale}/user/home`);
      }
    } catch (err) {
      console.error(AUTH_ERROR_MESSAGES.GOOGLE_SIGN_IN_ERROR, err);
      toast.error(loginDict?.googleSignInError || AUTH_MESSAGES.GOOGLE_SIGN_IN_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            {loginDict?.orContinueWith}
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className={`w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <FaGoogle />
          <span>
            {isLoading
              ? loginDict?.signingIn || AUTH_LABELS.SIGNING_IN_WITH_DOTS
              : loginDict?.googleSignIn}
          </span>
        </button>
      </div>
    </div>
  );
}
