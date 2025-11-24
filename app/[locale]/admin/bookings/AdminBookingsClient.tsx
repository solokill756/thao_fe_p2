'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import type { DictType } from '@/app/lib/types/dictType';
import type { BookingWithRelations } from '@/app/actions/admin/getBookingsAction';
import {
  ADMIN_BOOKINGS_CONSTANTS,
  ERROR_MESSAGES,
  LOCALE_STRINGS,
} from '@/app/lib/constants';
import { useBookings } from '@/app/lib/hooks/useBookings';
import { useUpdateBookingStatus } from '@/app/lib/hooks/useUpdateBookingStatus';
import AdminHeader from './components/AdminHeader';
import StatsOverview from './components/StatsOverview';
import BookingFilters from './components/BookingFilters';
import BookingTable from './components/BookingTable';
import ErrorRetry from '@/app/components/common/ErrorRetry';
import { toast } from 'react-hot-toast';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';

interface AdminBookingsClientProps {
  locale: 'en' | 'vi';
  dictionary: DictType;
}

export default function AdminBookingsClient({
  locale,
  dictionary,
}: AdminBookingsClientProps) {
  const { data: session } = useSession();
  const { push } = useNavigationLoading();

  const isSessionValid = () => {
    if (!session) return false;

    return (
      session.user &&
      session.user.role === 'admin' &&
      new Date(session.expires) > new Date()
    );
  };

  const [filterStatus, setFilterStatus] = useState<
    'All' | 'pending' | 'confirmed' | 'cancelled'
  >('All');
  const [searchTerm, setSearchTerm] = useState('');

  const adminDict = dictionary.admin?.bookings || {};
  const {
    data: bookings = [],
    isLoading: loading,
    error,
    refetch,
  } = useBookings();

  const updateBookingStatusMutation = useUpdateBookingStatus();

  if (!isSessionValid()) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-red-600">{ERROR_MESSAGES.UNAUTHORIZED}</div>
      </div>
    );
  }

  const handleStatusChange = async (
    bookingId: number,
    newStatus: 'pending' | 'confirmed' | 'cancelled'
  ) => {
    if (!isSessionValid()) {
      toast.error(ERROR_MESSAGES.UNAUTHORIZED);
      return;
    }

    try {
      const result = await updateBookingStatusMutation.mutateAsync({
        bookingId,
        newStatus,
      });

      if (result.success) {
        const statusLabel =
          newStatus === 'pending'
            ? adminDict.pending || ADMIN_BOOKINGS_CONSTANTS.PENDING
            : newStatus === 'confirmed'
              ? adminDict.confirmed || ADMIN_BOOKINGS_CONSTANTS.CONFIRMED
              : adminDict.cancelled || ADMIN_BOOKINGS_CONSTANTS.CANCELLED;
        const message =
          result.message ||
          (
            adminDict.bookingHasBeen ||
            ADMIN_BOOKINGS_CONSTANTS.BOOKING_HAS_BEEN
          )
            .replace('{id}', bookingId.toString())
            .replace('{status}', statusLabel.toLowerCase());
        toast.success(message);
      } else {
        toast.error(
          result.error ||
            adminDict.failedToUpdate ||
            ADMIN_BOOKINGS_CONSTANTS.FAILED_TO_UPDATE
        );
      }
    } catch (error) {
      toast.error(
        adminDict.failedToUpdate || ADMIN_BOOKINGS_CONSTANTS.FAILED_TO_UPDATE
      );
    }
  };

  // Filter & Search
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      filterStatus === 'All' || booking.status === filterStatus;
    // Access user data from booking relation
    const bookingUser = booking.user;
    const bookingUserName = bookingUser?.full_name || '';
    const bookingUserEmail = bookingUser?.email || '';
    const tourName = booking.tour?.title || '';
    const bookingId = booking.booking_id.toString();

    const matchesSearch =
      bookingUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookingUserEmail.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Calculate Stats
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter(
    (b) => b.status === 'confirmed'
  ).length;
  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.total_price, 0);

  // Format functions
  const formatDate = (date: Date | string) => {
    const hasDateInstance: Date =
      typeof date === 'string' ? new Date(date) : date;
    const localeString =
      locale === 'vi' ? LOCALE_STRINGS.VIETNAMESE : LOCALE_STRINGS.ENGLISH;
    return hasDateInstance.toLocaleDateString(localeString);
  };

  const formatPaymentStatus = (
    payment: BookingWithRelations['payment']
  ): string => {
    if (!payment) return adminDict.unpaid || ADMIN_BOOKINGS_CONSTANTS.UNPAID;

    if (payment.status === 'completed') {
      const method =
        payment.payment_method === 'internet_banking'
          ? adminDict.banking || ADMIN_BOOKINGS_CONSTANTS.BANKING
          : adminDict.creditCard || ADMIN_BOOKINGS_CONSTANTS.CREDIT_CARD;

      return `${adminDict.paid || ADMIN_BOOKINGS_CONSTANTS.PAID} (${method})`;
    }

    if (payment.status === 'failed')
      return adminDict.failed || ADMIN_BOOKINGS_CONSTANTS.FAILED;

    return adminDict.pending || ADMIN_BOOKINGS_CONSTANTS.PENDING;
  };

  const getPaymentStatusColor = (
    payment: BookingWithRelations['payment']
  ): string => {
    if (!payment || payment.status === 'pending') return 'text-red-500';
    if (payment.status === 'completed') return 'text-green-600';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">
          {adminDict.loadingBookings ||
            ADMIN_BOOKINGS_CONSTANTS.LOADING_BOOKINGS}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorRetry
        message={
          adminDict.failedToLoadBookings ||
          ADMIN_BOOKINGS_CONSTANTS.FAILED_TO_LOAD_BOOKINGS
        }
        onRetry={refetch}
      />
    );
  }

  return (
    <>
      <AdminHeader
        dictionary={dictionary}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="p-8">
        <StatsOverview
          dictionary={dictionary}
          pendingCount={pendingCount}
          confirmedCount={confirmedCount}
          totalRevenue={totalRevenue}
        />

        <BookingFilters
          dictionary={dictionary}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />

        <BookingTable
          bookings={filteredBookings}
          dictionary={dictionary}
          locale={locale}
          formatDate={formatDate}
          formatPaymentStatus={formatPaymentStatus}
          getPaymentStatusColor={getPaymentStatusColor}
          onStatusChange={handleStatusChange}
        />
      </main>
    </>
  );
}
