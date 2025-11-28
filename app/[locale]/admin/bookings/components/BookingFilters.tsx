'use client';

import React from 'react';
import { Filter, ArrowUpRight } from 'lucide-react';
import type { DictType } from '@/app/lib/types/dictType';
import { ADMIN_BOOKINGS_CONSTANTS } from '@/app/lib/constants';

interface BookingFiltersProps {
  dictionary: DictType;
  filterStatus: 'All' | 'pending' | 'confirmed' | 'cancelled';
  onFilterChange: (status: 'All' | 'pending' | 'confirmed' | 'cancelled') => void;
}

export default function BookingFilters({
  dictionary,
  filterStatus,
  onFilterChange,
}: BookingFiltersProps) {
  const adminDict = dictionary.admin?.bookings || {};

  const filterOptions = [
    {
      key: 'All' as const,
      label: adminDict.all || ADMIN_BOOKINGS_CONSTANTS.ALL,
    },
    {
      key: 'Pending' as const,
      label: adminDict.pending || ADMIN_BOOKINGS_CONSTANTS.PENDING,
    },
    {
      key: 'Confirmed' as const,
      label: adminDict.confirmed || ADMIN_BOOKINGS_CONSTANTS.CONFIRMED,
    },
    {
      key: 'Cancelled' as const,
      label: adminDict.cancelled || ADMIN_BOOKINGS_CONSTANTS.CANCELLED,
    },
  ];

  const handleStatusClick = (key: typeof filterOptions[number]['key']) => {
    const statusValue =
      key === 'All'
        ? 'All'
        : (key.toLowerCase() as 'pending' | 'confirmed' | 'cancelled');
    onFilterChange(statusValue);
  };

  return (
    <div className="bg-white rounded-t-xl p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto">
        {filterOptions.map(({ key, label }) => {
          const statusValue =
            key === 'All'
              ? 'All'
              : (key.toLowerCase() as 'pending' | 'confirmed' | 'cancelled');
          return (
            <button
              key={key}
              onClick={() => handleStatusClick(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                filterStatus === statusValue
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="flex items-center space-x-2">
        <button className="flex items-center px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
          <Filter className="w-4 h-4 mr-2" />{' '}
          {adminDict.filter || ADMIN_BOOKINGS_CONSTANTS.FILTER}
        </button>
        <button className="flex items-center px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
          <ArrowUpRight className="w-4 h-4 mr-2" />{' '}
          {adminDict.export || ADMIN_BOOKINGS_CONSTANTS.EXPORT}
        </button>
      </div>
    </div>
  );
}

