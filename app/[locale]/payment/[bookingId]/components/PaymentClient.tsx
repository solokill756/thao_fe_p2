/* eslint-disable sonarjs/no-duplicate-string */
'use client';

import React, { useState } from 'react';
import type { DictType } from '@/app/lib/types/dictType';
import { useBookingForPayment } from '@/app/lib/hooks/useBookingForPayment';
import { useProcessPayment } from '@/app/lib/hooks/useProcessPayment';
import { PAYMENT_CONSTANTS, LOCALE_CODES } from '@/app/lib/constants';
import { toast } from 'react-hot-toast';
import PaymentHeader from './PaymentHeader';
import PaymentSuccess from './PaymentSuccess';
import RenderTripInfo from './RenderTripInfo';
import PaymentForm from './PaymentForm';
import OrderSummary from './OrderSummary';
import PaymentSkeleton from './PaymentSkeleton';
import ErrorRetry from '@/app/components/common/ErrorRetry';

interface PaymentClientProps {
  locale: 'en' | 'vi';
  bookingId: number;
  dictionary: DictType;
}

export default function PaymentClient({
  locale,
  bookingId,
  dictionary,
}: PaymentClientProps) {
  const paymentDict = dictionary.payment || {};
  const [paymentMethod, setPaymentMethod] = useState<
    'card' | 'internet_banking'
  >('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiration: '',
    cvc: '',
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const {
    data: bookingResult,
    isLoading: loadingBooking,
    error: bookingError,
    refetch: refetchBooking,
  } = useBookingForPayment(bookingId);

  const processPaymentMutation = useProcessPayment();

  const formatDate = (date: Date | string) => {
    const hasDateObj = typeof date === 'string' ? new Date(date) : date;
    const localeCode =
      locale === 'vi' ? LOCALE_CODES.VIETNAMESE : LOCALE_CODES.ENGLISH;
    return hasDateObj.toLocaleDateString(localeCode, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    const localeCode =
      locale === 'vi' ? LOCALE_CODES.VIETNAMESE : LOCALE_CODES.ENGLISH;
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (paymentMethod === 'card') {
      if (!cardData.cardNumber || !cardData.expiration || !cardData.cvc) {
        toast.error(
          paymentDict.cardDataRequired ||
            PAYMENT_CONSTANTS.CARD_DATA_REQUIRED ||
            'Please fill in all card details'
        );
        return;
      }
    }

    if (!bookingResult?.booking) return;

    try {
      const result = await processPaymentMutation.mutateAsync({
        bookingId: bookingResult.booking.booking_id,
        paymentMethod,
        cardData: paymentMethod === 'card' ? cardData : undefined,
      });

      if (result.success) {
        setIsCompleted(true);
        toast.success(
          paymentDict.paymentSuccessful ||
            PAYMENT_CONSTANTS.PAYMENT_SUCCESSFUL ||
            'Payment successful!'
        );
      } else {
        toast.error(
          result.error ||
            paymentDict.paymentFailed ||
            PAYMENT_CONSTANTS.PAYMENT_FAILED ||
            'Payment failed'
        );
      }
    } catch (error) {
      toast.error(
        paymentDict.paymentError ||
          PAYMENT_CONSTANTS.PAYMENT_ERROR ||
          'An error occurred'
      );
    }
  };

  if (loadingBooking) {
    return <PaymentSkeleton />;
  }

  if (bookingError || !bookingResult?.success || !bookingResult?.booking) {
    return (
      <ErrorRetry
        message={
          bookingResult?.error ||
          paymentDict.bookingNotFound ||
          PAYMENT_CONSTANTS.BOOKING_NOT_FOUND ||
          'Booking not found'
        }
        onRetry={refetchBooking}
      />
    );
  }

  const booking = bookingResult.booking;
  const tour = booking.tour;
  const subtotal = tour.price_per_person
    ? Number(tour.price_per_person) * booking.num_guests
    : booking.total_price;
  const taxes = subtotal * 0.1;
  const total = booking.total_price + taxes;

  if (isCompleted) {
    return <PaymentSuccess locale={locale} dictionary={dictionary} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <PaymentHeader locale={locale} dictionary={dictionary} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {paymentDict.confirmAndPay ||
            PAYMENT_CONSTANTS.CONFIRM_AND_PAY ||
            'Confirm and Pay'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: PAYMENT FORM */}
          <div className="lg:col-span-2 space-y-6">
            <RenderTripInfo
              booking={booking}
              locale={locale}
              dictionary={dictionary}
              formatDate={formatDate}
            />

            <PaymentForm
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              cardData={cardData}
              onCardDataChange={setCardData}
              onSubmit={handlePayment}
              isProcessing={processPaymentMutation.isPending}
              total={total}
              locale={locale}
              dictionary={dictionary}
              formatCurrency={formatCurrency}
            />
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <OrderSummary
              booking={booking}
              subtotal={subtotal}
              taxes={taxes}
              total={total}
              locale={locale}
              dictionary={dictionary}
              formatCurrency={formatCurrency}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
