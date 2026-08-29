import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getUsers } from '@/features/users/queries';
import { deleteUserAction } from '@/features/users/actions';
import { ConfirmButton } from '@/components/ConfirmButton';

export default async function DashboardOfficersPage() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const users = await getUsers();

  return (
    <main className="p-4 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-foreground text-xl font-bold tracking-wide uppercase sm:text-2xl">
          Officer Accounts
        </h1>
        <Link
          href="/dashboard/officers/new"
          className="bg-guild-green font-display text-background hover:bg-guild-green-dim rounded-md px-4 py-2.5 text-center text-sm font-bold tracking-wide uppercase sm:py-2"
        >
          + New Account
        </Link>
      </div>

      <ul className="mt-6 flex flex-col gap-3 sm:mt-8">
        {users.map((user) => (
          <li
            key={user.id}
            className="border-guild-green/20 bg-surface flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
          >
            <div className="min-w-0">
              <p className="font-display text-foreground font-bold uppercase break-words">
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
              <p className="text-muted mt-1 text-sm break-words">{user.email}</p>
            </div>
            {user.id !== session.user.id && (
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/officers/${user.id}/edit`}
                  className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 flex-1 rounded-md border px-3 py-1.5 text-center text-sm sm:flex-none"
                >
                  Edit
                </Link>
                <form action={deleteUserAction.bind(null, user.id)} className="flex-1 sm:flex-none">
                  <ConfirmButton className="w-full rounded-md border border-red-500/40 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10">
                    Delete
                  </ConfirmButton>
                </form>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}