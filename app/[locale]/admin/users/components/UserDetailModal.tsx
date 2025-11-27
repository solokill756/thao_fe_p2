'use client';

import React from 'react';
import { X, Shield, Mail, Phone, MapPin, CheckCircle, Ban } from 'lucide-react';
import type { DictType } from '@/app/lib/types/dictType';
import type { UserWithStats } from '@/app/actions/admin/getUsersAction';
import { PLACEHOLDER_IMAGES } from '@/app/lib/constants';
import Image from 'next/image';

interface UserDetailModalProps {
  user: UserWithStats | null;
  isOpen: boolean;
  onClose: () => void;
  dictionary: DictType;
  locale: 'en' | 'vi';
}

export default function UserDetailModal({
  user,
  isOpen,
  onClose,
  dictionary,
  locale,
}: UserDetailModalProps) {
  if (!isOpen || !user) return null;

  const adminDict = dictionary.admin?.users || {};

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const localeString = locale === 'vi' ? 'vi-VN' : 'en-US';
    return dateObj.toLocaleDateString(localeString);
  };

  const daysActive = user.created_at
    ? Math.floor(
        (new Date().getTime() - new Date(user.created_at).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const isActive = user.role === 'admin' || user.role === 'user';

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-24 bg-blue-600">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 p-1 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-white overflow-hidden">
              <Image
                src={user.avatar_url || PLACEHOLDER_IMAGES.ADMIN_AVATAR}
                alt={user.full_name}
                className="w-full h-full object-cover"
                width={80}
                height={80}
              />
            </div>
          </div>
        </div>

        <div className="pt-12 px-6 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {user.full_name}
                {user.role === 'admin' && (
                  <Shield className="w-4 h-4 text-blue-600" />
                )}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />{' '}
                {user.phone_number || adminDict.unknownLocation || 'Unknown'}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {isActive
                ? adminDict.active || 'Active'
                : adminDict.blocked || 'Blocked'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3" /> {adminDict.email || 'Email'}
              </div>
              <div
                className="text-sm font-medium text-gray-800 truncate"
                title={user.email}
              >
                {user.email}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" /> {adminDict.phone || 'Phone'}
              </div>
              <div className="text-sm font-medium text-gray-800">
                {user.phone_number || adminDict.notAvailable || 'N/A'}
              </div>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-100 pt-4">
            <h4 className="text-sm font-bold text-gray-700 mb-3">
              {adminDict.activitySummary || 'Activity Summary'}
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-blue-600">
                  {user.bookingsCount}
                </div>
                <div className="text-xs text-gray-500">
                  {adminDict.bookings || 'Bookings'}
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-600">
                  ${user.totalSpent.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">
                  {adminDict.totalSpent || 'Total Spent'}
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-600">
                  {daysActive}
                </div>
                <div className="text-xs text-gray-500">
                  {adminDict.daysActive || 'Days Active'}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-1">
              {adminDict.joinDate || 'Join Date'}
            </div>
            <div className="text-sm font-medium text-gray-800">
              {formatDate(user.created_at)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
