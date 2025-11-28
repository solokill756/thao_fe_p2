import { getDictionary } from '@/app/lib/get-dictionary';
import AdminUsersClient from './AdminUsersClient';
import { getAdminUsers } from '@/app/lib/services/userService.server';

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const localeTyped = locale as 'en' | 'vi';
  const dictionary = await getDictionary(localeTyped);
  const initialUsers = await getAdminUsers();
  return (
    <AdminUsersClient
      locale={localeTyped}
      dictionary={dictionary}
      initialUsers={initialUsers}
    />
  );
}
