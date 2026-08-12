import Link from 'next/link';
import { Reticle } from '@/components/Reticle';

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Reticle className="text-guild-green/40 h-16 w-16" />
      <h1 className="font-display text-foreground mt-6 text-4xl font-bold tracking-wide uppercase">
        Page Not Found
      </h1>
      <p className="text-muted mt-3 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/"
        className="bg-guild-green font-display text-background hover:bg-guild-green-dim mt-6 rounded-md px-6 py-2.5 text-sm font-bold tracking-wide uppercase"
      >
        Back to Home
      </Link>
    </div>
  );
}
