'use client';

import Image from 'next/image';
import { User, Calendar, Settings, LogOut } from 'lucide-react';
import type { DictType } from '@/app/lib/types/dictType';
import { USER_PROFILE_CONSTANTS } from '@/app/lib/constants';
import { useUserProfileStore } from '@/app/lib/stores/userProfileStore';

interface UserProfileSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  dictionary: DictType;
  activeTab: 'bookings' | 'settings';
  onTabChange: (tab: 'bookings' | 'settings') => void;
  onLogout: () => void;
}

export default function UserProfileSidebar({
  user,
  dictionary,
  activeTab,
  onTabChange,
  onLogout,
}: UserProfileSidebarProps) {
  const profileDict = dictionary.useProfile || {};
  const { name: storeName, image: storeImage } = useUserProfileStore();

  const displayName = storeName || user.name;
  const userAvatar: string | undefined = storeImage || user.image || undefined;
  const memberSince = user.email
    ? new Date().getFullYear() - 2023
    : new Date().getFullYear();

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
        <div className="p-6 text-center border-b border-gray-100 bg-linear-to-b from-blue-50 to-white">
          <div className="relative w-24 h-24 mx-auto mb-4">
            {userAvatar !== undefined ? (
              <Image
                src={userAvatar}
                alt="Avatar"
                width={96}
                height={96}
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold border-2 border-blue-500">
                {displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 shadow-sm">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {displayName || USER_PROFILE_CONSTANTS.USER}
          </h2>
          <p className="text-gray-500 text-sm">
            {profileDict.memberSince || USER_PROFILE_CONSTANTS.MEMBER_SINCE}{' '}
            {memberSince}
          </p>
        </div>
        <nav className="p-4 space-y-1">
          <button
            onClick={() => onTabChange('bookings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'bookings'
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>
              {profileDict.myBookings || USER_PROFILE_CONSTANTS.MY_BOOKINGS}
            </span>
          </button>
          <button
            onClick={() => onTabChange('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              activeTab === 'settings'
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User className="w-5 h-5" />
            <span>
              {profileDict.profileSettings ||
                USER_PROFILE_CONSTANTS.PROFILE_SETTINGS}
            </span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition mt-4"
          >
            <LogOut className="w-5 h-5" />
            <span>{profileDict.logout || USER_PROFILE_CONSTANTS.LOGOUT}</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
