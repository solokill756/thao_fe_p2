'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/authOptions';
import prisma from '@/app/lib/prisma';
import z from 'zod';
import { getDictionary } from '@/app/lib/get-dictionary';
import { DictType } from '@/app/lib/types/dictType';
import {
  BOOKING_VALIDATION_MESSAGES,
  BOOKING_STATUS,
  DEFAULT_LOCALE,
} from '@/app/lib/constants';
import {
  revalidateBookingsCache,
  revalidateTourDetailCache,
} from '@/app/lib/services/cacheUtils';

type Locale = 'en' | 'vi';

export interface BookingFormData {
  tourId: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  message?: string;
}

export interface BookingState {
  success?: boolean;
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}

const createBookingSchema = (dict: DictType, maxGuests: number) =>
  z.object({
    tourId: z
      .number({
        message:
          dict.tourDetail?.validation?.tourIdRequired ||
          BOOKING_VALIDATION_MESSAGES.TOUR_ID_REQUIRED,
      })
      .int(BOOKING_VALIDATION_MESSAGES.TOUR_ID_MUST_BE_INTEGER)
      .positive(BOOKING_VALIDATION_MESSAGES.TOUR_ID_MUST_BE_POSITIVE),
    name: z
      .string({
        message:
          dict.tourDetail?.validation?.nameRequired ||
          BOOKING_VALIDATION_MESSAGES.NAME_REQUIRED,
      })
      .min(
        1,
        dict.tourDetail?.validation?.nameRequired ||
          BOOKING_VALIDATION_MESSAGES.NAME_REQUIRED
      )
      .min(
        2,
        dict.tourDetail?.validation?.nameTooShort ||
          BOOKING_VALIDATION_MESSAGES.NAME_TOO_SHORT
      )
      .trim(),
    email: z
      .string({
        message:
          dict.tourDetail?.validation?.emailRequired ||
          BOOKING_VALIDATION_MESSAGES.EMAIL_REQUIRED,
      })
      .min(
        1,
        dict.tourDetail?.validation?.emailRequired ||
          BOOKING_VALIDATION_MESSAGES.EMAIL_REQUIRED
      )
      .email(
        dict.tourDetail?.validation?.emailInvalid ||
          BOOKING_VALIDATION_MESSAGES.EMAIL_INVALID
      )
      .trim()
      .toLowerCase(),
    phone: z
      .string({
        message:
          dict.tourDetail?.validation?.phoneRequired ||
          BOOKING_VALIDATION_MESSAGES.PHONE_REQUIRED,
      })
      .min(
        1,
        dict.tourDetail?.validation?.phoneRequired ||
          BOOKING_VALIDATION_MESSAGES.PHONE_REQUIRED
      )
      .min(
        10,
        dict.tourDetail?.validation?.phoneInvalid ||
          BOOKING_VALIDATION_MESSAGES.PHONE_INVALID
      )
      .regex(
        /^[\d\s\-\+\(\)]+$/,
        dict.tourDetail?.validation?.phoneInvalid ||
          BOOKING_VALIDATION_MESSAGES.PHONE_INVALID
      )
      .trim(),
    date: z
      .string({
        message:
          dict.tourDetail?.validation?.dateRequired ||
          BOOKING_VALIDATION_MESSAGES.DATE_REQUIRED,
      })
      .min(
        1,
        dict.tourDetail?.validation?.dateRequired ||
          BOOKING_VALIDATION_MESSAGES.DATE_REQUIRED
      )
      .refine(
        (date) => {
          const selectedDate = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        },
        {
          message:
            dict.tourDetail?.validation?.datePast ||
            BOOKING_VALIDATION_MESSAGES.DATE_MUST_BE_FUTURE,
        }
      ),
    guests: z
      .number({
        message:
          dict.tourDetail?.validation?.guestsRequired ||
          BOOKING_VALIDATION_MESSAGES.GUESTS_REQUIRED,
      })
      .int(BOOKING_VALIDATION_MESSAGES.GUESTS_MUST_BE_INTEGER)
      .min(
        1,
        dict.tourDetail?.validation?.guestsMin ||
          BOOKING_VALIDATION_MESSAGES.GUESTS_MIN
      )
      .max(
        maxGuests,
        dict.tourDetail?.validation?.guestsMax?.replace(
          '{max}',
          maxGuests.toString()
        ) || BOOKING_VALIDATION_MESSAGES.GUESTS_MAX(maxGuests)
      ),
    message: z.string().optional(),
  });

