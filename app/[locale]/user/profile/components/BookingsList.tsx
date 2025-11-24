'use client';

import type { DictType } from '@/app/lib/types/dictType';
import type { BookingWithRelations } from '@/app/actions/user/profile/getUserBookingsAction';
import { USER_PROFILE_CONSTANTS } from '@/app/lib/constants';
import BookingItem from './BookingItem';

interface BookingsListProps {
  bookings: BookingWithRelations[];
  dictionary: DictType;
  locale: 'en' | 'vi';
}

export default function BookingsList({
  bookings,
  dictionary,
  locale,
}: BookingsListProps) {
  const profileDict = dictionary.useProfile || {};

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
        <p className="text-gray-500 text-lg">
          {profileDict.noBookings || USER_PROFILE_CONSTANTS.NO_BOOKINGS}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingItem
          key={booking.booking_id}
          booking={booking}
          dictionary={dictionary}
          locale={locale}
        />
      ))}
    </div>
  );
}
