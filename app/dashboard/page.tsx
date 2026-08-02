import Link from 'next/link';
import { auth } from '@/lib/auth';
import { logoutAction } from '@/features/auth/actions';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        Dashboard
      </h1>
      <p className="text-muted mt-2">
        Signed in as {session?.user?.name} ({session?.user?.role})
      </p>

      <nav className="mt-8 flex flex-col gap-2">
        <Link
          href="/dashboard/events"
          className="border-guild-green/30 bg-surface text-foreground hover:border-guild-green w-fit rounded-md border px-4 py-2 text-sm font-semibold"
        >
          Manage Events
        </Link>
      </nav>

      <form action={logoutAction} className="mt-8">
        <button
          type="submit"
          className="border-guild-green/30 text-muted hover:bg-surface rounded-md border px-4 py-2 text-sm"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}