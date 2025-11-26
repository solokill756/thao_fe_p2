import { getDictionary } from '@/app/lib/get-dictionary';
import AdminToursClient from './AdminToursClient';
import { getAdminTours } from '@/app/lib/services/tourService.server';
import { getCategories } from '@/app/lib/services/categoriesService.server';
import { getDestinations } from '@/app/lib/services/destinationService.server';

export default async function AdminToursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const localeTyped = locale as 'en' | 'vi';
  const dictionary = await getDictionary(localeTyped);
  const initialTours = await getAdminTours();
  const initialCategories = await getCategories();
  const initialDestinations = await getDestinations();
  return (
    <AdminToursClient
      locale={localeTyped}
      dictionary={dictionary}
      initialTours={initialTours}
      initialCategories={initialCategories}
      initialDestinations={initialDestinations}
    />
  );
}
