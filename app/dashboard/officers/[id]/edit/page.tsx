import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { UserForm } from '@/components/UserForm';
import { getUserById } from '@/features/users/queries';
import { updateUserAction } from '@/features/users/actions';

export default async function EditOfficerPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const { id } = await params;

  if (id === session.user.id) {
    redirect('/dashboard/officers');
  }

  const user = await getUserById(id);
  if (!user) {
    notFound();
  }

  const boundUpdateAction = updateUserAction.bind(null, user.id);

  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        Edit Account
      </h1>
      <div className="mt-8">
        <UserForm
          action={boundUpdateAction}
          mode="edit"
          defaultValues={{ name: user.name, role: user.role }}
          submitLabel="Save Changes"
        />
      </div>
    </main>
  );
}