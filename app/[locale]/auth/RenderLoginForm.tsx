'use client';

import { signIn } from 'next-auth/react';

import { DictType } from '@/app/lib/type/dictType';
import { useState } from 'react';
import toast from 'react-hot-toast';
import AuthInput from './RenderAuthInput';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';
import {
  AUTH_MESSAGES,
  AUTH_LABELS,
  AUTH_PLACEHOLDERS,
  AUTH_ERROR_MESSAGES,
} from '@/app/lib/constants';

interface LoginFormProps {
  dictionary: DictType;
  locale: 'en' | 'vi';
}

export default function RenderLoginForm({ dictionary, locale }: LoginFormProps) {
  const loginDict = dictionary.auth?.login;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useNavigationLoading();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      });

      if (result?.error) {
        const errorMsg =
          loginDict?.invalidCredentials ??
          AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD;
        toast.error(errorMsg);
      } else if (result?.ok) {
        toast.success(
          loginDict?.login_successful ?? AUTH_MESSAGES.LOGIN_SUCCESSFUL
        );
        push(`/${locale}/user/home`);
      }
    } catch (err) {
      console.error(AUTH_ERROR_MESSAGES.LOGIN_ERROR, {
        error: err,
        message:
          err instanceof Error ? err.message : AUTH_MESSAGES.LOGIN_FAILED,
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      const errorMsg =
        loginDict?.invalidCredentials ??
        AUTH_MESSAGES.INVALID_EMAIL_OR_PASSWORD;
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        {loginDict?.title}
      </h2>
      <p className="text-gray-600 mb-6">{loginDict?.subtitle}</p>

      <form onSubmit={handleSubmit}>
        <AuthInput
          id="login-email"
          name="email"
          label={loginDict?.email ?? AUTH_LABELS.EMAIL}
          type="email"
          placeholder={AUTH_PLACEHOLDERS.EMAIL}
          icon={<FaEnvelope />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthInput
          id="login-password"
          name="password"
          label={loginDict?.password ?? AUTH_LABELS.PASSWORD}
          type="password"
          placeholder={AUTH_PLACEHOLDERS.PASSWORD}
          icon={<FaLock />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-200 shadow-lg ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading
            ? `${loginDict?.signingIn ?? AUTH_LABELS.SIGNING_IN}...`
            : (loginDict?.signIn ?? AUTH_LABELS.SIGN_IN)}
        </button>
      </form>
    </div>
  );
}
