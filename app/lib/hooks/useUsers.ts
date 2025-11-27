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
      if (!result.success) {
        throw new Error(result.error || 'Failed to update user status');
      }
    },
    onMutate: async ({ userId, role }) => {
      await queryClient.cancelQueries({ queryKey: ['adminUsers'] });
      const previousUsers = queryClient.getQueryData<UserWithStats[]>([
        'adminUsers',
      ]);

      queryClient.setQueryData<UserWithStats[] | undefined>(
        ['adminUsers'],
        (old) =>
          old?.map((user) =>
            user.user_id === userId ? { ...user, role } : user
          )
      );

      return { previousUsers };
    },
    onSuccess: () => {
      toast.success('User status updated successfully');
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['adminUsers'], context.previousUsers);
      }
      toast.error(error.message || 'Failed to update user status');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      const result = await deleteUserAction(userId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete user');
      }
    },
    onMutate: async (userId: number) => {
      await queryClient.cancelQueries({ queryKey: ['adminUsers'] });
      const previousUsers = queryClient.getQueryData<UserWithStats[]>([
        'adminUsers',
      ]);

      queryClient.setQueryData<UserWithStats[] | undefined>(
        ['adminUsers'],
        (old) => old?.filter((user) => user.user_id !== userId)
      );

      return { previousUsers };
    },
    onSuccess: () => {
      toast.success('User deleted successfully');
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['adminUsers'], context.previousUsers);
      }
      toast.error(error.message || 'Failed to delete user');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
}
