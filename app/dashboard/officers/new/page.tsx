import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { UserForm } from '@/components/UserForm';
import { createUserAction } from '@/features/users/actions';

export default async function NewOfficerPage() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        New Account
      </h1>
      <div className="mt-8">
        <UserForm action={createUserAction} mode="create" submitLabel="Create Account" />
      </div>
    </main>
  );
}