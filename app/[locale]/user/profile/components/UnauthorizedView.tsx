'use client';

import Link from 'next/link';
import { USER_PROFILE_CONSTANTS } from '@/app/lib/constants';

interface UnauthorizedViewProps {
  locale: 'en' | 'vi';
}

export default function UnauthorizedView({ locale }: UnauthorizedViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          {USER_PROFILE_CONSTANTS.PLEASE_LOGIN}
        </p>
        <Link
          href={`/${locale}/auth`}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {USER_PROFILE_CONSTANTS.GO_TO_LOGIN}
        </Link>
      </div>
    </div>
  );
}
