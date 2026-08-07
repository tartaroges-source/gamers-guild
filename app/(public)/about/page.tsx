import Image from 'next/image';
import { getTeamMembers } from '@/features/team/queries';
import { ExecutiveOrgChart } from '@/components/ExecutiveOrgChart';

export default async function AboutPage() {
  const members = await getTeamMembers();

  const executiveMembers = members.filter((m) => !m.committee);
  const membersByPosition = Object.fromEntries(
    executiveMembers.map((m) => [m.position, { name: m.name, photoUrl: m.photoUrl }])
  );

  const committeeGroups = members.reduce<Record<string, typeof members>>((acc, member) => {
    if (!member.committee) return acc;
    acc[member.committee] = acc[member.committee] ? [...acc[member.committee], member] : [member];
    return acc;
  }, {});
  const committeeNames = Object.keys(committeeGroups);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-foreground text-4xl font-bold tracking-wide uppercase">
        About Us
      </h1>
      <p className="text-muted mt-2">
        Meet the officers and committees behind the Gamers&apos; Guild.
      </p>

      <section className="mt-12">
        <h2 className="font-display text-guild-gold text-xl font-bold tracking-wide uppercase">
          Executive Board
        </h2>
        <ExecutiveOrgChart membersByPosition={membersByPosition} />
      </section>

      {committeeNames.map((groupName) => (
        <section key={groupName} className="mt-12">
          <h2 className="font-display text-guild-gold text-xl font-bold tracking-wide uppercase">
            {groupName}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {committeeGroups[groupName].map((member) => (
              <div
                key={member.id}
                className="border-guild-green/20 bg-surface rounded-lg border p-6 text-center"
              >
                {member.photoUrl ? (
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    width={120}
                    height={120}
                    className="mx-auto h-28 w-28 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-background font-display text-guild-green mx-auto flex h-28 w-28 items-center justify-center rounded-full text-2xl font-bold">
                    {member.name.charAt(0)}
                  </div>
                )}
                <p className="font-display text-foreground mt-4 text-lg font-bold tracking-wide uppercase">
                  {member.name}
                </p>
                <p className="text-guild-green mt-1 text-sm">{member.position}</p>
                {member.bio && <p className="text-muted mt-3 text-sm">{member.bio}</p>}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}