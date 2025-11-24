'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import type { DictType } from '@/app/lib/types/dictType';
import { useUserBookings } from '@/app/lib/hooks/useUserBookings';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';
import ErrorRetry from '@/app/components/common/ErrorRetry';
import { USER_PROFILE_CONSTANTS } from '@/app/lib/constants';
import { useUserProfileStore } from '@/app/lib/stores/userProfileStore';
import UnauthorizedView from './UnauthorizedView';
import UserProfileSidebar from './UserProfileSidebar';
import ProfileSettingsSection from './ProfileSettingsSection';
import BookingsSection from './BookingsSection';
import Loading from '@/app/components/common/Loading';

interface UserProfileClientProps {
  locale: 'en' | 'vi';
  dictionary: DictType;
}

export default function UserProfileClient({
  locale,
  dictionary,
}: UserProfileClientProps) {
  const { data: session } = useSession();
  const { push, refresh } = useNavigationLoading();
  const [activeTab, setActiveTab] = useState<'bookings' | 'settings'>(
    'bookings'
  );
  const [filterStatus, setFilterStatus] = useState<
    'All' | 'pending' | 'confirmed' | 'cancelled'
  >('All');

  const profileDict = dictionary.useProfile || {};

  const {
    data: bookings = [],
    isLoading: loading,
    error,
    refetch,
  } = useUserBookings();

  const { clearUser, name, email, image } = useUserProfileStore();
  const sessionUser = session?.user;

  const handleLogout = async () => {
    try {
      clearUser();

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
        sessionStorage.clear();
      }
      push(`/${locale}/`);
      refresh();
      toast.success(
        profileDict.logoutSuccess || USER_PROFILE_CONSTANTS.LOGOUT_SUCCESS
      );
    } catch (error) {
      console.error('Logout error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        action: 'handleLogout',
      });
      toast.error(USER_PROFILE_CONSTANTS.LOGOUT_FAILED);
    }
  };

  if (!session?.user) {
    return <UnauthorizedView locale={locale} />;
  }

  const user = {
    name: name || sessionUser?.name,
    email: email || sessionUser?.email,
    image: image || sessionUser?.image,
  };

  if (loading) {
    <Loading
      size="lg"
      text={
        profileDict.loadingBookings || USER_PROFILE_CONSTANTS.LOADING_BOOKINGS
      }
      overlay={false}
    />;
  }

  if (error) {
    return (
      <ErrorRetry
        message={
          profileDict.failedToLoadBookings ||
          USER_PROFILE_CONSTANTS.FAILED_TO_LOAD_BOOKINGS
        }
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <UserProfileSidebar
            user={user}
            dictionary={dictionary}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
          />

          <div className="lg:col-span-3">
            {activeTab === 'bookings' ? (
              <BookingsSection
                bookings={bookings}
                dictionary={dictionary}
                locale={locale}
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
              />
            ) : (
              <ProfileSettingsSection
                dictionary={dictionary}
                locale={locale}
                user={user}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