export async function createBookingAction(
  formData: FormData
): Promise<BookingState> {
  try {
    const locale = (formData.get('locale') as Locale) || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    // Parse form data
    const tourId = parseInt(formData.get('tourId') as string);
    const rawData = {
      tourId: isNaN(tourId) ? undefined : tourId,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      date: formData.get('date'),
      guests: formData.get('guests')
        ? parseInt(formData.get('guests') as string)
        : undefined,
      message: formData.get('message') || undefined,
    };

    if (!tourId || isNaN(tourId)) {
      return {
        success: false,
        message:
          dict.tourDetail?.validation?.tourIdRequired ||
          BOOKING_VALIDATION_MESSAGES.TOUR_ID_REQUIRED,
        errors: {
          tourId: [
            dict.tourDetail?.validation?.tourIdRequired ||
              BOOKING_VALIDATION_MESSAGES.TOUR_ID_REQUIRED,
          ],
        },
      };
    }

    const tour = await prisma.tour.findUnique({
      where: { tour_id: tourId },
    });

    if (!tour) {
      return {
        success: false,
        message:
          dict.tourDetail?.tourNotFound ||
          BOOKING_VALIDATION_MESSAGES.TOUR_NOT_FOUND,
        errors: {},
      };
    }

    // Create schema with max guests validation
    const BookingSchema = createBookingSchema(dict, tour.max_guests);
    const validationResult = BookingSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        message:
          dict.tourDetail?.validation?.fillAllFields ||
          BOOKING_VALIDATION_MESSAGES.FILL_ALL_FIELDS,
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ? parseInt(session.user.id) : null;

    const { name, email, phone, date, guests } = validationResult.data;

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    const whereClause: {
      tour_id: number;
      booking_date: Date;
      status: { not: 'cancelled' };
      user_id?: number;
      guest_email?: string;
    } = {
      tour_id: tourId,
      booking_date: bookingDate,
      status: {
        not: BOOKING_STATUS.CANCELLED,
      },
    };

    const existingBooking = await prisma.booking.findFirst({
      where: whereClause,
    });

    if (existingBooking) {
      return {
        success: false,
        message:
          dict.tourDetail?.validation?.duplicateBooking ||
          BOOKING_VALIDATION_MESSAGES.DUPLICATE_BOOKING,
        errors: {
          date: [
            dict.tourDetail?.validation?.duplicateBooking ||
              BOOKING_VALIDATION_MESSAGES.DUPLICATE_BOOKING,
          ],
        },
      };
    }

    // Calculate total price
    const pricePerPerson = Number(tour.price_per_person);
    const totalPrice = pricePerPerson * guests;

    // Create booking
    await prisma.booking.create({
      data: {
        user_id: userId,
        tour_id: tourId,
        booking_date: new Date(date),
        num_guests: guests,
        total_price: totalPrice,
        guest_full_name: name,
        guest_email: email,
        guest_phone: phone,
        status: BOOKING_STATUS.PENDING,
      },
    });

    revalidateBookingsCache();
    revalidateTourDetailCache();

    return {
      success: true,
      message:
        dict.tourDetail?.bookingSuccess ||
        BOOKING_VALIDATION_MESSAGES.BOOKING_SUCCESS,
    };
  } catch (error) {
    console.error('Error creating booking:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      action: 'createBookingAction',
    });
    const locale = (formData.get('locale') as Locale) || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);
    return {
      success: false,
      message:
        dict.tourDetail?.bookingError ||
        BOOKING_VALIDATION_MESSAGES.BOOKING_ERROR,
      errors: {},
    };
  }
}
