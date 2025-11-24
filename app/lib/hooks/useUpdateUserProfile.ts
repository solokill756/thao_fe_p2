import { updateUserProfileAction } from '@/app/actions/user/profile/updateUserProfileAction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateUserProfileVariables {
  fullName?: string;
  phoneNumber?: string | null;
  locale?: 'en' | 'vi';
}

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<
    {
      success: boolean;
      message?: string;
      error?: string;
      errors?: Record<string, string[]>;
    },
    Error,
    UpdateUserProfileVariables
  >({
    mutationFn: async (data) => {
      return await updateUserProfileAction(data, data.locale || 'en');
    },
  });
};
