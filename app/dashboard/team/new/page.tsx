import { TeamMemberForm } from '@/components/TeamMemberForm';
import { createTeamMemberAction } from '@/features/team/actions';

export default function NewTeamMemberPage() {
  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        New Team Member
      </h1>
      <div className="mt-8">
        <TeamMemberForm action={createTeamMemberAction} submitLabel="Add to Roster" />
      </div>
    </main>
  );
}