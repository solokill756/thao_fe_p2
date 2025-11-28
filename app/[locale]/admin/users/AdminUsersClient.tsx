'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import type { DictType } from '@/app/lib/types/dictType';
import {
  useUsers,
  useUpdateUserStatus,
  useDeleteUser,
} from '@/app/lib/hooks/useUsers';
import AdminHeader from '../bookings/components/AdminHeader';
import UserTable from './components/UserTable';
import UserDetailModal from './components/UserDetailModal';
import ErrorRetry from '@/app/components/common/ErrorRetry';
import { Shield, Users } from 'lucide-react';
import { UserWithStats } from '@/app/actions/admin/getUsersAction';
import { Role } from '@prisma/client';

interface AdminUsersClientProps {
  locale: 'en' | 'vi';
  dictionary: DictType;
  initialUsers: UserWithStats[];
}

export default function AdminUsersClient({
  locale,
  dictionary,
  initialUsers,
}: AdminUsersClientProps) {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'All' | 'admin' | 'user'>('All');
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: users = [],
    isLoading: loading,
    error,
    refetch,
  } = useUsers(initialUsers);

  const updateUserStatusMutation = useUpdateUserStatus();
  const deleteUserMutation = useDeleteUser();

  const handleViewUser = (user: UserWithStats) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (userId: number, newRole: Role) => {
    await updateUserStatusMutation.mutateAsync({ userId, role: newRole });
  };

  const handleDeleteUser = async (userId: number) => {
    const adminDict = dictionary.admin?.users || {};
    if (
      window.confirm(
        adminDict.confirmDelete ||
          'Delete this user? This will remove all their data.'
      )
    ) {
      await deleteUserMutation.mutateAsync(userId);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const adminDict = dictionary.admin?.users || {};

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">
          {adminDict.loadingUsers || 'Loading users...'}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorRetry
        message={adminDict.failedToLoadUsers || 'Failed to load users'}
        onRetry={refetch}
      />
    );
  }

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const userCount = users.filter((u) => u.role === 'user').length;

  return (
    <>
      <AdminHeader
        dictionary={dictionary}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        title={adminDict.userManagement || 'User Management'}
        searchPlaceholder={adminDict.searchUsers || 'Search users...'}
      />
      <main className="p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilterRole('All')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterRole === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {adminDict.allUsers || 'All Users'} ({users.length})
            </button>
            <button
              onClick={() => setFilterRole('user')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterRole === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {adminDict.customers || 'Customers'} ({userCount})
            </button>
            <button
              onClick={() => setFilterRole('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterRole === 'admin'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {adminDict.admins || 'Admins'} ({adminCount})
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Shield className="w-4 h-4" />
            <span>
              {adminCount} {adminDict.admins || 'Admins'}
            </span>
            <span className="mx-1">•</span>
            <Users className="w-4 h-4" />
            <span>
              {userCount} {adminDict.customers || 'Customers'}
            </span>
          </div>
        </div>

        <UserTable
          users={filteredUsers}
          dictionary={dictionary}
          locale={locale}
          onView={handleViewUser}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteUser}
        />
      </main>
      <UserDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        dictionary={dictionary}
        locale={locale}
      />
    </>
  );
}
