'use client';

import { useRouter } from 'next/navigation';
import type { BookingWithRelations } from '@/app/actions/admin/getBookingsAction';
import type { DictType } from '@/app/lib/types/dictType';

interface RecentBookingsTableProps {
  bookings: BookingWithRelations[];
  locale: 'en' | 'vi';
  dictionary: DictType;
}

export default function RecentBookingsTable({
  bookings,
  locale,
  dictionary,
}: RecentBookingsTableProps) {
  const router = useRouter();
  const bookingsDict = dictionary.admin?.bookings || {};
  const dashboardDict = dictionary.admin?.dashboard || {};

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date for recent bookings
  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60)
      return `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`;
    if (diffHours < 24)
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7)
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    return dateObj.toLocaleDateString();
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-bold text-slate-800">
          {dashboardDict.latestBookings || 'Latest Bookings'}
        </h3>
        <button
          onClick={() => router.push(`/${locale}/admin/bookings`)}
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          {dashboardDict.viewAllBookings || 'View All Bookings'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
              <th className="p-4 pl-6">
                {bookingsDict.bookingId || 'Booking ID'}
              </th>
              <th className="p-4">{bookingsDict.userInfo || 'Customer'}</th>
              <th className="p-4">
                {bookingsDict.tourDetails || 'Tour Package'}
              </th>
              <th className="p-4">Amount</th>
              <th className="p-4">{bookingsDict.status || 'Status'}</th>
              <th className="p-4 text-right pr-6">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  {dashboardDict.noRecentBookings || 'No recent bookings'}
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking.booking_id}
                  className="hover:bg-slate-50 transition cursor-pointer"
                  onClick={() => router.push(`/${locale}/admin/bookings`)}
                >
                  <td className="p-4 pl-6 text-sm font-medium text-blue-600">
                    #{booking.booking_id}
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-800">
                    {booking.user?.full_name ||
                      booking.guest_full_name ||
                      'Guest'}
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {booking.tour?.title || 'Unknown Tour'}
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-800">
                    {formatCurrency(booking.total_price)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-400 text-right pr-6">
                    {formatDate(booking.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
