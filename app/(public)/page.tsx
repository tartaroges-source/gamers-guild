import Link from 'next/link';
import Image from 'next/image';
import { Reticle } from '@/components/Reticle';
import { getSiteSettings } from '@/features/settings/queries';
import { getHomepageContent } from '@/features/homepage/queries';
import { getFeaturedEventForHomepage } from '@/features/events/queries';
import { getAnnouncements } from '@/features/announcements/queries';
import { getTeamMembers } from '@/features/team/queries';
import { getFeaturedAlbum } from '@/features/albums/queries';
import { formatEventDate } from '@/lib/format';
import { RevealOnScroll } from '@/components/RevealOnScroll';

export default async function HomePage() {
  const [settings, hero, featuredEvent, announcements, teamMembers, featuredAlbum] =
    await Promise.all([
      getSiteSettings(),
      getHomepageContent(),
      getFeaturedEventForHomepage(),
      getAnnouncements(),
      getTeamMembers(),
      getFeaturedAlbum(),
    ]);

  const latestNews = announcements.slice(0, 2);
  const officerHighlights = teamMembers.filter((m) => !m.committee).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="border-guild-green/20 relative flex min-h-[85vh] items-center overflow-hidden border-b">
        {hero.heroMediaType === 'VIDEO' && hero.heroVideoUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            src={hero.heroVideoUrl}
          />
        ) : hero.heroImageUrl ? (
          <Image src={hero.heroImageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
        ) : (
          <Reticle className="animate-drift text-guild-green/[0.06] pointer-events-none absolute top-1/2 right-[-120px] h-[520px] w-[520px] -translate-y-1/2" />
        )}
        <div className="from-background via-background/80 to-background/40 absolute inset-0 bg-gradient-to-t" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-guild-gold font-mono text-sm tracking-widest uppercase">
            {settings.clubName} &middot; Est. PNC
          </p>
          <h1 className="font-display text-foreground mt-4 max-w-2xl text-5xl font-bold tracking-tight uppercase sm:text-6xl">
            Play with purpose.
          </h1>
          {hero.heroTagline && (
            <p className="text-muted mt-6 max-w-xl text-lg">{hero.heroTagline}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/apply"
              className="bg-guild-green font-display text-background hover:bg-guild-green-dim rounded-md px-6 py-3 text-sm font-bold tracking-wide uppercase transition-colors"
            >
              Join Now
            </Link>
            <Link
              href="/events"
              className="border-guild-gold/60 font-display text-guild-gold hover:bg-guild-gold/10 rounded-md border px-6 py-3 text-sm font-bold tracking-wide uppercase transition-colors"
            >
              View Events
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Event */}
      {featuredEvent && (
        <RevealOnScroll>
          <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
              Featured Event
            </h2>
            <div className="border-guild-green/20 bg-surface mt-6 overflow-hidden rounded-lg border sm:flex">
              {featuredEvent.media[0] && (
                <div className="relative h-48 w-full flex-shrink-0 sm:h-auto sm:w-64">
                  {featuredEvent.media[0].type === 'VIDEO' ? (
                    <video src={featuredEvent.media[0].url} className="h-full w-full object-cover" />
                  ) : (
                    <Image src={featuredEvent.media[0].url} alt="" fill sizes="256px" className="object-cover" />
                  )}
                </div>
              )}
              <div className="p-6">
                <p className="text-guild-gold font-mono text-xs tracking-widest uppercase">
                  {formatEventDate(featuredEvent.startsAt)}
                </p>
                <h3 className="font-display text-foreground mt-2 text-2xl font-bold tracking-wide uppercase">
                  {featuredEvent.title}
                </h3>
                {featuredEvent.location && (
                  <p className="text-muted mt-1 text-sm">{featuredEvent.location}</p>
                )}
                <p className="text-muted mt-3 text-sm">{featuredEvent.description}</p>
                <Link
                  href={`/events/${featuredEvent.id}`}
                  className="font-display text-guild-green mt-4 inline-block text-sm font-bold tracking-wide uppercase hover:underline"
                >
                  View Event &rarr;
                </Link>
              </div>
            </div>
          </section>
        </RevealOnScroll>
      )}

      {/* Latest News */}
      {latestNews.length > 0 && (
        <RevealOnScroll>
          <section className="border-guild-green/20 bg-surface border-t">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
              <h2 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
                Latest News
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {latestNews.map((item) => (
                  <div
                    key={item.id}
                    className="border-guild-green/20 bg-background rounded-lg border p-6"
                  >
                    <p className="text-guild-gold font-mono text-xs tracking-widest uppercase">
                      {formatEventDate(item.createdAt)}
                    </p>
                    <h3 className="font-display text-foreground mt-2 text-lg font-bold tracking-wide uppercase">
                      {item.title}
                    </h3>
                    <p className="text-muted mt-2 line-clamp-3 text-sm">{item.body}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/announcements"
                className="font-display text-guild-green mt-6 inline-block text-sm font-bold tracking-wide uppercase hover:underline"
              >
                View All Announcements &rarr;
              </Link>
            </div>
          </section>
        </RevealOnScroll>
      )}

      {/* Officer Highlights */}
      {officerHighlights.length > 0 && (
        <RevealOnScroll>
          <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
              Officer Highlights
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {officerHighlights.map((member) => (
                <div
                  key={member.id}
                  className="border-guild-green/20 bg-surface rounded-lg border p-6 text-center transition-transform hover:-translate-y-1"
                >
                  {member.photoUrl ? (
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      width={90}
                      height={90}
                      className="mx-auto h-[90px] w-[90px] rounded-full object-cover"
                    />
                  ) : (
                    <div className="bg-background font-display text-guild-green mx-auto flex h-[90px] w-[90px] items-center justify-center rounded-full text-xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <p className="font-display text-foreground mt-3 font-bold uppercase">
                    {member.name}
                  </p>
                  <p className="text-guild-green mt-1 text-sm">{member.position}</p>
                </div>
              ))}
            </div>
            <Link
              href="/about"
              className="font-display text-guild-green mt-6 inline-block text-sm font-bold tracking-wide uppercase hover:underline"
            >
              Meet the Full Team &rarr;
            </Link>
          </section>
        </RevealOnScroll>
      )}

      {/* Gallery Preview */}
      {featuredAlbum && featuredAlbum.coverImage && (
        <RevealOnScroll>
          <section className="border-guild-green/20 bg-surface border-t">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
              <h2 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
                Gallery Preview
              </h2>
              <Link
                href={`/gallery/${featuredAlbum.id}`}
                className="border-guild-green/20 mt-6 block overflow-hidden rounded-lg border"
              >
                <div className="relative h-64 w-full sm:h-80">
                  <Image
                    src={featuredAlbum.coverImage.url}
                    alt={featuredAlbum.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 1024px"
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
              </Link>
              <p className="font-display text-foreground mt-4 text-lg font-bold tracking-wide uppercase">
                {featuredAlbum.title}
              </p>
              <Link
                href="/gallery"
                className="font-display text-guild-green mt-2 inline-block text-sm font-bold tracking-wide uppercase hover:underline"
              >
                View Full Gallery &rarr;
              </Link>
            </div>
          </section>
        </RevealOnScroll>
      )}

      {/* Closing CTA */}
      <RevealOnScroll>
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
      </RevealOnScroll>
    </>
  );
}