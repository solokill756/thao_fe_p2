'use client';

import type { DictType } from '@/app/lib/types/dictType';
import { USER_PROFILE_CONSTANTS } from '@/app/lib/constants';

interface BookingFiltersProps {
  dictionary: DictType;
  filterStatus: 'All' | 'pending' | 'confirmed' | 'cancelled';
  onFilterChange: (
    status: 'All' | 'pending' | 'confirmed' | 'cancelled'
  ) => void;
}

export default function BookingFilters({
  dictionary,
  filterStatus,
  onFilterChange,
}: BookingFiltersProps) {
  const profileDict = dictionary.useProfile || {};

  return (
    <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
      {['All', 'pending', 'confirmed', 'cancelled'].map((status) => (
        <button
          key={status}
          onClick={() =>
            onFilterChange(
              status as 'All' | 'pending' | 'confirmed' | 'cancelled'
            )
          }
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition ${
            filterStatus === status
              ? 'bg-blue-50 border-blue-500 text-blue-600'
              : 'bg-white border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600'
          }`}
        >
          {status === 'All'
            ? profileDict.all || USER_PROFILE_CONSTANTS.ALL
            : status === 'pending'
              ? profileDict.pending || USER_PROFILE_CONSTANTS.PENDING
              : status === 'confirmed'
                ? profileDict.confirmed || USER_PROFILE_CONSTANTS.CONFIRMED
                : profileDict.cancelled || USER_PROFILE_CONSTANTS.CANCELLED}
        </button>
      ))}
    </div>
  );
}
