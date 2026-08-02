import { EventForm } from '@/components/EventForm';
import { createEventAction } from '@/features/events/actions';

export default function NewEventPage() {
  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        New Event
      </h1>
      <div className="mt-8">
        <EventForm action={createEventAction} submitLabel="Create Event" />
      </div>
    </main>
  );
}