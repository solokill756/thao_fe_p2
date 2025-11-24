import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import type { DictType } from '@/app/lib/types/dictType';
import { PAYMENT_CONSTANTS } from '@/app/lib/constants';

interface PaymentSuccessProps {
  locale: 'en' | 'vi';
  dictionary: DictType;
}

export default function PaymentSuccess({
  locale,
  dictionary,
}: PaymentSuccessProps) {
  const router = useRouter();
  const paymentDict = dictionary.payment || {};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {paymentDict.paymentSuccessful ||
            PAYMENT_CONSTANTS.PAYMENT_SUCCESSFUL ||
            'Payment Successful!'}
        </h2>
        <p className="text-gray-600 mb-8">
          {paymentDict.paymentSuccessMessage ||
            PAYMENT_CONSTANTS.PAYMENT_SUCCESS_MESSAGE ||
            'Thank you for your booking. Your tour has been confirmed.'}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push(`/${locale}/user/profile`)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md"
          >
            {paymentDict.goToMyBookings ||
              PAYMENT_CONSTANTS.GO_TO_MY_BOOKINGS ||
              'Go to My Bookings'}
          </button>
          <button
            onClick={() => router.push(`/${locale}/`)}
            className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition"
          >
            {paymentDict.backToHome ||
              PAYMENT_CONSTANTS.BACK_TO_HOME ||
              'Back to Home'}
          </button>
        </div>
      </div>
    </div>
  );
}
