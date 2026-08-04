import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getUsers } from '@/features/users/queries';
import { deleteUserAction } from '@/features/users/actions';

export default async function DashboardOfficersPage() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const users = await getUsers();

  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
          Officer Accounts
        </h1>
        <Link
          href="/dashboard/officers/new"
          className="bg-guild-green font-display text-background hover:bg-guild-green-dim rounded-md px-4 py-2 text-sm font-bold tracking-wide uppercase"
        >
          + New Account
        </Link>
      </div>

      <ul className="mt-8 flex flex-col gap-3">
        {users.map((user) => (
          <li
            key={user.id}
            className="border-guild-green/20 bg-surface flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
          >
            <div>
              <p className="font-display text-foreground font-bold uppercase">
                {user.name}{' '}
                <span
                  className={`font-mono text-xs tracking-widest uppercase ${
                    user.role === 'ADMIN' ? 'text-guild-gold' : 'text-guild-green'
                  }`}
                >
                  {user.role}
                </span>
                {user.id === session.user.id && (
                  <span className="text-muted ml-2 text-xs">(you)</span>
                )}
              </p>
              <p className="text-muted mt-1 text-sm">{user.email}</p>
            </div>
            {user.id !== session.user.id && (
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/officers/${user.id}/edit`}
                  className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 rounded-md border px-3 py-1.5 text-sm"
                >
                  Edit
                </Link>
                <form action={deleteUserAction.bind(null, user.id)}>
                  <button
                    type="submit"
                    className="rounded-md border border-red-500/40 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </form>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
