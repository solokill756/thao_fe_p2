'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUsersAction,
  UserWithStats,
} from '@/app/actions/admin/getUsersAction';
import { updateUserStatusAction } from '@/app/actions/admin/updateUserStatusAction';
import { deleteUserAction } from '@/app/actions/admin/deleteUserAction';
import { Role } from '@prisma/client';
import toast from 'react-hot-toast';

export function useUsers(initialUsers: UserWithStats[]) {
  return useQuery({
    initialData: initialUsers,
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const result = await getUsersAction();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch users');
      }
      return result.users || [];
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: Role }) => {
      const result = await updateUserStatusAction(userId, role);
      return result;
    },

    onSuccess: (result) => {
      toast.success(result.message || 'User status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (error: Error, _variables) => {
      toast.error(error.message || 'Failed to update user status');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      const result = await deleteUserAction(userId);
      return result;
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || 'User deleted successfully');
      } else {
        toast.error(result.message || 'Failed to delete user');
      }
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (error: Error, _variables) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });
}
