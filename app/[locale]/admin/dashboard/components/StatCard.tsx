import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ReactElement;
  color: string;
  vsLastMonthText: string;
}

export default function StatCard({
  title,
  value,
  trend,
  isPositive,
  icon,
  color,
  vsLastMonthText,
}: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {React.cloneElement(
            icon as React.ReactElement<{ className?: string }>,
            { className: 'w-6 h-6' }
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span
          className={`font-medium flex items-center ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4 mr-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 mr-1" />
          )}
          {trend}
        </span>
        <span className="text-slate-400 ml-2">{vsLastMonthText}</span>
      </div>
    </div>
  );
}
