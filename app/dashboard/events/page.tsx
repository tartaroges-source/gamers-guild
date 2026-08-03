import Link from 'next/link';
import { getAllEvents } from '@/features/events/queries';
import { formatEventDate } from '@/lib/format';
import { deleteEventAction } from '@/features/events/actions';

export default async function DashboardEventsPage() {
  const events = await getAllEvents();

  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
          Events
        </h1>
        <Link
          href="/dashboard/events/new"
          className="bg-guild-green font-display text-background hover:bg-guild-green-dim rounded-md px-4 py-2 text-sm font-bold tracking-wide uppercase"
        >
          + New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-muted mt-8">No events yet. Create the first one above.</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {events.map((event) => (
            <li
              key={event.id}
              className="border-guild-green/20 bg-surface flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
            >
              <div>
                <p className="text-guild-gold font-mono text-xs tracking-widest uppercase">
                  {formatEventDate(event.startsAt)}
                </p>
                <p className="font-display text-foreground mt-1 font-bold uppercase">
                  {event.title}
                </p>
                <p className="text-muted mt-0.5 text-xs">
                  Created by {event.createdBy?.name ?? 'Unknown'}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/events/${event.id}/edit`}
                  className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 rounded-md border px-3 py-1.5 text-sm"
                >
                  Edit
                </Link>
                <form action={deleteEventAction.bind(null, event.id)}>
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
