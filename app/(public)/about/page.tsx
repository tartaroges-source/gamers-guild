import Image from 'next/image';
import { getTeamMembers } from '@/features/team/queries';
import { getAboutContent, getCoreValues } from '@/features/about/queries';
import { ExecutiveOrgChart } from '@/components/ExecutiveOrgChart';

function Section({ title, body }: { title: string; body: string | null }) {
  if (!body) return null;
  return (
    <section className="mt-12">
      <h2 className="font-display text-guild-gold text-xl font-bold tracking-wide uppercase">
        {title}
      </h2>
      <p className="text-muted mt-3 max-w-3xl whitespace-pre-line">{body}</p>
    </section>
  );
}

export default async function AboutPage() {
  const [members, content, coreValues] = await Promise.all([
    getTeamMembers(),
    getAboutContent(),
    getCoreValues(),
  ]);

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
    <div>
      <section
        className="border-guild-green/20 relative flex min-h-[50vh] flex-col items-center justify-center border-b bg-cover bg-center px-4 py-20 text-center"
        style={
          content.heroImageUrl
            ? {
                backgroundImage: `linear-gradient(rgba(14,19,16,0.75), rgba(14,19,16,0.85)), url(${content.heroImageUrl})`,
              }
            : undefined
        }
      >
        <Image src="/logo.png" alt="Gamers' Guild crest" width={80} height={80} priority />
        <h1 className="font-display text-foreground mt-6 text-4xl font-bold tracking-wide uppercase sm:text-5xl">
          About Us
        </h1>
        {content.heroTagline && (
          <p className="text-muted mt-4 max-w-xl text-lg">{content.heroTagline}</p>
        )}
      </section>

      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
        <Section title="Who We Are" body={content.whoWeAre} />

        {(content.mission || content.vision) && (
          <section className="mt-12 grid gap-6 sm:grid-cols-2">
            {content.mission && (
              <div className="border-guild-green/20 bg-surface rounded-lg border p-6">
                <h2 className="font-display text-guild-gold text-lg font-bold tracking-wide uppercase">
                  Mission
                </h2>
                <p className="text-muted mt-2 whitespace-pre-line">{content.mission}</p>
              </div>
            )}
            {content.vision && (
              <div className="border-guild-green/20 bg-surface rounded-lg border p-6">
                <h2 className="font-display text-guild-gold text-lg font-bold tracking-wide uppercase">
                  Vision
                </h2>
                <p className="text-muted mt-2 whitespace-pre-line">{content.vision}</p>
              </div>
            )}
          </section>
        )}

        <Section title="What We Do" body={content.whatWeDo} />

        {coreValues.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-guild-gold text-xl font-bold tracking-wide uppercase">
              Core Values
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {coreValues.map((value) => (
                <div
                  key={value.id}
                  className="border-guild-green/20 bg-surface rounded-lg border p-5"
                >
                  <p className="font-display text-foreground font-bold uppercase">{value.title}</p>
                  <p className="text-muted mt-1 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <Section title="Gaming Communities We Support" body={content.gamingCommunities} />
        <Section title="Why Join Us" body={content.whyJoin} />

        <section className="mt-12">
          <h2 className="font-display text-guild-gold text-xl font-bold tracking-wide uppercase">
            Executive Board
          </h2>
          <ExecutiveOrgChart membersByPosition={membersByPosition} />
        </section>

        {committeeNames.map((groupName) => (
          <section key={groupName} className="mt-12 pb-12">
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
    </div>
  );
}
