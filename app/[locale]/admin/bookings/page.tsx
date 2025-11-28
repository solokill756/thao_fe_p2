import { getDictionary } from '@/app/lib/get-dictionary';
import AdminBookingsClient from './AdminBookingsClient';
import { getBookings } from '@/app/lib/services/bookingService.server';

export default async function AdminBookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const localeTyped = locale as 'en' | 'vi';
  const dictionary = await getDictionary(localeTyped);
  const initialBookings = await getBookings();
  return (
    <AdminBookingsClient
      locale={localeTyped}
      dictionary={dictionary}
      initialBookings={initialBookings}
    />
  );
}
