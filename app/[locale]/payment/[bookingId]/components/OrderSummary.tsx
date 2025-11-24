import Image from 'next/image';
import { AlertCircle } from 'lucide-react';
import type { DictType } from '@/app/lib/types/dictType';
import type { BookingWithRelations } from '@/app/lib/services/bookingService';
import { PAYMENT_CONSTANTS, PLACEHOLDER_IMAGE_URLS } from '@/app/lib/constants';

interface OrderSummaryProps {
  booking: BookingWithRelations;
  subtotal: number;
  taxes: number;
  total: number;
  locale: 'en' | 'vi';
  dictionary: DictType;
  formatCurrency: (amount: number) => string;
}

export default function OrderSummary({
  booking,
  subtotal,
  taxes,
  total,
  locale,
  dictionary,
  formatCurrency,
}: OrderSummaryProps) {
  const paymentDict = dictionary.payment || {};
  const tour = booking.tour;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
      <div className="flex items-start space-x-4 mb-6">
        <Image
          src={tour.cover_image_url || PLACEHOLDER_IMAGE_URLS.TOUR}
          alt={tour.title}
          width={96}
          height={96}
          className="w-24 h-24 rounded-lg object-cover shrink-0"
        />
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold mb-1">
            {paymentDict.tourPackage ||
              PAYMENT_CONSTANTS.TOUR_PACKAGE ||
              'Tour Package'}
          </p>
          <h4 className="font-bold text-gray-800 leading-tight">
            {tour.title}
          </h4>
        </div>
      </div>

      <div className="border-t border-gray-100 py-4 space-y-3">
        <h4 className="font-bold text-gray-800">
          {paymentDict.priceDetails ||
            PAYMENT_CONSTANTS.PRICE_DETAILS ||
            'Price Details'}
        </h4>
        <div className="flex justify-between text-gray-600">
          <span>
            {formatCurrency(Number(tour.price_per_person || 0))} x{' '}
            {booking.num_guests}{' '}
            {booking.num_guests === 1
              ? paymentDict.guest || 'Guest'
              : paymentDict.guests || 'Guests'}
          </span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>
            {paymentDict.taxesFees ||
              PAYMENT_CONSTANTS.TAXES_FEES ||
              'Taxes & Fees'}
          </span>
          <span>{formatCurrency(taxes)}</span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 mt-2">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-gray-800">
            {paymentDict.total || PAYMENT_CONSTANTS.TOTAL || 'Total'} (USD)
          </span>
          <span className="font-extrabold text-2xl text-blue-600">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 p-3 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong>
            {paymentDict.freeCancellation ||
              PAYMENT_CONSTANTS.FREE_CANCELLATION ||
              'Free Cancellation'}
          </strong>{' '}
          {paymentDict.freeCancellationDesc ||
            PAYMENT_CONSTANTS.FREE_CANCELLATION_DESC ||
            'up to 48 hours before the trip. Book now to secure your spot!'}
        </p>
      </div>
    </div>
  );
}
