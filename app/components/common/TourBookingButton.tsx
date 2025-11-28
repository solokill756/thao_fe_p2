'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { DictType } from '@/app/lib/types/dictType';
import { TRENDING_PACKAGES_SECTION_CONSTANTS } from '@/app/lib/constants';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';

interface TourBookingButtonProps {
  tourId: number;
  startDate: Date | null;
  locale: string;
  dictionary: DictType;
}

export default function TourBookingButton({
  tourId,
  startDate,
  locale,
  dictionary,
}: TourBookingButtonProps) {
  const [isComingSoon, setIsComingSoon] = useState(false);
  const trendingPackagesDict = dictionary.trendingPackages;
  const { isPending, push } = useNavigationLoading();
  useEffect(() => {
    if (startDate) {
      setIsComingSoon(startDate > new Date());
    }
  }, [startDate]);

  if (isComingSoon) {
    return (
      <p className="text-gray-500 text-sm">
        {trendingPackagesDict?.comingSoon ||
          TRENDING_PACKAGES_SECTION_CONSTANTS.COMING_SOON}
      </p>
    );
  }

  return (
    <button
      onClick={() => push(`/${locale}/tours/${tourId}`)}
      className={`block w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200 text-center ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isPending
        ? `${trendingPackagesDict?.bookNow || TRENDING_PACKAGES_SECTION_CONSTANTS.BOOK_NOW}...`
        : trendingPackagesDict?.bookNow ||
          TRENDING_PACKAGES_SECTION_CONSTANTS.BOOK_NOW}
    </button>
  );
}
