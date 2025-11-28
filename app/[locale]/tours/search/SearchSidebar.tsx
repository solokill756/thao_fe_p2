'use client';

import { DollarSign, Sliders } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import {
  HERO_SECTION_CONSTANTS,
  SEARCH_TOURS_CONSTANTS,
  URL_SEARCH_PARAMS,
} from '@/app/lib/constants';
import { Category, DictType } from '@/app/lib/types';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';
import { useSearchFilterStore } from '@/app/lib/stores/searchFilterStore';

interface SearchSidebarProps {
  dictionary: DictType;
  categories: Category[];
}

export default function SearchSidebar({
  dictionary,
  categories,
}: SearchSidebarProps) {
  const { push } = useNavigationLoading();
  const searchParams = useSearchParams();

  const {
    minPrice,
    maxPrice,
    selectedCategories,
    setMinPrice,
    setMaxPrice,
    toggleCategory,
  } = useSearchFilterStore();

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    if (name === 'min') {
      setMinPrice(numValue);
    } else if (name === 'max') {
      setMaxPrice(numValue);
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    toggleCategory(categoryId);
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (minPrice > SEARCH_TOURS_CONSTANTS.MIN_PRICE) {
      params.set(URL_SEARCH_PARAMS.MIN_PRICE, minPrice.toString());
    } else {
      params.delete(URL_SEARCH_PARAMS.MIN_PRICE);
    }

    if (maxPrice < SEARCH_TOURS_CONSTANTS.MAX_PRICE) {
      params.set(URL_SEARCH_PARAMS.MAX_PRICE, maxPrice.toString());
    } else {
      params.delete(URL_SEARCH_PARAMS.MAX_PRICE);
    }

    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    } else {
      params.delete('categories');
    }

    params.set('page', '1');
    push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-8 sticky top-24 border border-gray-100">
      {/* Filter By Price */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="flex items-center text-xl font-bold text-gray-800 mb-4">
          <DollarSign className="w-5 h-5 mr-2 text-orange-500" />{' '}
          {dictionary.homepage?.filterByPrice ||
            HERO_SECTION_CONSTANTS.FILTER_BY_PRICE}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {dictionary.homepage?.price || HERO_SECTION_CONSTANTS.PRICE}: $
          {minPrice} - ${maxPrice}
        </p>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {dictionary.homepage?.minPrice || HERO_SECTION_CONSTANTS.MIN_PRICE}{' '}
            ($)
          </label>
          <input
            type="range"
            name="min"
            min={SEARCH_TOURS_CONSTANTS.MIN_PRICE}
            max={SEARCH_TOURS_CONSTANTS.MAX_PRICE}
            value={minPrice}
            onChange={handleRangeChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
          />
          <label className="block text-sm font-medium text-gray-700">
            {dictionary.homepage?.maxPrice || HERO_SECTION_CONSTANTS.MAX_PRICE}{' '}
            ($)
          </label>
          <input
            type="range"
            name="max"
            min={SEARCH_TOURS_CONSTANTS.MIN_PRICE}
            max={SEARCH_TOURS_CONSTANTS.MAX_PRICE}
            value={maxPrice}
            onChange={handleRangeChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
          />
        </div>
      </div>

      {/* Filter By Activities */}
      <div>
        <h3 className="flex items-center text-xl font-bold text-gray-800 mb-4">
          <Sliders className="w-5 h-5 mr-2 text-blue-500" />{' '}
          {dictionary.homepage?.filterByCategories ||
            HERO_SECTION_CONSTANTS.FILTER_BY_CATEGORIES}
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {categories.map((category) => (
            <label
              key={category.category_id}
              className="flex items-center text-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.category_id)}
                onChange={() => handleCategoryToggle(category.category_id)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={handleApplyFilters}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md"
      >
        {dictionary.homepage?.applyFilters ||
          HERO_SECTION_CONSTANTS.APPLY_FILTERS}
      </button>

      {/* Build Your Own Package Link */}
      <div className="pt-4 border-t border-gray-200 text-center">
        <button className="text-orange-500 hover:text-orange-600 font-semibold transition duration-200">
          {dictionary.homepage?.buildYourOwnPackage ||
            HERO_SECTION_CONSTANTS.BUILD_YOUR_OWN_PACKAGE}
        </button>
      </div>
    </div>
  );
}
