import { notFound } from 'next/navigation';
import { getEventById } from '@/features/events/queries';
import { EventMediaManager } from '@/components/EventMediaManager';

export default async function EventMediaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        Media for {event.title}
      </h1>
      <p className="text-muted mt-2">
        Promotional images and videos shown on this event&apos;s page and cards.
      </p>
      <div className="mt-8">
        <EventMediaManager eventId={event.id} media={event.media} />
      </div>
    </main>
  );
}
