'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color: string;
  trend: string;
  vsLastMonth: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  color,
  trend,
  vsLastMonth,
}: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {React.cloneElement(
            icon as React.ReactElement<{ className?: string }>,
            { className: 'w-6 h-6 text-white' }
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className="text-green-500 font-medium flex items-center">
          <ArrowUpRight className="w-4 h-4 mr-1" /> {trend}
        </span>
        <span className="text-slate-400 ml-2">{vsLastMonth}</span>
      </div>
    </div>
  );
}

