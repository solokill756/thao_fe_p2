'use client';

import React from 'react';
import {
  Shield,
  Ban,
  CheckCircle,
  Trash2,
  Users as UsersIcon,
} from 'lucide-react';
import type { DictType } from '@/app/lib/types/dictType';
import type { UserWithStats } from '@/app/actions/admin/getUsersAction';
import { PLACEHOLDER_IMAGES } from '@/app/lib/constants';
import Image from 'next/image';
import { Role } from '@prisma/client';

interface UserTableProps {
  users: UserWithStats[];
  dictionary: DictType;
  locale: 'en' | 'vi';
  onView: (user: UserWithStats) => void;
  onToggleStatus: (userId: number, currentRole: Role) => void;
  onDelete: (userId: number) => void;
}

export default function UserTable({
  users,
  dictionary,
  locale,
  onView,
  onToggleStatus,
  onDelete,
}: UserTableProps) {
  const adminDict = dictionary.admin?.users || {};

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const localeString = locale === 'vi' ? 'vi-VN' : 'en-US';
    return dateObj.toLocaleDateString(localeString);
  };

  if (users.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl border border-slate-100 p-12 text-center text-slate-500">
        <UsersIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p>
          {adminDict.noUsersFound || 'No users found matching your search.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl border border-slate-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <th className="p-4 border-b">
              {adminDict.userProfile || 'User Profile'}
            </th>
            <th className="p-4 border-b">{adminDict.role || 'Role'}</th>
            <th className="p-4 border-b">{adminDict.status || 'Status'}</th>
            <th className="p-4 border-b">
              {adminDict.totalSpent || 'Total Spent'}
            </th>
            <th className="p-4 border-b">
              {adminDict.joinDate || 'Join Date'}
            </th>
            <th className="p-4 border-b text-right">
              {adminDict.actions || 'Actions'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => {
            const isActive = user.role === 'admin' || user.role === 'user';
            const newRole = user.role === 'admin' ? 'user' : 'admin';

            return (
              <tr
                key={user.user_id}
                className="hover:bg-slate-50 transition cursor-pointer"
                onClick={() => onView(user)}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-slate-100 overflow-hidden shrink-0">
                      <Image
                        loading="lazy"
                        src={user.avatar_url || PLACEHOLDER_IMAGES.ADMIN_AVATAR}
                        alt={user.full_name}
                        className="w-full h-full object-cover"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {user.full_name}
                      </div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {user.role === 'admin' ? (
                    <span className="inline-flex items-center px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                      <Shield className="w-3 h-3 mr-1" />{' '}
                      {adminDict.admin || 'Admin'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                      {adminDict.user || 'User'}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {isActive ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <Ban className="w-3 h-3 mr-1" />
                    )}
                    {isActive
                      ? adminDict.active || 'Active'
                      : adminDict.blocked || 'Blocked'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="font-bold text-slate-700">
                    ${user.totalSpent.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-400">
                    {user.bookingsCount}{' '}
                    {user.bookingsCount === 1
                      ? adminDict.booking || 'booking'
                      : adminDict.bookings || 'bookings'}
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-500">
                  {formatDate(user.created_at)}
                </td>
                <td
                  className="p-4 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onToggleStatus(user.user_id, newRole)}
                      className={`p-1.5 rounded transition ${
                        user.role === 'admin'
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                      title={
                        user.role === 'admin'
                          ? adminDict.removeAdmin || 'Remove Admin'
                          : adminDict.makeAdmin || 'Make Admin'
                      }
                    >
                      {user.role === 'admin' ? (
                        <Ban className="w-4 h-4" />
                      ) : (
                        <Shield className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onDelete(user.user_id)}
                      className="p-1.5 bg-slate-100 text-slate-500 rounded hover:bg-slate-200 transition hover:text-red-600"
                      title={adminDict.deleteUser || 'Delete User'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
