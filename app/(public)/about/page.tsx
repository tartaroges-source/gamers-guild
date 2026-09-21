import Image from 'next/image';
import { getTeamMembers } from '@/features/team/queries';
import { getAboutContent, getCoreValues } from '@/features/about/queries';
import { ExecutiveOrgChart } from '@/components/ExecutiveOrgChart';
import { RevealOnScroll } from '@/components/RevealOnScroll';
import { AboutTabs } from '@/components/AboutTabs';

export default async function AboutPage() {
  const [members, content, coreValues] = await Promise.all([
    getTeamMembers(),
    getAboutContent(),
    getCoreValues(),
  ]);

  const executiveMembers = members.filter((m) => !m.committee);
  const membersByPosition = Object.fromEntries(
    executiveMembers.map((m) => [m.position, { name: m.name, photoUrl: m.photoUrl, bio: m.bio }])
  );

  const committeeGroups = members.reduce<Record<string, typeof members>>((acc, member) => {
    if (!member.committee) return acc;
    acc[member.committee] = acc[member.committee] ? [...acc[member.committee], member] : [member];
    return acc;
  }, {});

  const committeeNames = Object.keys(committeeGroups).sort((a, b) => {
    const aIsAdvisers = /advis/i.test(a);
    const bIsAdvisers = /advis/i.test(b);
    if (aIsAdvisers && !bIsAdvisers) return -1;
    if (!aIsAdvisers && bIsAdvisers) return 1;
    return 0;
  });

  // Build the tab list from whatever content actually exists. A tab is
  // only included if its underlying data is present, mirroring what the
  // old <Section> helper did by returning null when `body` was empty.
  const tabs: { key: string; label: string; content: React.ReactNode }[] = [];

  if (content.whoWeAre) {
    tabs.push({
      key: 'who-we-are',
      label: 'Who We Are',
      content: <p className="text-muted max-w-3xl whitespace-pre-line">{content.whoWeAre}</p>,
    });
  }

  if (content.mission || content.vision) {
    tabs.push({
      key: 'mission-vision',
      label: 'Mission & Vision',
      content: (
        <div className="grid gap-6 sm:grid-cols-2">
          {content.mission && (
            <div className="border-guild-green/20 bg-surface rounded-lg border p-6">
              <h3 className="font-display text-guild-gold text-lg font-bold tracking-wide uppercase">
                Mission
              </h3>
              <p className="text-muted mt-2 whitespace-pre-line">{content.mission}</p>
            </div>
          )}
          {content.vision && (
            <div className="border-guild-green/20 bg-surface rounded-lg border p-6">
              <h3 className="font-display text-guild-gold text-lg font-bold tracking-wide uppercase">
                Vision
              </h3>
              <p className="text-muted mt-2 whitespace-pre-line">{content.vision}</p>
            </div>
          )}
        </div>
      ),
    });
  }

  if (content.whatWeDo) {
    tabs.push({
      key: 'what-we-do',
      label: 'What We Do',
      content: <p className="text-muted max-w-3xl whitespace-pre-line">{content.whatWeDo}</p>,
    });
  }

  if (coreValues.length > 0) {
    tabs.push({
      key: 'core-values',
      label: 'Core Values',
      content: (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {coreValues.map((value) => (
            <div key={value.id} className="border-guild-green/20 bg-surface rounded-lg border p-5">
              <p className="font-display text-foreground font-bold uppercase">{value.title}</p>
              <p className="text-muted mt-1 text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      ),
    });
  }

  if (content.gamingCommunities) {
    tabs.push({
      key: 'gaming-communities',
      label: 'Gaming Communities',
      content: (
        <p className="text-muted max-w-3xl whitespace-pre-line">{content.gamingCommunities}</p>
      ),
    });
  }

  if (content.whyJoin) {
    tabs.push({
      key: 'why-join',
      label: 'Why Join Us',
      content: <p className="text-muted max-w-3xl whitespace-pre-line">{content.whyJoin}</p>,
    });
  }

  return (
    <div>
      <section className="border-guild-green/20 relative flex min-h-screen w-full items-center justify-center overflow-hidden border-b">
        {content.heroImageUrl && (
          <>
            <Image
              src={content.heroImageUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="bg-background/30 absolute inset-0" />
            <div className="from-background via-background/40 absolute inset-0 bg-gradient-to-t to-transparent" />
          </>
        )}

        <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center px-4 text-center">
          <Image src="/logo.png" alt="Gamers' Guild crest" width={112} height={112} priority />
          <h1
            className="font-display text-foreground mt-6 text-4xl font-bold tracking-wide uppercase sm:text-5xl"
            style={content.heroImageUrl ? { textShadow: '0 4px 30px rgba(0, 0, 0, 0.6)' } : undefined}
          >
            About Us
          </h1>
          {content.heroTagline && (
            <p className="text-muted mt-4 max-w-xl text-lg">{content.heroTagline}</p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
        <AboutTabs tabs={tabs} />

        <RevealOnScroll direction="left">
          <section className="mt-12">
            <h2 className="font-display text-guild-gold text-xl font-bold tracking-wide uppercase">
              Executive Board
            </h2>
            <ExecutiveOrgChart membersByPosition={membersByPosition} />
          </section>
        </RevealOnScroll>

        {committeeNames.map((groupName, index) => (
          <RevealOnScroll key={groupName} direction={index % 2 === 0 ? 'right' : 'left'}>
            <section className="mt-12 pb-12">
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
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}