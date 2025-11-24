import type { DictType } from '@/app/lib/types/dictType';
import { PAYMENT_CONSTANTS, PLACEHOLDER_IMAGE_URLS } from '@/app/lib/constants';

interface BankingPaymentFormProps {
  dictionary: DictType;
}

export default function BankingPaymentForm({
  dictionary,
}: BankingPaymentFormProps) {
  const paymentDict = dictionary.payment || {};

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fadeIn text-center">
      <p className="text-gray-700 font-medium mb-4">
        {paymentDict.scanQRCode ||
          PAYMENT_CONSTANTS.SCAN_QR_CODE ||
          'Scan QR Code to Pay via Banking App'}
      </p>
      <div className="w-48 h-48 bg-white mx-auto mb-4 border p-2 rounded flex items-center justify-center">
        <img src={PLACEHOLDER_IMAGE_URLS.QR_CODE} alt="QR Code" />
      </div>
      <p className="text-sm text-gray-500">
        {paymentDict.supportedBanks ||
          PAYMENT_CONSTANTS.SUPPORTED_BANKS ||
          'Supported Banks: Vietcombank, Techcombank, ACB...'}
      </p>
    </div>
  );
}
