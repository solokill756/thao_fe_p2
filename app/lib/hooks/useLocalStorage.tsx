'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadData = async () => {
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 300));

        const storedValue = localStorage.getItem(key);
        if (storedValue) {
          try {
            setValue(JSON.parse(storedValue));
          } catch {
            setValue(defaultValue);
          }
        }

        setLoading(false);
      };

      loadData();
    } else {
      setLoading(false);
    }
  }, [key, defaultValue]);

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  };

  return [value, setStoredValue, loading] as const;
}
