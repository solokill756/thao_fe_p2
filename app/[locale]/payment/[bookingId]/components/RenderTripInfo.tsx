import type { DictType } from '@/app/lib/types/dictType';
import type { BookingWithRelations } from '@/app/lib/services/bookingService';
import { PAYMENT_CONSTANTS } from '@/app/lib/constants';

interface TripInfoProps {
  booking: BookingWithRelations;
  locale: 'en' | 'vi';
  dictionary: DictType;
  formatDate: (date: Date | string) => string;
}

export default function RenderTripInfo({
  booking,
  dictionary,
  formatDate,
}: TripInfoProps) {
  const paymentDict = dictionary.payment || {};
  const tour = booking.tour;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {paymentDict.yourTrip || PAYMENT_CONSTANTS.YOUR_TRIP || 'Your Trip'}
      </h3>
      <div className="flex justify-between items-center py-3 border-b border-gray-100">
        <span className="text-gray-600 font-medium">
          {paymentDict.dates || PAYMENT_CONSTANTS.DATES || 'Dates'}
        </span>
        <span className="text-gray-800 font-semibold">
          {tour.start_date
            ? formatDate(tour.start_date)
            : formatDate(booking.booking_date)}{' '}
          ({tour.duration_days}{' '}
          {tour.duration_days === 1
            ? paymentDict.day || 'day'
            : paymentDict.days || 'days'}
          )
        </span>
      </div>
      <div className="flex justify-between items-center py-3">
        <span className="text-gray-600 font-medium">
          {dictionary.useProfile?.guests ||
            PAYMENT_CONSTANTS.GUESTS ||
            'Guests'}
        </span>
        <span className="text-gray-800 font-semibold">
          {booking.num_guests}{' '}
          {booking.num_guests === 1
            ? paymentDict.guest || 'Guest'
            : paymentDict.guests || 'Guests'}
        </span>
      </div>
    </div>
  );
}
