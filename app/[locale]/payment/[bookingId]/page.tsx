import { getDictionary } from '@/app/lib/get-dictionary';
import PaymentClient from './components/PaymentClient';

interface PaymentPageProps {
  params: Promise<{
    locale: 'en' | 'vi';
    bookingId: string;
  }>;
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { locale, bookingId } = await params;
  const dictionary = await getDictionary(locale);
  const bookingIdNum = parseInt(bookingId);

  return (
    <PaymentClient
      locale={locale}
      bookingId={bookingIdNum}
      dictionary={dictionary}
    />
  );
}
