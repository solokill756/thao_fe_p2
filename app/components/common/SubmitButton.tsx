'use client';

import { useFormStatus } from 'react-dom';
import { DictType } from '../../lib/types/dictType';
import { HERO_SECTION_CONSTANTS } from '../../lib/constants';

interface SubmitButtonProps {
  dictionary: DictType;
}

export default function SubmitButton({ dictionary }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const homepageDict = dictionary.homepage;

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 px-6 rounded-xl shadow-md transition duration-300"
    >
      {pending
        ? homepageDict?.searching || HERO_SECTION_CONSTANTS.SEARCHING
        : homepageDict?.findTour || HERO_SECTION_CONSTANTS.FIND_TOUR}
    </button>
  );
}
