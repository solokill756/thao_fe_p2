import prisma from '../prisma';

export interface BookingWithRelations {
  booking_id: number;
  user_id: number | null;
  tour_id: number;
  booking_date: Date;
  num_guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  guest_full_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  created_at: Date | null;
  user: {
    user_id: number;
    full_name: string;
    email: string;
    avatar_url: string | null;
  } | null;
  tour: {
    tour_id: number;
    title: string;
    cover_image_url: string | null;
    start_date: Date | null;
    price_per_person: number | null;
    duration_days: number | null;
  };
  payment: {
    payment_id: number;
    status: 'pending' | 'completed' | 'failed';
    payment_method: string;
  } | null;
}

export const fetchBookings = async (): Promise<BookingWithRelations[]> => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
            avatar_url: true,
          },
        },
        tour: {
          select: {
            tour_id: true,
            title: true,
            cover_image_url: true,
            start_date: true,
            price_per_person: true,
            duration_days: true,
          },
        },
        payment: {
          select: {
            payment_id: true,
            status: true,
            payment_method: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const transformedBookings: BookingWithRelations[] = bookings.map(
      (booking) => ({
        booking_id: booking.booking_id,
        user_id: booking.user_id,
        tour_id: booking.tour_id,
        booking_date: booking.booking_date,
        num_guests: booking.num_guests,
        total_price: Number(booking.total_price),
        status: booking.status as 'pending' | 'confirmed' | 'cancelled',
        guest_full_name: booking.guest_full_name,
        guest_email: booking.guest_email,
        guest_phone: booking.guest_phone,
        created_at: booking.created_at,
        user: booking.user,
        tour: {
          ...booking.tour,
          start_date: booking.tour.start_date,
          price_per_person: booking.tour.price_per_person
            ? Number(booking.tour.price_per_person)
            : null,
          duration_days: booking.tour.duration_days,
        },
        payment: booking.payment,
      })
    );

    return transformedBookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const fetchUserBookings = async (
  userId: number
): Promise<BookingWithRelations[]> => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        user_id: userId,
      },
      include: {
        user: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
            avatar_url: true,
          },
        },
        tour: {
          select: {
            tour_id: true,
            title: true,
            cover_image_url: true,
            start_date: true,
            price_per_person: true,
            duration_days: true,
          },
        },
        payment: {
          select: {
            payment_id: true,
            status: true,
            payment_method: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const transformedBookings: BookingWithRelations[] = bookings.map(
      (booking) => ({
        booking_id: booking.booking_id,
        user_id: booking.user_id,
        tour_id: booking.tour_id,
        booking_date: booking.booking_date,
        num_guests: booking.num_guests,
        total_price: Number(booking.total_price),
        status: booking.status as 'pending' | 'confirmed' | 'cancelled',
        guest_full_name: booking.guest_full_name,
        guest_email: booking.guest_email,
        guest_phone: booking.guest_phone,
        created_at: booking.created_at,
        user: booking.user,
        tour: {
          ...booking.tour,
          start_date: booking.tour.start_date,
          price_per_person: booking.tour.price_per_person
            ? Number(booking.tour.price_per_person)
            : null,
          duration_days: booking.tour.duration_days,
        },
        payment: booking.payment,
      })
    );

    return transformedBookings;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (
  bookingId: number,
  newStatus: 'pending' | 'confirmed' | 'cancelled'
): Promise<void> => {
  try {
    await prisma.booking.update({
      where: { booking_id: bookingId },
      data: { status: newStatus },
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const deleteBooking = async (bookingId: number): Promise<void> => {
  try {
    await prisma.booking.delete({
      where: { booking_id: bookingId },
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};
