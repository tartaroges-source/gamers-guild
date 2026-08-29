import Link from 'next/link';
import { getAllEvents } from '@/features/events/queries';
import { formatEventDate } from '@/lib/format';
import { deleteEventAction } from '@/features/events/actions';
import { setFeaturedEventAction } from '@/features/events/media';
import { ConfirmButton } from '@/components/ConfirmButton';

export default async function DashboardEventsPage() {
  const events = await getAllEvents();

  return (
    <main className="p-4 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-foreground text-xl font-bold tracking-wide uppercase sm:text-2xl">
          Events
        </h1>
        <Link
          href="/dashboard/events/new"
          className="bg-guild-green font-display text-background hover:bg-guild-green-dim rounded-md px-4 py-2.5 text-center text-sm font-bold tracking-wide uppercase sm:py-2"
        >
          + New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="border-guild-green/20 bg-surface mt-6 flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-12 text-center sm:mt-8">
          <span className="font-display text-guild-green/60 text-3xl">＋</span>
          <p className="text-foreground text-sm font-semibold">No events yet</p>
          <p className="text-muted text-xs">Create the first one to get it on the calendar.</p>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3 sm:mt-8">
          {events.map((event) => (
            <li
              key={event.id}
              className="border-guild-green/20 bg-surface flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0">
                <p className="text-guild-gold font-mono text-xs tracking-widest uppercase">
                  {formatEventDate(event.startsAt)}
                  {event.isFeatured && (
                    <span className="bg-guild-gold/20 text-guild-gold ml-2 rounded px-1.5 py-0.5">
                      FEATURED
                    </span>
                  )}
                </p>
                <p className="font-display text-foreground mt-1 font-bold uppercase break-words">
                  {event.title}
                </p>
                <p className="text-muted mt-0.5 text-xs">
                  Created by {event.createdBy?.name ?? 'Unknown'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {!event.isFeatured && (
                  <form action={setFeaturedEventAction.bind(null, event.id)} className="contents sm:block">
                    <button
                      type="submit"
                      className="border-guild-gold/40 text-guild-gold hover:bg-guild-gold/10 w-full rounded-md border px-3 py-1.5 text-sm sm:w-auto"
                    >
                      Set Featured
                    </button>
                  </form>
                )}
                <Link
                  href={`/dashboard/events/${event.id}/media`}
                  className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 rounded-md border px-3 py-1.5 text-center text-sm"
                >
                  Media
                </Link>
                <Link
                  href={`/dashboard/events/${event.id}/edit`}
                  className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 rounded-md border px-3 py-1.5 text-center text-sm"
                >
                  Edit
                </Link>
                <form action={deleteEventAction.bind(null, event.id)} className="contents sm:block">
                  <ConfirmButton className="w-full rounded-md border border-red-500/40 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 sm:w-auto">
                    Delete
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}