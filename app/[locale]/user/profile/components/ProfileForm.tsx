'use client';

import { useState, useEffect } from 'react';
import type { DictType } from '@/app/lib/types/dictType';
import { USER_PROFILE_CONSTANTS } from '@/app/lib/constants';
import { useUpdateUserProfile } from '@/app/lib/hooks/useUpdateUserProfile';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useUserProfileStore } from '@/app/lib/stores/userProfileStore';

interface ProfileFormProps {
  dictionary: DictType;
  locale: 'en' | 'vi';
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function ProfileForm({
  dictionary,
  locale,
  user,
}: ProfileFormProps) {
  const profileDict = dictionary.useProfile || {};
  const updateUserProfileMutation = useUpdateUserProfile();
  const {
    updateName,
    updatePhoneNumber,
    name: storeName,
    phoneNumber: storePhoneNumber,
  } = useUserProfileStore();

  const [formData, setFormData] = useState({
    fullName: user.name || storeName || '',
    phoneNumber: storePhoneNumber || '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (storeName) {
      setFormData((prev) => ({
        ...prev,
        fullName: storeName,
      }));
    }
    if (storePhoneNumber !== null) {
      setFormData((prev) => ({
        ...prev,
        phoneNumber: storePhoneNumber || '',
      }));
    }
  }, [storeName, storePhoneNumber]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      const result = await updateUserProfileMutation.mutateAsync({
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim() || null,
        locale,
      });

      if (result.success) {
        toast.success(
          profileDict.profileUpdated || USER_PROFILE_CONSTANTS.PROFILE_UPDATED
        );
        updateName(formData.fullName.trim());
        updatePhoneNumber(formData.phoneNumber.trim() || null);
      } else {
        if (result.errors) {
          setFieldErrors(result.errors);
          const firstError = Object.values(result.errors)[0]?.[0];
          if (firstError) {
            toast.error(firstError);
          }
        } else {
          toast.error(
            result.error ||
              profileDict.profileUpdateFailed ||
              USER_PROFILE_CONSTANTS.PROFILE_UPDATE_FAILED
          );
        }
      }
    } catch (error) {
      toast.error(
        profileDict.profileUpdateFailed ||
          USER_PROFILE_CONSTANTS.PROFILE_UPDATE_FAILED
      );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        {profileDict.personalInformation ||
          USER_PROFILE_CONSTANTS.PERSONAL_INFORMATION}
      </h3>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {profileDict.fullName || USER_PROFILE_CONSTANTS.FULL_NAME}
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
              // Clear error when user types
              if (fieldErrors.fullName) {
                setFieldErrors({ ...fieldErrors, fullName: [] });
              }
            }}
            required
            minLength={2}
            maxLength={100}
            className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              fieldErrors.fullName
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300'
            }`}
          />
          {fieldErrors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.fullName[0]}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {profileDict.emailAddress || USER_PROFILE_CONSTANTS.EMAIL_ADDRESS}
          </label>
          <input
            type="email"
            value={user.email || ''}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">
            {profileDict.emailCannotBeChanged ||
              USER_PROFILE_CONSTANTS.EMAIL_CANNOT_BE_CHANGED}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {profileDict.phoneNumber || USER_PROFILE_CONSTANTS.PHONE_NUMBER}
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => {
              setFormData({ ...formData, phoneNumber: e.target.value });
              // Clear error when user types
              if (fieldErrors.phoneNumber) {
                setFieldErrors({ ...fieldErrors, phoneNumber: [] });
              }
            }}
            placeholder={USER_PROFILE_CONSTANTS.PHONE_PLACEHOLDER}
            maxLength={20}
            className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              fieldErrors.phoneNumber
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300'
            }`}
          />
          {fieldErrors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.phoneNumber[0]}
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={updateUserProfileMutation.isPending}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateUserProfileMutation.isPending
              ? profileDict.saving || USER_PROFILE_CONSTANTS.SAVING
              : profileDict.saveChanges || USER_PROFILE_CONSTANTS.SAVE_CHANGES}
          </button>
        </div>
      </form>
    </div>
  );
}
