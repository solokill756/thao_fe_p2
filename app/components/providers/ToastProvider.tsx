'use client';

import { Toaster } from 'react-hot-toast';
import { TOAST_DURATION } from '@/app/lib/constants';
import React, { ReactNode } from 'react';

export function ToastProviders({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: TOAST_DURATION,
        }}
      />
    </>
  );
}
