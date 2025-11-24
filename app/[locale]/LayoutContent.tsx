'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface LayoutContentProps {
  children: ReactNode;
  shouldShowLayout: boolean;
  locale: string;
  dictionary: any;
  headerComponent: ReactNode;
  footerComponent: ReactNode;
  languageSwitcher: ReactNode;
}

export default function LayoutContent({
  children,
  shouldShowLayout,
  headerComponent,
  footerComponent,
  languageSwitcher,
}: LayoutContentProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.includes('/admin');
  const isAuthRoute = pathname?.includes('/auth');

  if (isAdminRoute || isAuthRoute || !shouldShowLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-white font-inter flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          {languageSwitcher}
        </div>
      </header>
      {headerComponent}
      <main className="grow">{children}</main>
      {footerComponent}
    </div>
  );
}
