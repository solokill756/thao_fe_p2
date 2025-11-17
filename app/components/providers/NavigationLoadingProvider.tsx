'use client';

import { useTransition } from 'react';
import Loading from '../common/Loading';

export default function NavigationLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPending] = useTransition();

  return (
    <>
      {/* Loading Overlay */}
      {isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <Loading size="lg" text="Loading..." overlay={false} />
          </div>
        </div>
      )}
      {children}
    </>
  );
}
