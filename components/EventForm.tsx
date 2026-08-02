'use client';

import { useActionState } from 'react';
import type { EventActionState } from '@/features/events/actions';

type EventFormProps = {
  action: (state: EventActionState, formData: FormData) => Promise<EventActionState>;
  defaultValues?: {
    title: string;
    description: string;
    location: string;
    startsAt: string;
    endsAt: string;
  };
  submitLabel: string;
};

const inputClasses =
  'mt-1 w-full rounded-md border border-guild-green/30 bg-background px-3 py-2 text-foreground focus:border-guild-green focus:ring-1 focus:ring-guild-green focus:outline-none';
const labelClasses = 'text-sm font-medium text-muted';

export function EventForm({ action, defaultValues, submitLabel }: EventFormProps) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <div>
        <label htmlFor="title" className={labelClasses}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={defaultValues?.title}
          className={inputClasses}
        />
        {state?.errors?.title && (
          <p className="mt-1 text-sm text-red-400">{state.errors.title[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className={labelClasses}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          defaultValue={defaultValues?.description}
          className={inputClasses}
        />
        {state?.errors?.description && (
          <p className="mt-1 text-sm text-red-400">{state.errors.description[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className={labelClasses}>
          Location (optional)
        </label>
        <input
          id="location"
          name="location"
          type="text"
          defaultValue={defaultValues?.location}
          className={inputClasses}
        />
        {state?.errors?.location && (
          <p className="mt-1 text-sm text-red-400">{state.errors.location[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="startsAt" className={labelClasses}>
            Starts
          </label>
          <input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            required
            defaultValue={defaultValues?.startsAt}
            className={inputClasses}
          />
          {state?.errors?.startsAt && (
            <p className="mt-1 text-sm text-red-400">{state.errors.startsAt[0]}</p>
          )}
        </div>

        <div className="flex-1">
          <label htmlFor="endsAt" className={labelClasses}>
            Ends (optional)
          </label>
          <input
            id="endsAt"
            name="endsAt"
            type="datetime-local"
            defaultValue={defaultValues?.endsAt}
            className={inputClasses}
          />
          {state?.errors?.endsAt && (
            <p className="mt-1 text-sm text-red-400">{state.errors.endsAt[0]}</p>
          )}
        </div>
      </div>

      {state?.message && !state.errors && <p className="text-sm text-red-400">{state.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-guild-green font-display text-background hover:bg-guild-green-dim w-fit rounded-md px-6 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors disabled:opacity-50"
      >
        {isPending ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}