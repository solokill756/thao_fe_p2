'use client';

import { DictType } from '@/app/lib/type/dictType';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface UserProfileProps {
  locale: string;
  dict: DictType;
}

const USER_NAME_CLASSES = 'text-sm font-medium text-gray-900';
const DEFAULT_USER_NAME = 'User';

export default function UserProfile({ locale, dict }: UserProfileProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dictProfile = dict.useProfile ?? {
    logout: 'Logout',
    logoutSuccess: 'Logout successful',
    role: 'Role',
  };
  const handleLogout = async () => {
    try {
      setIsOpen(false);
      // Invalidate session tokens and clear session data
      await signOut({
        redirect: false,
        callbackUrl: `/${locale}/auth`,
      });
      // Clear any client-side session data
      if (typeof window !== 'undefined') {
        // Clear NextAuth session cookies
        document.cookie.split(';').forEach((cookie) => {
          const eqPos = cookie.indexOf('=');
          const name =
            eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
          if (name.startsWith('next-auth')) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          }
        });
        // Clear localStorage/sessionStorage if used
        localStorage.removeItem('next-auth.session-token');
        sessionStorage.clear();
      }
      // Navigate to auth page and refresh to ensure clean state
      router.push(`/${locale}/auth`);
      router.refresh();
      toast.success(dictProfile.logoutSuccess ?? 'Logout successful');
    } catch (error) {
      console.error('Logout error:', {
        error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      toast.error('Logout failed');
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="relative">
      {/* User Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        <div className="flex flex-col items-end">
          <span className={USER_NAME_CLASSES}>
            {session.user.name || DEFAULT_USER_NAME}
          </span>
          <span className="text-xs text-gray-500">{session.user.email}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
          {session.user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className={USER_NAME_CLASSES}>
              {session.user.name || DEFAULT_USER_NAME}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session.user.email}
            </p>
          </div>

          <div className="px-4 py-2">
            {session.user.role && (
              <div className="mb-2">
                <p className="text-xs text-gray-600">{dictProfile.role}</p>
                <p className="text-sm font-medium text-blue-600 capitalize">
                  {session.user.role}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-200"
          >
            {dictProfile.logout}
          </button>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
