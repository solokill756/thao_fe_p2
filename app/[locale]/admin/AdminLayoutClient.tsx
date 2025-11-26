'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import type { DictType } from '@/app/lib/types/dictType';
import Sidebar from './components/Sidebar';
import { useNavigation } from './contexts/NavigationContext';
import AdminToursPageSkeleton from '@/app/components/sekeleton/AdminToursPageSkeleton';
import AdminBookingsPageSkeleton from '@/app/components/sekeleton/AdminBookingsPageSkeleton';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  locale: 'en' | 'vi';
  dictionary: DictType;
}

export default function AdminLayoutClient({
  children,
  locale,
  dictionary,
}: AdminLayoutClientProps) {
  const pathname = usePathname();
  const { isPending } = useNavigation();

  const getSkeleton = () => {
    if (pathname?.includes('/admin/tours')) {
      return <AdminToursPageSkeleton />;
    }
    if (pathname?.includes('/admin/bookings')) {
      return <AdminBookingsPageSkeleton />;
    }
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-inter flex">
      <Sidebar dictionary={dictionary} locale={locale} />
      <div className="flex-1 lg:ml-64">
        {isPending ? getSkeleton() : children}
      </div>
    </div>
  );
}
