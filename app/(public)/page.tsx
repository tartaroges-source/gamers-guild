import Link from 'next/link';
import { Reticle } from '@/components/Reticle';

const pillars = [
  {
    title: 'Competitive Teams',
    body: 'Organized rosters that train, scrim, and represent PNC at inter-school tournaments across multiple titles.',
  },
  {
    title: 'Casual Game Nights',
    body: 'Weekly drop-in sessions — no roster, no pressure. Bring a controller, or just come watch and hang out.',
  },
  {
    title: 'Community Events',
    body: 'LAN parties, watch parties for major tournaments, and socials that bring the whole guild together off-screen too.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-guild-green/20 relative overflow-hidden border-b">
        {/* Large, faint reticle motif in the background — restrained nod to the
            crosshair in our logo, not a literal illustration. */}
        <Reticle className="text-guild-green/[0.06] pointer-events-none absolute top-1/2 right-[-120px] h-[520px] w-[520px] -translate-y-1/2" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-guild-gold font-mono text-sm tracking-widest uppercase">
            PNC &middot; Est. Gamers&apos; Guild
          </p>
          <h1 className="font-display text-foreground mt-4 max-w-2xl text-5xl font-bold tracking-tight uppercase sm:text-6xl">
            Play with purpose.
          </h1>
          <p className="text-muted mt-6 max-w-xl text-lg">
            The official home of PNC&apos;s competitive and casual gaming community — teams, events,
            and a guild that has your back.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/events"
              className="bg-guild-green font-display text-background hover:bg-guild-green-dim rounded-md px-6 py-3 text-sm font-bold tracking-wide uppercase transition-colors"
            >
              View Events
            </Link>
            <Link
              href="/apply"
              className="border-guild-gold/60 font-display text-guild-gold hover:bg-guild-gold/10 rounded-md border px-6 py-3 text-sm font-bold tracking-wide uppercase transition-colors"
            >
              Join the Guild
            </Link>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
          What we do
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="border-guild-green/20 bg-surface rounded-lg border p-6"
            >
              <Reticle className="text-guild-green h-5 w-5" />
              <h3 className="font-display text-foreground mt-4 text-lg font-bold tracking-wide uppercase">
                {pillar.title}
              </h3>
              <p className="text-muted mt-2 text-sm">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-guild-green/20 bg-surface border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
              Ready to level up?
            </h2>
            <p className="text-muted mt-2">Applications are open year-round.</p>
          </div>
          <Link
            href="/apply"
            className="bg-guild-green font-display text-background hover:bg-guild-green-dim rounded-md px-6 py-3 text-sm font-bold tracking-wide whitespace-nowrap uppercase transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </>
  );
}