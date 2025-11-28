'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname } from 'next/navigation';

export default function NavigationProgressBar() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const [isPending] = useTransition();

  useEffect(() => {
    if (!isPending) {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, isPending]);

  useEffect(() => {
    if (isPending && progress === 0) {
      setProgress(10);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          const randomValue =
            crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1);
          return prev + randomValue * 30;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isPending, progress]);

  if (progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 transition-all duration-300 z-50 shadow-lg"
      style={{
        width: `${Math.min(progress, 100)}%`,
        opacity: progress > 0 && progress < 100 ? 1 : 0,
      }}
    />
  );
}
