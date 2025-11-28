'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { DictType } from '@/app/lib/types';
import { HERO_SECTION_CONSTANTS, SORT_CRITERIA } from '@/app/lib/constants';

interface SortOptionsProps {
  sortBy: string;
  onSort: (criteria: string) => void;
  dictionary: DictType;
}

interface SortButtonProps {
  criteria: string;
  label: string;
  isActive: boolean;
  onSort: (criteria: string) => void;
}

function SortButton({
  criteria,
  label,
  isActive,
  onSort,
}: SortButtonProps): React.ReactElement {
  // Select icon component based on sort direction (component, not boolean)
  const SortIconComponent: React.ComponentType<{ className?: string }> =
    criteria.includes('Desc') ? ArrowDown : ArrowUp;

  return (
    <button
      onClick={() => onSort(criteria)}
      className={`flex items-center px-3 py-1 text-sm rounded-full transition duration-150 ${
        isActive
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
      }`}
    >
      {label}
      <SortIconComponent
        className={`w-4 h-4 ml-1 ${!isActive && 'opacity-50'}`}
      />
    </button>
  );
}

export default function SortOptions({
  sortBy,
  onSort,
  dictionary,
}: SortOptionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-start space-x-3 mb-6 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
      <span className="text-sm font-semibold text-gray-700 mr-2">
        {dictionary.homepage?.sortBy || HERO_SECTION_CONSTANTS.SORT_BY}:
      </span>
      <SortButton
        criteria={SORT_CRITERIA.PRICE_ASC}
        label={
          dictionary.homepage?.priceLow || HERO_SECTION_CONSTANTS.PRICE_LOW
        }
        isActive={sortBy === SORT_CRITERIA.PRICE_ASC}
        onSort={onSort}
      />
      <SortButton
        criteria={SORT_CRITERIA.PRICE_DESC}
        label={
          dictionary.homepage?.priceHigh || HERO_SECTION_CONSTANTS.PRICE_HIGH
        }
        isActive={sortBy === SORT_CRITERIA.PRICE_DESC}
        onSort={onSort}
      />
      <SortButton
        criteria={SORT_CRITERIA.NAME_ASC}
        label={dictionary.homepage?.nameAZ || HERO_SECTION_CONSTANTS.NAME_AZ}
        isActive={sortBy === SORT_CRITERIA.NAME_ASC}
        onSort={onSort}
      />
    </div>
  );
}
