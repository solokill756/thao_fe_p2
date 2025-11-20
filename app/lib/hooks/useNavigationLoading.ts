import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function useNavigationLoading() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const push = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  const replace = (href: string) => {
    startTransition(() => {
      router.replace(href);
    });
  };

  const back = () => {
    startTransition(() => {
      router.back();
    });
  };

  const forward = () => {
    startTransition(() => {
      router.forward();
    });
  };

  const refresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const prefetch = (href: string) => {
    startTransition(() => {
      router.prefetch(href);
    });
  };

  return {
    isPending,
    push,
    replace,
    back,
    forward,
    refresh,
    prefetch,
  };
}
