'use client';

import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import type { DictType } from '@/app/lib/types/dictType';
import { ADMIN_BOOKINGS_CONSTANTS } from '@/app/lib/constants';

interface AdminHeaderProps {
  dictionary: DictType;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  title?: string;
  searchPlaceholder?: string;
}

export default function AdminHeader({
  dictionary,
  searchTerm,
  onSearchChange,
  title,
  searchPlaceholder,
}: AdminHeaderProps) {
  const adminDict = dictionary.admin?.bookings || {};

  return (
    <header className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-20 px-8 py-4 flex justify-between items-center">
      <h2 className="text-xl font-bold text-slate-800">
        {title ||
          adminDict.bookingRequests ||
          ADMIN_BOOKINGS_CONSTANTS.BOOKING_REQUESTS}
      </h2>
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={
              searchPlaceholder ||
              adminDict.searchPlaceholder ||
              ADMIN_BOOKINGS_CONSTANTS.SEARCH_PLACEHOLDER
            }
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="lg:hidden p-2 text-slate-500">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
