'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut, Menu } from 'lucide-react';
import { DictType } from '@/app/lib/types/dictType';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';
import toast from 'react-hot-toast';
import {
  HEADER_AUTH_SECTION_CONSTANTS,
  AUTH_CONFIG,
} from '@/app/lib/constants';
import { useUserProfileStore } from '@/app/lib/stores/userProfileStore';
import { useEffect } from 'react';

interface HeaderAuthSectionProps {
  locale: 'en' | 'vi';
  dictionary: DictType;
}

export default function HeaderAuthSection({
  locale,
  dictionary,
}: HeaderAuthSectionProps) {
  const { push, isPending, refresh } = useNavigationLoading();
  const headerDict = dictionary.common?.header;
  const { data: session } = useSession();
  const {
    name: storeName,
    image: storeImage,
    email: storeEmail,
    clearUser,
    setUser,
  } = useUserProfileStore();
  const handleLogin = () => {
    push(`/${locale}/auth`);
  };

  useEffect(() => {
    if (session?.user) {
      setUser({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      });
    } else {
      clearUser();
    }
  }, [session?.user, setUser, clearUser]);

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
        callbackUrl: `/${locale}/`,
      });
      if (typeof window !== 'undefined') {
        document.cookie.split(';').forEach((cookie) => {
          const eqPos = cookie.indexOf('=');
          const name =
            eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
          if (name.startsWith('next-auth')) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          }
        });
        localStorage.removeItem(AUTH_CONFIG.SESSION_COOKIE_NAME);
        sessionStorage.clear();
      }
      clearUser();
      push(`/${locale}/`);
      refresh();
      toast.success(
        dictionary.useProfile?.logoutSuccess ||
          HEADER_AUTH_SECTION_CONSTANTS.LOGOUT_SUCCESS
      );
    } catch (error) {
      console.error('Logout error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      toast.error(
        headerDict?.logoutFailed || HEADER_AUTH_SECTION_CONSTANTS.LOGOUT_FAILED
      );
    }
  };

  const handleProfileRedirect = () => {
    push(`/${locale}/user/profile`);
  };

  return (
    <div className="flex items-center space-x-4">
      <button className="hidden sm:inline-flex bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300">
        {headerDict?.getInTouch || HEADER_AUTH_SECTION_CONSTANTS.GET_IN_TOUCH}
      </button>

      {storeName ? (
        <div className="flex items-center space-x-3">
          <div
            className="flex items-center space-x-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition"
            onClick={handleProfileRedirect}
          >
            {storeImage ? (
              <Image
                width={32}
                height={32}
                src={storeImage}
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold border-2 border-blue-500">
                {storeName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <span className="hidden md:inline-block text-sm font-semibold text-gray-800">
              {storeName}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:text-red-500 transition duration-150 rounded-full hover:bg-gray-100"
            title={headerDict?.logout || HEADER_AUTH_SECTION_CONSTANTS.LOGOUT}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          disabled={isPending}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isPending
            ? `${headerDict?.login || HEADER_AUTH_SECTION_CONSTANTS.LOGIN}...`
            : headerDict?.login || HEADER_AUTH_SECTION_CONSTANTS.LOGIN}
        </button>
      )}

      <button className="lg:hidden text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition">
        <Menu className="w-6 h-6" />
      </button>
    </div>
  );
}
