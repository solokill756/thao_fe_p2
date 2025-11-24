import { Lock } from 'lucide-react';
import type { DictType } from '@/app/lib/types/dictType';
import { PAYMENT_CONSTANTS } from '@/app/lib/constants';
import PaymentMethodSelector from './PaymentMethodSelector';

interface PaymentFormProps {
  paymentMethod: 'card' | 'internet_banking';
  onPaymentMethodChange: (method: 'card' | 'internet_banking') => void;
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
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isProcessing: boolean;
  total: number;
  locale: 'en' | 'vi';
  dictionary: DictType;
  formatCurrency: (amount: number) => string;
}

export default function PaymentForm({
  paymentMethod,
  onPaymentMethodChange,
  cardData,
  onCardDataChange,
  onSubmit,
  isProcessing,
  total,
  locale,
  dictionary,
  formatCurrency,
}: PaymentFormProps) {
  const paymentDict = dictionary.payment || {};

  return (
    <form onSubmit={onSubmit}>
      <PaymentMethodSelector
        paymentMethod={paymentMethod}
        onPaymentMethodChange={onPaymentMethodChange}
        cardData={cardData}
        onCardDataChange={onCardDataChange}
        dictionary={dictionary}
      />

      <div className="mt-8">
        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition duration-300 flex items-center justify-center space-x-2 ${
            isProcessing ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>
                {paymentDict.processing ||
                  PAYMENT_CONSTANTS.PROCESSING ||
                  'Processing...'}
              </span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>
                {paymentDict.confirmAndPay ||
                  PAYMENT_CONSTANTS.CONFIRM_AND_PAY ||
                  'Confirm and Pay'}{' '}
                {formatCurrency(total)}
              </span>
            </>
          )}
        </button>
        <p className="text-center text-gray-500 text-xs mt-3 flex items-center justify-center">
          <Lock className="w-3 h-3 mr-1" />{' '}
          {paymentDict.paymentsSecure ||
            PAYMENT_CONSTANTS.PAYMENTS_SECURE ||
            'Payments are secure and encrypted.'}
        </p>
      </div>
    </form>
  );
}
