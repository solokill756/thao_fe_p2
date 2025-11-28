'use client';

import { signIn, SignInOptions, getSession } from 'next-auth/react';
import { DictType } from '@/app/lib/types/dictType';
import { useState } from 'react';
import toast from 'react-hot-toast';
import RenderAuthInput from './RenderAuthInput';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';
import { AUTH_LOGIN_CONSTANTS } from '@/app/lib/constants';

interface LoginFormProps {
  dictionary: DictType;
  locale: 'en' | 'vi';
}

export default function RenderLoginForm({
  dictionary,
  locale,
}: LoginFormProps) {
  const loginDict = dictionary.auth?.login;
  const [email, setEmail] = useState('');
  const [pwdValue, setPwdValue] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const { push, refresh, isPending } = useNavigationLoading();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const emailForAuth = email;
      const passwordForAuth = pwdValue;
      const signInOptions: Record<string, unknown> = {
        redirect: false,
        email: emailForAuth,
      };
      signInOptions.password = passwordForAuth;

      const result = await signIn(
        AUTH_LOGIN_CONSTANTS.SIGN_IN_PROVIDER,
        signInOptions as SignInOptions
      );

      if (result?.error) {
        toast.error(
          loginDict?.invalidCredentials ||
            AUTH_LOGIN_CONSTANTS.INVALID_CREDENTIALS
        );
      } else if (result?.ok) {
        const session = await getSession();
        const userRole = session?.user?.role;

        toast.success(
          loginDict?.login_successful || AUTH_LOGIN_CONSTANTS.LOGIN_SUCCESSFUL
        );

        if (userRole === 'admin') {
          push(`/${locale}${AUTH_LOGIN_CONSTANTS.ADMIN_HOME_PATH}`);
        } else {
          push(`/${locale}/`);
        }

        if (!isPending) {
          refresh();
        }
      }
    } catch {
      toast.error(
        loginDict?.invalidCredentials ||
          AUTH_LOGIN_CONSTANTS.INVALID_CREDENTIALS
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        {loginDict?.title || AUTH_LOGIN_CONSTANTS.DEFAULT_TITLE}
      </h2>
      <p className="text-gray-600 mb-6">
        {loginDict?.subtitle || AUTH_LOGIN_CONSTANTS.DEFAULT_SUBTITLE}
      </p>

      <form onSubmit={handleSubmit}>
        <RenderAuthInput
          id="login-email"
          name="email"
          label={loginDict?.email || AUTH_LOGIN_CONSTANTS.EMAIL_LABEL}
          type="email"
          placeholder={AUTH_LOGIN_CONSTANTS.EMAIL_PLACEHOLDER}
          icon={<FaEnvelope />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <RenderAuthInput
          id="login-password"
          name="password"
          label={loginDict?.password || AUTH_LOGIN_CONSTANTS.PASSWORD_LABEL}
          type="password"
          placeholder={AUTH_LOGIN_CONSTANTS.PASSWORD_PLACEHOLDER}
          icon={<FaLock />}
          value={pwdValue}
          onChange={(e) => setPwdValue(e.target.value)}
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-200 shadow-lg ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading
            ? `${loginDict?.signingIn || AUTH_LOGIN_CONSTANTS.SIGNING_IN}...`
            : loginDict?.signIn || AUTH_LOGIN_CONSTANTS.SIGN_IN}
        </button>
      </form>
    </div>
  );
}
