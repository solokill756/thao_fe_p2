'use client';

import type { DictType } from '@/app/lib/types/dictType';
import type { BookingWithRelations } from '@/app/actions/user/profile/getUserBookingsAction';
import { USER_PROFILE_CONSTANTS } from '@/app/lib/constants';
import BookingFilters from './BookingFilters';
import BookingsList from './BookingsList';

interface BookingsSectionProps {
  bookings: BookingWithRelations[];
  dictionary: DictType;
  locale: 'en' | 'vi';
  filterStatus: 'All' | 'pending' | 'confirmed' | 'cancelled';
  onFilterChange: (
    status: 'All' | 'pending' | 'confirmed' | 'cancelled'
  ) => void;
}

export default function BookingsSection({
  bookings,
  dictionary,
  locale,
  filterStatus,
  onFilterChange,
}: BookingsSectionProps) {
  const profileDict = dictionary.useProfile || {};

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === 'All') return true;
    return booking.status === filterStatus;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        {profileDict.myBookings || USER_PROFILE_CONSTANTS.MY_BOOKINGS}{' '}
        <span className="ml-3 text-sm font-normal text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
          {filteredBookings.length}{' '}
          {profileDict.items || USER_PROFILE_CONSTANTS.ITEMS}
        </span>
      </h1>

      <BookingFilters
        dictionary={dictionary}
        filterStatus={filterStatus}
        onFilterChange={onFilterChange}
      />

      <BookingsList
        bookings={filteredBookings}
        dictionary={dictionary}
        locale={locale}
      />
    </div>
  );
}
