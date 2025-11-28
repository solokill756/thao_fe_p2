import { getDictionary } from '@/app/lib/get-dictionary';
import AdminDashboardClient from './AdminDashboardClient';
import { getDashboardStatsAction } from '@/app/actions/admin/getDashboardStatsAction';

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const localeTyped = locale as 'en' | 'vi';
  const dictionary = await getDictionary(localeTyped);
  const statsResult = await getDashboardStatsAction();

  if (!statsResult.success || !statsResult.stats) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-red-600">
          {statsResult.error || 'Failed to load dashboard stats'}
        </div>
      </div>
    );
  }

  return (
    <AdminDashboardClient
      locale={localeTyped}
      dictionary={dictionary}
      initialStats={statsResult.stats}
    />
  );
}
