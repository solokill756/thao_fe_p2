import { CreditCard } from 'lucide-react';
import type { DictType } from '@/app/lib/types/dictType';
import { PAYMENT_CONSTANTS } from '@/app/lib/constants';

interface CardPaymentFormProps {
  cardData: {
    cardNumber: string;
    expiration: string;
    cvc: string;
  };
  onCardDataChange: (data: {
    cardNumber: string;
    expiration: string;
    cvc: string;
  }) => void;
  dictionary: DictType;
}

export default function CardPaymentForm({
  cardData,
  onCardDataChange,
  dictionary,
}: CardPaymentFormProps) {
  const paymentDict = dictionary.payment || {};

  return (
    <div className="space-y-4 animate-fadeIn">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {paymentDict.cardNumber ||
            PAYMENT_CONSTANTS.CARD_NUMBER ||
            'Card Number'}
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="0000 0000 0000 0000"
            value={cardData.cardNumber}
            onChange={(e) =>
              onCardDataChange({
                ...cardData,
                cardNumber: e.target.value.replace(/\s/g, ''),
              })
            }
            maxLength={16}
            className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {paymentDict.expiration ||
              PAYMENT_CONSTANTS.EXPIRATION ||
              'Expiration'}
          </label>
          <input
            type="text"
            placeholder="MM/YY"
            value={cardData.expiration}
            onChange={(e) =>
              onCardDataChange({
                ...cardData,
                expiration: e.target.value,
              })
            }
            maxLength={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {paymentDict.cvc || PAYMENT_CONSTANTS.CVC || 'CVC'}
          </label>
          <input
            type="text"
            placeholder="123"
            value={cardData.cvc}
            onChange={(e) =>
              onCardDataChange({
                ...cardData,
                cvc: e.target.value.replace(/\D/g, ''),
              })
            }
            maxLength={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
}
