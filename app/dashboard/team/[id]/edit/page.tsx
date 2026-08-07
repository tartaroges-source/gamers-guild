import { notFound } from 'next/navigation';
import { TeamMemberForm } from '@/components/TeamMemberForm';
import { getTeamMemberById } from '@/features/team/queries';
import { updateTeamMemberAction } from '@/features/team/actions';

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getTeamMemberById(id);

  if (!member) {
    notFound();
  }

  const boundUpdateAction = updateTeamMemberAction.bind(null, member.id);

  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        Edit Team Member
      </h1>
      <div className="mt-8">
        <TeamMemberForm
          action={boundUpdateAction}
          defaultValues={{
            name: member.name,
            position: member.position,
            committee: member.committee ?? '',
            bio: member.bio ?? '',
            order: member.order,
          }}
          hasExistingPhoto={Boolean(member.photoUrl)}
          submitLabel="Save Changes"
        />
      </div>
    </main>
  );
}