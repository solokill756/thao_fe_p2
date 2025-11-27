import React from 'react';
import { Users, Map, DollarSign, ShoppingBag } from 'lucide-react';
import type { DashboardStats } from '@/app/actions/admin/getDashboardStatsAction';
import type { DictType } from '@/app/lib/types/dictType';
import StatCard from './StatCard';

interface StatsGridProps {
  stats: DashboardStats;
  dictionary: DictType;
}

export default function StatsGrid({ stats, dictionary }: StatsGridProps) {
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

  // Format number with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Format percentage
  const formatPercentage = (num: number) => {
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(1)}%`;
  };

  const statsData = [
    {
      title: bookingsDict.totalRevenue || 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      trend: formatPercentage(stats.revenueChange),
      isPositive: stats.revenueChange >= 0,
      icon: <DollarSign />,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: dashboardDict.totalBookings || 'Total Bookings',
      value: formatNumber(stats.totalBookings),
      trend: formatPercentage(stats.bookingsChange),
      isPositive: stats.bookingsChange >= 0,
      icon: <ShoppingBag />,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: dashboardDict.activeUsers || 'Active Users',
      value: formatNumber(stats.activeUsers),
      trend: formatPercentage(stats.usersChange),
      isPositive: stats.usersChange >= 0,
      icon: <Users />,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: dashboardDict.activeTours || 'Active Tours',
      value: formatNumber(stats.activeTours),
      trend: '+2 New',
      isPositive: true,
      icon: <Map />,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const vsLastMonthText =
    dashboardDict.vsLastMonth || bookingsDict.vsLastMonth || 'vs last month';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} vsLastMonthText={vsLastMonthText} />
      ))}
    </div>
  );
}
