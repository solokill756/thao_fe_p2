import { getDictionary } from '@/app/lib/get-dictionary';
import AdminLayoutClient from './AdminLayoutClient';
import { NavigationProvider } from './contexts/NavigationContext';
import { Suspense } from 'react';

export default async function RenderAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const localeTyped = locale as 'en' | 'vi';
  const dictionary = await getDictionary(localeTyped);

  return (
    <NavigationProvider>
      <AdminLayoutClient locale={localeTyped} dictionary={dictionary}>
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </AdminLayoutClient>
    </NavigationProvider>
  );
}
