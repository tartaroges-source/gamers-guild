import { getUpcomingEvents } from '@/features/events/queries';
import { formatEventDate } from '@/lib/format';
import { Reticle } from '@/components/Reticle';

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
          {events.map((event) => (
            <li
              key={event.id}
              className="border-guild-green/20 bg-surface flex items-start gap-4 rounded-lg border p-6"
            >
              <Reticle className="text-guild-green mt-1 h-5 w-5 flex-shrink-0" />
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
