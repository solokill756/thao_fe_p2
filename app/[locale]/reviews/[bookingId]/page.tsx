import { getDictionary } from '@/app/lib/get-dictionary';
import ReviewClient from './ReviewClient';

interface ReviewPageProps {
  params: Promise<{
    locale: 'en' | 'vi';
    bookingId: string;
  }>;
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { locale, bookingId } = await params;
  const dictionary = await getDictionary(locale);
  const bookingIdNumber = parseInt(bookingId, 10);

  return (
    <ReviewClient
      locale={locale}
      bookingId={bookingIdNumber}
      dictionary={dictionary}
    />
  );
}
