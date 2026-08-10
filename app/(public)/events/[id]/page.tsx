import { notFound } from 'next/navigation';
import { getEventById } from '@/features/events/queries';
import { formatEventDate } from '@/lib/format';
import { EventMediaCarousel } from '@/components/EventMediaCarousel';

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="text-guild-gold font-mono text-xs tracking-widest uppercase">
        {formatEventDate(event.startsAt)}
      </p>
      <h1 className="font-display text-foreground mt-2 text-4xl font-bold tracking-wide uppercase">
        {event.title}
      </h1>
      {event.location && <p className="text-muted mt-2">{event.location}</p>}
      <p className="text-muted mt-4 whitespace-pre-line">{event.description}</p>

      {event.media.length > 0 && (
        <div className="mt-10">
          <EventMediaCarousel media={event.media} />
        </div>
      )}
    </div>
  );
}
