import { auth } from '@/lib/auth';

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
    </main>
  );
}