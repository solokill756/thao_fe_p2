'use client';

import React from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  CalendarCheck,
  Users,
  MoreVertical,
  List,
} from 'lucide-react';
import type { BookingWithRelations } from '@/app/actions/admin/getBookingsAction';
import type { DictType } from '@/app/lib/types/dictType';
import {
  ADMIN_BOOKINGS_CONSTANTS,
  PLACEHOLDER_IMAGES,
} from '@/app/lib/constants';

interface BookingTableProps {
  bookings: BookingWithRelations[];
  dictionary: DictType;
  locale: 'en' | 'vi';
  formatDate: (date: Date | string) => string;
  formatPaymentStatus: (payment: BookingWithRelations['payment']) => string;
  getPaymentStatusColor: (payment: BookingWithRelations['payment']) => string;
  onStatusChange: (
    bookingId: number,
    status: 'pending' | 'confirmed' | 'cancelled'
  ) => void;
}

export default function BookingTable({
  bookings,
  dictionary,
  locale,
  formatDate,
  formatPaymentStatus,
  getPaymentStatusColor,
  onStatusChange,
}: BookingTableProps) {
  const adminDict = dictionary.admin?.bookings || {};

  if (bookings.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-b-xl overflow-hidden border border-slate-100">
        <div className="p-12 text-center text-slate-500">
          <div className="flex flex-col items-center justify-center">
            <List className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-lg font-medium">
              {adminDict.noBookingsFound ||
                ADMIN_BOOKINGS_CONSTANTS.NO_BOOKINGS_FOUND}
            </p>
            <p className="text-sm">
              {adminDict.tryAdjustingSearch ||
                ADMIN_BOOKINGS_CONSTANTS.TRY_ADJUSTING_SEARCH}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-b-xl overflow-hidden border border-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold tracking-wider">
              <th className="p-4 border-b border-slate-100">
                {adminDict.bookingId || ADMIN_BOOKINGS_CONSTANTS.BOOKING_ID}
              </th>
              <th className="p-4 border-b border-slate-100">
                {adminDict.userInfo || ADMIN_BOOKINGS_CONSTANTS.USER_INFO}
              </th>
              <th className="p-4 border-b border-slate-100">
                {adminDict.tourDetails || ADMIN_BOOKINGS_CONSTANTS.TOUR_DETAILS}
              </th>
              <th className="p-4 border-b border-slate-100">
                {adminDict.datesAndGuests ||
                  ADMIN_BOOKINGS_CONSTANTS.DATES_AND_GUESTS}
              </th>
              <th className="p-4 border-b border-slate-100">
                {adminDict.totalAndPayment ||
                  ADMIN_BOOKINGS_CONSTANTS.TOTAL_AND_PAYMENT}
              </th>
              <th className="p-4 border-b border-slate-100">
                {adminDict.status || ADMIN_BOOKINGS_CONSTANTS.STATUS}
              </th>
              <th className="p-4 border-b border-slate-100 text-right">
                {adminDict.actions || ADMIN_BOOKINGS_CONSTANTS.ACTIONS}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((booking) => (
              <BookingTableRow
                key={booking.booking_id}
                booking={booking}
                adminDict={adminDict}
                formatDate={formatDate}
                formatPaymentStatus={formatPaymentStatus}
                getPaymentStatusColor={getPaymentStatusColor}
                onStatusChange={onStatusChange}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
        <div>
          {(
            adminDict.showingEntries || ADMIN_BOOKINGS_CONSTANTS.SHOWING_ENTRIES
          )
            .replace('{from}', '1')
            .replace('{to}', bookings.length.toString())
            .replace('{total}', bookings.length.toString())}
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
            disabled
          >
            {adminDict.previous || ADMIN_BOOKINGS_CONSTANTS.PREVIOUS}
          </button>
          <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">
            {adminDict.next || ADMIN_BOOKINGS_CONSTANTS.NEXT}
          </button>
        </div>
      </div>
    </div>
  );
}

interface BookingTableRowProps {
  booking: BookingWithRelations;
  adminDict: Record<string, string | undefined>;
  formatDate: (date: Date | string) => string;
  formatPaymentStatus: (payment: BookingWithRelations['payment']) => string;
  getPaymentStatusColor: (payment: BookingWithRelations['payment']) => string;
  onStatusChange: (
    bookingId: number,
    status: 'pending' | 'confirmed' | 'cancelled'
  ) => void;
}

function BookingTableRow({
  booking,
  adminDict,
  formatDate,
  formatPaymentStatus,
  getPaymentStatusColor,
  onStatusChange,
}: BookingTableRowProps) {
  const statusLabel =
    booking.status === 'pending'
      ? adminDict.pending || ADMIN_BOOKINGS_CONSTANTS.PENDING
      : booking.status === 'confirmed'
        ? adminDict.confirmed || ADMIN_BOOKINGS_CONSTANTS.CONFIRMED
        : adminDict.cancelled || ADMIN_BOOKINGS_CONSTANTS.CANCELLED;

  return (
    <tr className="hover:bg-slate-50 transition duration-150">
      <td className="p-4 text-sm font-medium text-blue-600">
        BK-{booking.booking_id}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <img
            src={
              booking.user?.avatar_url ||
              `https://placehold.co/40x40/3b82f6/ffffff?text=${(booking.user
                ?.full_name ||
                booking.guest_full_name ||
                'U')[0].toUpperCase()}`
            }
            alt=""
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="text-sm font-medium text-slate-900">
              {booking.user?.full_name ||
                booking.guest_full_name ||
                adminDict.guest ||
                ADMIN_BOOKINGS_CONSTANTS.GUEST}
            </div>
            <div className="text-xs text-slate-500">
              {booking.user?.email ||
                booking.guest_email ||
                adminDict.notAvailable ||
                ADMIN_BOOKINGS_CONSTANTS.NOT_AVAILABLE}
            </div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <img
            src={booking.tour?.cover_image_url || PLACEHOLDER_IMAGES.TOUR}
            alt=""
            className="w-12 h-8 rounded object-cover"
          />
          <div
            className="text-sm text-slate-900 font-medium line-clamp-1 w-40"
            title={booking.tour?.title}
          >
            {booking.tour?.title ||
              adminDict.unknownTour ||
              ADMIN_BOOKINGS_CONSTANTS.UNKNOWN_TOUR}
          </div>
        </div>
      </td>
      <td className="p-4 text-sm text-slate-600">
        <div className="flex items-center gap-1">
          <CalendarCheck className="w-3 h-3" />{' '}
          {formatDate(booking.booking_date)}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Users className="w-3 h-3" /> {booking.num_guests}{' '}
          {booking.num_guests > 1
            ? adminDict.guests || ADMIN_BOOKINGS_CONSTANTS.GUESTS
            : adminDict.guest || ADMIN_BOOKINGS_CONSTANTS.GUEST}
        </div>
      </td>
      <td className="p-4">
        <div className="text-sm font-bold text-slate-900">
          ${booking.total_price.toLocaleString()}
        </div>
        <div
          className={`text-xs font-medium mt-1 ${getPaymentStatusColor(
            booking.payment
          )}`}
        >
          {formatPaymentStatus(booking.payment)}
        </div>
      </td>
      <td className="p-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            booking.status === 'confirmed'
              ? 'bg-green-100 text-green-800'
              : booking.status === 'cancelled'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {booking.status === 'confirmed' && (
            <CheckCircle className="w-3 h-3 mr-1" />
          )}
          {booking.status === 'cancelled' && (
            <XCircle className="w-3 h-3 mr-1" />
          )}
          {booking.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
          {statusLabel}
        </span>
      </td>
      <td className="p-4 text-right">
        {booking.status === 'pending' ? (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onStatusChange(booking.booking_id, 'confirmed')}
              className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 hover:text-green-700 transition"
              title={adminDict.approve || ADMIN_BOOKINGS_CONSTANTS.APPROVE}
            >
              <CheckCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => onStatusChange(booking.booking_id, 'cancelled')}
              className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 hover:text-red-700 transition"
              title={adminDict.reject || ADMIN_BOOKINGS_CONSTANTS.REJECT}
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button className="p-1.5 text-slate-400 hover:text-slate-600">
            <MoreVertical className="w-5 h-5" />
          </button>
        )}
      </td>
    </tr>
  );
}
