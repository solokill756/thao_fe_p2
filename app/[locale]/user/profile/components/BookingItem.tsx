'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  User,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import type { DictType } from '@/app/lib/types/dictType';
import type { BookingWithRelations } from '@/app/actions/user/profile/getUserBookingsAction';
import {
  LOCALE_STRINGS,
  PAYMENT_CONSTANTS,
  USER_PROFILE_CONSTANTS,
  BOOKING_STATUS_COLORS,
  PLACEHOLDER_IMAGE_URLS,
  LOCALE_CODES,
} from '@/app/lib/constants';
import { useCancelBooking } from '@/app/lib/hooks/useCancelBooking';
import { toast } from 'react-hot-toast';

interface BookingItemProps {
  booking: BookingWithRelations;
  dictionary: DictType;
  locale: 'en' | 'vi';
}

export default function BookingItem({
  booking,
  dictionary,
  locale,
}: BookingItemProps) {
  const profileDict = dictionary.useProfile || {};
  const tourDict = dictionary.tourDetail || {};

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return BOOKING_STATUS_COLORS.CONFIRMED;
      case 'pending':
        return BOOKING_STATUS_COLORS.PENDING;
      case 'cancelled':
        return BOOKING_STATUS_COLORS.CANCELLED;
      default:
        return BOOKING_STATUS_COLORS.DEFAULT;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'pending':
        return <Clock className="w-4 h-4 mr-1" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return profileDict.confirmed || USER_PROFILE_CONSTANTS.CONFIRMED;
      case 'pending':
        return profileDict.pending || USER_PROFILE_CONSTANTS.PENDING;
      case 'cancelled':
        return profileDict.cancelled || USER_PROFILE_CONSTANTS.CANCELLED;
      default:
        return status;
    }
  };

  const formatDate = (date: Date | string) => {
    const hasDateObj = typeof date === 'string' ? new Date(date) : date;
    const localeString =
      locale === 'vi' ? LOCALE_STRINGS.VIETNAMESE : LOCALE_STRINGS.ENGLISH;
    return hasDateObj.toLocaleDateString(localeString);
  };

  const formatCurrency = (amount: number) => {
    const localeCode =
      locale === 'vi' ? LOCALE_CODES.VIETNAMESE : LOCALE_CODES.ENGLISH;
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const tourImage =
    booking.tour?.cover_image_url || PLACEHOLDER_IMAGE_URLS.TOUR;

  const cancelBookingMutation = useCancelBooking();

  const handleCancelBooking = async () => {
    try {
      const result = await cancelBookingMutation.mutateAsync({
        bookingId: booking.booking_id,
      });
      if (result.success) {
        toast.success(
          profileDict.bookingCancelled ||
            USER_PROFILE_CONSTANTS.BOOKING_CANCELLED
        );
      } else {
        toast.error(
          result.error ||
            profileDict.bookingCancellationFailed ||
            USER_PROFILE_CONSTANTS.BOOKING_CANCELLATION_FAILED
        );
      }
    } catch (error) {
      toast.error(
        profileDict.bookingCancellationFailed ||
          USER_PROFILE_CONSTANTS.BOOKING_CANCELLATION_FAILED
      );
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center gap-4">
      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
        <Image
          src={tourImage}
          alt={booking.tour?.title || USER_PROFILE_CONSTANTS.TOUR}
          width={80}
          height={80}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grow">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-gray-800 text-lg">
              {booking.tour?.title || USER_PROFILE_CONSTANTS.UNKNOWN_TOUR}
            </h4>
            <p className="text-sm text-gray-500">
              {profileDict.bookingId || USER_PROFILE_CONSTANTS.BOOKING_ID}:{' '}
              <span className="font-mono text-gray-700">
                B{booking.booking_id.toString().padStart(6, '0')}
              </span>
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center ${getStatusColor(booking.status)}`}
          >
            {getStatusIcon(booking.status)} {getStatusLabel(booking.status)}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />{' '}
            {tourDict.departureDate || USER_PROFILE_CONSTANTS.START}:{' '}
            {booking.tour?.start_date
              ? formatDate(booking.tour.start_date)
              : formatDate(booking.booking_date)}
          </div>
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 text-blue-500" /> {booking.num_guests}{' '}
            {booking.num_guests === 1
              ? profileDict.guest || USER_PROFILE_CONSTANTS.GUEST
              : profileDict.guests || USER_PROFILE_CONSTANTS.GUESTS}
          </div>
          <div className="flex items-center font-bold text-blue-600">
            <CreditCard className="w-4 h-4 mr-2" />{' '}
            {formatCurrency(booking.total_price)}
          </div>
        </div>
      </div>
      {booking.status === 'pending' || booking.status === 'confirmed' ? (
        <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
          {booking.status === 'confirmed' &&
          (!booking.payment || booking.payment.status !== 'completed') ? (
            <Link
              href={`/${locale}/payment/${booking.booking_id}`}
              className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition text-center"
            >
              {profileDict.payNow || USER_PROFILE_CONSTANTS.PAY_NOW}
            </Link>
          ) : null}
          {booking.status === 'pending' && (
            <button
              className="flex-1 md:flex-none px-4 py-2 border border-red-200 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCancelBooking}
              disabled={cancelBookingMutation.isPending}
            >
              {cancelBookingMutation.isPending
                ? profileDict.cancelling || USER_PROFILE_CONSTANTS.CANCELLING
                : profileDict.cancel || USER_PROFILE_CONSTANTS.CANCEL}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
