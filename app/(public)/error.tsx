'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Reticle } from '@/components/Reticle';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <Reticle className="h-12 w-12 text-red-400" />
      <h1 className="font-display text-foreground mt-4 text-2xl font-bold tracking-wide uppercase">
        Something Went Wrong
      </h1>
      <p className="text-muted mt-2 max-w-sm">
        We hit an unexpected error loading this page. Please try again.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="bg-guild-green font-display text-background hover:bg-guild-green-dim rounded-md px-5 py-2 text-sm font-bold tracking-wide uppercase"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border-guild-green/30 text-muted hover:bg-surface rounded-md border px-5 py-2 text-sm"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
