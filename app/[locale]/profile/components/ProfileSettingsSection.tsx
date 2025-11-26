'use client';

import type { DictType } from '@/app/lib/types/dictType';
import { USER_PROFILE_CONSTANTS } from '@/app/lib/constants';
import ProfileForm from './ProfileForm';

interface ProfileSettingsSectionProps {
  dictionary: DictType;
  locale: 'en' | 'vi';
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function ProfileSettingsSection({
  dictionary,
  locale,
  user,
}: ProfileSettingsSectionProps) {
  const profileDict = dictionary.useProfile || {};

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {profileDict.profileSettings || USER_PROFILE_CONSTANTS.PROFILE_SETTINGS}
      </h1>
      <ProfileForm dictionary={dictionary} locale={locale} user={user} />
    </div>
  );
}
