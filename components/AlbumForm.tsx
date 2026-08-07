'use client';

import { useActionState } from 'react';
import type { AlbumActionState } from '@/features/albums/actions';

type AlbumFormProps = {
  action: (state: AlbumActionState, formData: FormData) => Promise<AlbumActionState>;
  defaultValues?: { title: string; description: string; eventDate: string };
  submitLabel: string;
};

const inputClasses =
  'mt-1 w-full rounded-md border border-guild-green/30 bg-background px-3 py-2 text-foreground focus:border-guild-green focus:ring-1 focus:ring-guild-green focus:outline-none';
const labelClasses = 'text-sm font-medium text-muted';

export function AlbumForm({ action, defaultValues, submitLabel }: AlbumFormProps) {
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
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues?.description}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="eventDate" className={labelClasses}>
          Event Date (optional)
        </label>
        <input
          id="eventDate"
          name="eventDate"
          type="date"
          defaultValue={defaultValues?.eventDate}
          className={inputClasses}
        />
        <p className="text-muted mt-1 text-xs">
          Used to auto-pick the Featured album when none is manually set.
        </p>
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
