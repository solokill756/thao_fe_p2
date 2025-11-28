'use client';

import React from 'react';
import { Clock, CheckCircle, DollarSign } from 'lucide-react';
import type { DictType } from '@/app/lib/types/dictType';
import { ADMIN_BOOKINGS_CONSTANTS } from '@/app/lib/constants';
import StatsCard from './StatsCard';

interface StatsOverviewProps {
  dictionary: DictType;
  pendingCount: number;
  confirmedCount: number;
  totalRevenue: number;
}

export default function StatsOverview({
  dictionary,
  pendingCount,
  confirmedCount,
  totalRevenue,
}: StatsOverviewProps) {
  const adminDict = dictionary.admin?.bookings || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        title={
          adminDict.pendingRequests ||
          ADMIN_BOOKINGS_CONSTANTS.PENDING_REQUESTS
        }
        value={pendingCount}
        icon={<Clock />}
        color="bg-orange-500"
        trend="+12%"
        vsLastMonth={
          adminDict.vsLastMonth || ADMIN_BOOKINGS_CONSTANTS.VS_LAST_MONTH
        }
      />
      <StatsCard
        title={
          adminDict.confirmedBookings ||
          ADMIN_BOOKINGS_CONSTANTS.CONFIRMED_BOOKINGS
        }
        value={confirmedCount}
        icon={<CheckCircle />}
        color="bg-blue-500"
        trend="+5%"
        vsLastMonth={
          adminDict.vsLastMonth || ADMIN_BOOKINGS_CONSTANTS.VS_LAST_MONTH
        }
      />
      <StatsCard
        title={
          adminDict.totalRevenue || ADMIN_BOOKINGS_CONSTANTS.TOTAL_REVENUE
        }
        value={`$${totalRevenue.toLocaleString()}`}
        icon={<DollarSign />}
        color="bg-green-500"
        trend="+8.5%"
        vsLastMonth={
          adminDict.vsLastMonth || ADMIN_BOOKINGS_CONSTANTS.VS_LAST_MONTH
        }
      />
    </div>
  );
}

