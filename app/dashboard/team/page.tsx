import Image from 'next/image';
import Link from 'next/link';
import { getTeamMembersForDashboard } from '@/features/team/queries';
import { deleteTeamMemberAction } from '@/features/team/actions';

export default async function DashboardTeamPage() {
  const members = await getTeamMembersForDashboard();

  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
          Team Roster
        </h1>
        <Link
          href="/dashboard/team/new"
          className="bg-guild-green font-display text-background hover:bg-guild-green-dim rounded-md px-4 py-2 text-sm font-bold tracking-wide uppercase"
        >
          + New Member
        </Link>
      </div>

      {members.length === 0 ? (
        <p className="text-muted mt-8">No team members yet.</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {members.map((member) => (
            <li
              key={member.id}
              className="border-guild-green/20 bg-surface flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4">
                {member.photoUrl ? (
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-background font-display text-guild-green flex h-12 w-12 items-center justify-center rounded-full font-bold">
                    {member.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-display text-foreground font-bold uppercase">{member.name}</p>
                  <p className="text-muted text-sm">
                    {member.position}
                    {member.committee && <> &middot; {member.committee}</>}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/team/${member.id}/edit`}
                  className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 rounded-md border px-3 py-1.5 text-sm"
                >
                  Edit
                </Link>
                <form action={deleteTeamMemberAction.bind(null, member.id)}>
                  <button
                    type="submit"
                    className="rounded-md border border-red-500/40 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}