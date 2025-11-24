import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { DictType } from '@/app/lib/types/dictType';
import { PAYMENT_CONSTANTS } from '@/app/lib/constants';
import { useNavigationLoading } from '@/app/lib/hooks/useNavigationLoading';

interface PaymentHeaderProps {
  locale: 'en' | 'vi';
  dictionary: DictType;
}

export default function PaymentHeader({
  locale,
  dictionary,
}: PaymentHeaderProps) {
  const paymentDict = dictionary.payment || {};
  const { back } = useNavigationLoading();
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href={`/${locale}/user/profile`}
          className="flex items-center cursor-pointer text-gray-600 hover:text-blue-600 transition"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="font-medium">
            {paymentDict.back || PAYMENT_CONSTANTS.BACK || 'Back'}
          </span>
        </Link>
      </div>
    </header>
  );
}
