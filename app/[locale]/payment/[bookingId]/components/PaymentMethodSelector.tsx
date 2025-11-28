import { CreditCard, Building, CheckCircle } from 'lucide-react';
import type { DictType } from '@/app/lib/types/dictType';
import { PAYMENT_CONSTANTS } from '@/app/lib/constants';
import CardPaymentForm from './CardPaymentForm';
import BankingPaymentForm from './BankingPaymentForm';

interface PaymentMethodSelectorProps {
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
  dictionary: DictType;
}

export default function PaymentMethodSelector({
  paymentMethod,
  onPaymentMethodChange,
  cardData,
  onCardDataChange,
  dictionary,
}: PaymentMethodSelectorProps) {
  const paymentDict = dictionary.payment || {};

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        {paymentDict.payWith || PAYMENT_CONSTANTS.PAY_WITH || 'Pay with'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Option: Credit Card */}
        <div
          onClick={() => onPaymentMethodChange('card')}
          className={`cursor-pointer border-2 rounded-xl p-4 flex items-center space-x-3 transition ${
            paymentMethod === 'card'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <CreditCard
            className={`w-6 h-6 ${
              paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-500'
            }`}
          />
          <span
            className={`font-semibold ${
              paymentMethod === 'card' ? 'text-blue-900' : 'text-gray-700'
            }`}
          >
            {paymentDict.creditDebitCard ||
              PAYMENT_CONSTANTS.CREDIT_DEBIT_CARD ||
              'Credit/Debit Card'}
          </span>
          {paymentMethod === 'card' && (
            <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
          )}
        </div>

        {/* Option: Internet Banking */}
        <div
          onClick={() => onPaymentMethodChange('internet_banking')}
          className={`cursor-pointer border-2 rounded-xl p-4 flex items-center space-x-3 transition ${
            paymentMethod === 'internet_banking'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <Building
            className={`w-6 h-6 ${
              paymentMethod === 'internet_banking'
                ? 'text-blue-600'
                : 'text-gray-500'
            }`}
          />
          <span
            className={`font-semibold ${
              paymentMethod === 'internet_banking'
                ? 'text-blue-900'
                : 'text-gray-700'
            }`}
          >
            {paymentDict.internetBanking ||
              PAYMENT_CONSTANTS.INTERNET_BANKING ||
              'Internet Banking'}
          </span>
          {paymentMethod === 'internet_banking' && (
            <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
          )}
        </div>
      </div>

      {/* Form Inputs Area */}
      {paymentMethod === 'card' ? (
        <CardPaymentForm
          cardData={cardData}
          onCardDataChange={onCardDataChange}
          dictionary={dictionary}
        />
      ) : (
        <BankingPaymentForm dictionary={dictionary} />
      )}
    </div>
  );
}
