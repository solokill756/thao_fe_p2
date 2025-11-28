'use client';

import { useEffect, useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Tour } from '@/app/lib/types/tourTypes';
import toast from 'react-hot-toast';
import { DictType } from '@/app/lib/types';
import {
  FORM_FIELDS,
  DEFAULT_VALUES,
  TOAST_DURATION,
} from '@/app/lib/constants';
import { createBookingAction } from '@/app/actions/booking/createBookingAction';
import { useUserProfileStore } from '@/app/lib/stores/userProfileStore';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

interface BookingFormProps {
  tour: Tour;
  locale: 'en' | 'vi';
  dictionary: DictType;
}

export default function BookingForm({
  tour,
  locale,
  dictionary,
}: BookingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isOptimistic, setIsOptimistic] = useState(false);
  const [optimisticData, setOptimisticData] = useState<typeof formData | null>(
    null
  );
  const session = useSession();
  const { name, email, phoneNumber } = useUserProfileStore();
  const [formData, setFormData] = useState({
    name: name || '',
    email: email || '',
    phone: phoneNumber || '',
    date: '',
    guests: 2,
    message: '',
  });
  const queryClient = useQueryClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === FORM_FIELDS.GUESTS
          ? parseInt(value) || DEFAULT_VALUES.DEFAULT_GUEST_MIN
          : value,
    }));
  };

  useEffect(() => {
    if (!session.data?.user) {
      queueMicrotask(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          guests: DEFAULT_VALUES.DEFAULT_GUESTS,
          message: '',
        });
      });
    }
  }, [session.data?.user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error(
        dictionary.tourDetail?.loginToBook || DEFAULT_VALUES.LOGIN_TO_BOOK
      );
      return;
    }

    const currentFormData = { ...formData };
    setOptimisticData(currentFormData);
    setIsOptimistic(true);

    toast.success(
      dictionary.tourDetail?.bookingSuccess || DEFAULT_VALUES.BOOKING_SUCCESS,
      {
        duration: TOAST_DURATION,
      }
    );

    const formDataToSubmit = new FormData();
    formDataToSubmit.append(FORM_FIELDS.LOCALE, locale);
    formDataToSubmit.append(FORM_FIELDS.TOUR_ID, tour.tour_id.toString());
    formDataToSubmit.append(FORM_FIELDS.NAME, formData.name);
    formDataToSubmit.append(FORM_FIELDS.EMAIL, formData.email);
    formDataToSubmit.append(FORM_FIELDS.PHONE, formData.phone);
    formDataToSubmit.append(FORM_FIELDS.DATE, formData.date);
    formDataToSubmit.append(FORM_FIELDS.GUESTS, formData.guests.toString());
    formDataToSubmit.append(FORM_FIELDS.MESSAGE, formData.message);

    startTransition(async () => {
      try {
        const result = await createBookingAction(formDataToSubmit);

        if (result.success) {
          setIsOptimistic(false);
          setOptimisticData(null);
          queryClient.invalidateQueries({ queryKey: ['userBookings'] });
          setFormData({
            name: name || '',
            email: email || '',
            phone: phoneNumber || '',
            date: '',
            guests: DEFAULT_VALUES.DEFAULT_GUESTS,
            message: '',
          });
        } else {
          setIsOptimistic(false);
          setOptimisticData(null);

          toast.dismiss();

          if (result.errors && Object.keys(result.errors).length > 0) {
            Object.values(result.errors).forEach((errorArray: string[]) => {
              errorArray?.forEach((error: string) => {
                toast.error(error);
              });
            });
          } else {
            toast.error(
              result.message ||
                dictionary.tourDetail?.bookingError ||
                DEFAULT_VALUES.BOOKING_ERROR
            );
          }
        }
      } catch (error) {
        setIsOptimistic(false);
        setOptimisticData(null);
        toast.dismiss();
        console.error('Booking error:', error);
        toast.error(
          dictionary.tourDetail?.bookingError || DEFAULT_VALUES.BOOKING_ERROR
        );
      }
    });
  };

  const tourDetailDict = dictionary.tourDetail;

  const displayData =
    isOptimistic && optimisticData ? optimisticData : formData;
  const isFormDisabled = isPending || isOptimistic;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const successBannerVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-2xl sticky top-24 border border-gray-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h3
        className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3"
        variants={itemVariants}
      >
        {tourDetailDict?.bookThisTour || 'Book This Tour'}
      </motion.h3>
      <motion.p className="text-gray-500 text-sm mb-6" variants={itemVariants}>
        {tourDetailDict?.bookingDescription ||
          'Fill in the form below to book this amazing tour.'}
      </motion.p>

      <AnimatePresence mode="wait">
        {isOptimistic && (
          <motion.div
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
            variants={successBannerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 15,
                }}
              >
                <motion.span
                  className="w-3 h-3 flex items-center justify-center text-white text-base"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  ✓
                </motion.span>
              </motion.div>
              <p className="text-green-800 font-semibold">
                {tourDetailDict?.bookingSuccess ||
                  DEFAULT_VALUES.BOOKING_SUCCESS}
              </p>
            </motion.div>
            <motion.p
              className="text-green-700 text-sm mt-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {tourDetailDict?.processingBooking ||
                DEFAULT_VALUES.BOOKING_PROCESSING}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <motion.input
            type="text"
            name="name"
            placeholder={tourDetailDict?.fullName || 'Full Name'}
            required
            disabled={isFormDisabled}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
              isFormDisabled
                ? 'bg-gray-100 cursor-not-allowed opacity-60'
                : 'hover:border-blue-400'
            }`}
            value={displayData.name}
            onChange={handleChange}
            variants={inputVariants}
            whileFocus="focus"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.input
            type="email"
            name="email"
            placeholder={tourDetailDict?.email || 'Email'}
            required
            disabled={isFormDisabled}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
              isFormDisabled
                ? 'bg-gray-100 cursor-not-allowed opacity-60'
                : 'hover:border-blue-400'
            }`}
            value={displayData.email}
            onChange={handleChange}
            variants={inputVariants}
            whileFocus="focus"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.input
            type="tel"
            name="phone"
            placeholder={tourDetailDict?.phone || 'Phone Number'}
            required
            disabled={isFormDisabled}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
              isFormDisabled
                ? 'bg-gray-100 cursor-not-allowed opacity-60'
                : 'hover:border-blue-400'
            }`}
            value={displayData.phone}
            onChange={handleChange}
            variants={inputVariants}
            whileFocus="focus"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.input
            type="date"
            name="date"
            placeholder={tourDetailDict?.departureDate || 'Departure Date'}
            required
            disabled={isFormDisabled}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full p-3 border border-gray-300 rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              isFormDisabled
                ? 'bg-gray-100 cursor-not-allowed opacity-60'
                : 'hover:border-blue-400'
            }`}
            value={displayData.date}
            onChange={handleChange}
            variants={inputVariants}
            whileFocus="focus"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.input
            type="number"
            name="guests"
            placeholder={tourDetailDict?.numberOfGuests || 'Number of Guests'}
            required
            disabled={isFormDisabled}
            min={DEFAULT_VALUES.DEFAULT_GUEST_MIN.toString()}
            max={tour.max_guests}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
              isFormDisabled
                ? 'bg-gray-100 cursor-not-allowed opacity-60'
                : 'hover:border-blue-400'
            }`}
            value={displayData.guests}
            onChange={handleChange}
            variants={inputVariants}
            whileFocus="focus"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.textarea
            name="message"
            placeholder={
              tourDetailDict?.messageOptional || 'Message (optional)'
            }
            rows={3}
            disabled={isFormDisabled}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none transition-all ${
              isFormDisabled
                ? 'bg-gray-100 cursor-not-allowed opacity-60'
                : 'hover:border-blue-400'
            }`}
            value={displayData.message}
            onChange={handleChange}
            variants={inputVariants}
            whileFocus="focus"
          ></motion.textarea>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.button
            type="submit"
            disabled={isFormDisabled}
            className={`w-full font-bold py-3 rounded-lg shadow-md ${
              isOptimistic
                ? 'bg-green-600 text-white'
                : isPending
                  ? 'bg-blue-600 text-white opacity-50 cursor-not-allowed'
                  : 'bg-blue-600 text-white'
            }`}
            whileHover={
              !isFormDisabled
                ? {
                    scale: 1.02,
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                  }
                : {}
            }
            whileTap={
              !isFormDisabled
                ? {
                    scale: 0.98,
                  }
                : {}
            }
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 17,
            }}
            animate={
              isOptimistic
                ? {
                    backgroundColor: '#16a34a',
                  }
                : {
                    backgroundColor: '#2563eb',
                  }
            }
          >
            {isOptimistic ? (
              <motion.span
                className="flex items-center justify-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className="inline-block h-5 w-5 align-middle border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  aria-label="loading"
                ></motion.span>
                <span>
                  {tourDetailDict?.processingBooking ||
                    DEFAULT_VALUES.BOOKING_PROCESSING}
                </span>
              </motion.span>
            ) : isPending ? (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {tourDetailDict?.booking || DEFAULT_VALUES.BOOKING}
              </motion.span>
            ) : (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {`${tourDetailDict?.bookNow || DEFAULT_VALUES.BOOK_NOW} - $${tour.price_per_person.toFixed(2)}`}
              </motion.span>
            )}
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
