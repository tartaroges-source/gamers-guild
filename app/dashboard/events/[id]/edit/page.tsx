import { notFound } from 'next/navigation';
import { EventForm } from '@/components/EventForm';
import { getEventById } from '@/features/events/queries';
import { updateEventAction } from '@/features/events/actions';
import { toDateTimeLocalValue } from '@/lib/format';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  const boundUpdateAction = updateEventAction.bind(null, event.id);

  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        Edit Event
      </h1>
      <div className="mt-8">
        <EventForm
          action={boundUpdateAction}
          defaultValues={{
            title: event.title,
            description: event.description,
            location: event.location ?? '',
            startsAt: toDateTimeLocalValue(event.startsAt),
            endsAt: toDateTimeLocalValue(event.endsAt),
          }}
          submitLabel="Save Changes"
        />
      </div>
    </main>
  );
}
