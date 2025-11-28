'use client';

import { useSession } from 'next-auth/react';
import type { DictType } from '@/app/lib/types/dictType';
import type { DashboardStats } from '@/app/actions/admin/getDashboardStatsAction';
import { ERROR_MESSAGES, ADMIN_BOOKINGS_CONSTANTS } from '@/app/lib/constants';
import DashboardHeader from './components/DashboardHeader';
import StatsGrid from './components/StatsGrid';
import RecentBookingsTable from './components/RecentBookingsTable';

interface AdminDashboardClientProps {
  locale: 'en' | 'vi';
  dictionary: DictType;
  initialStats: DashboardStats;
}

export default function AdminDashboardClient({
  locale,
  dictionary,
  initialStats,
}: AdminDashboardClientProps) {
  const { data: session } = useSession();
  const sidebarDict = dictionary.admin?.sidebar || {};
  const dashboardDict = dictionary.admin?.dashboard || {};

  const isSessionValid = () => {
    if (!session) return false;
    return (
      session.user &&
      session.user.role === 'admin' &&
      new Date(session.expires) > new Date()
    );
  };

  if (!isSessionValid()) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-red-600">{ERROR_MESSAGES.UNAUTHORIZED}</div>
      </div>
    );
  }

  const headerTitle =
    dashboardDict.overview ||
    sidebarDict.dashboard ||
    ADMIN_BOOKINGS_CONSTANTS.DASHBOARD ||
    'Overview';

  return (
    <>
      <DashboardHeader title={headerTitle} session={session} />
      <main className="p-8">
        <StatsGrid stats={initialStats} dictionary={dictionary} />
        <RecentBookingsTable
          bookings={initialStats.recentBookings}
          locale={locale}
          dictionary={dictionary}
        />
      </main>
    </>
  );
}
