import Link from 'next/link';
import Image from 'next/image';
import { getUpcomingEvents } from '@/features/events/queries';
import { formatEventDate } from '@/lib/format';
import { Reticle } from '@/components/Reticle';
import { RevealOnScroll } from '@/components/RevealOnScroll';

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-foreground text-4xl font-bold tracking-wide uppercase">
        Events
      </h1>
      <p className="text-muted mt-2">Upcoming guild events, tournaments, and game nights.</p>

      {events.length === 0 ? (
        <p className="text-muted mt-10">No upcoming events right now — check back soon.</p>
      ) : (
        <ul className="mt-10 flex flex-col gap-4">
          {events.map((event, index) => {
            const thumbnail = event.media[0];
            return (
              <RevealOnScroll key={event.id} direction={index % 2 === 0 ? 'left' : 'right'}>
                <li>
                  <Link
                    href={`/events/${event.id}`}
                    className="border-guild-green/20 bg-surface hover:border-guild-green flex items-start gap-4 rounded-lg border p-6 transition-colors"
                  >
                    {thumbnail ? (
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        {thumbnail.type === 'VIDEO' ? (
                          <video src={thumbnail.url} className="h-full w-full object-cover" />
                        ) : (
                          <Image src={thumbnail.url} alt="" fill sizes="64px" className="object-cover" />
                        )}
                      </div>
                    ) : (
                      <Reticle className="text-guild-green mt-1 h-5 w-5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-guild-gold font-mono text-xs tracking-widest uppercase">
                        {formatEventDate(event.startsAt)}
                      </p>
                      <h2 className="font-display text-foreground mt-1 text-xl font-bold tracking-wide uppercase">
                        {event.title}
                      </h2>
                      {event.location && <p className="text-muted mt-1 text-sm">{event.location}</p>}
                      <p className="text-muted mt-3 text-sm">{event.description}</p>
                    </div>
                  </Link>
                </li>
              </RevealOnScroll>
            );
          })}
        </ul>
      )}
    </div>
  );
}