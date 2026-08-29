'use client';

import { useActionState } from 'react';
import Image from 'next/image';
import type { AnnouncementActionState } from '@/features/announcements/actions';

type AnnouncementFormProps = {
  action: (state: AnnouncementActionState, formData: FormData) => Promise<AnnouncementActionState>;
  defaultValues?: {
    title: string;
    body: string;
  };
  posterUrl?: string | null;
  submitLabel: string;
};

const inputClasses =
  'mt-1 w-full rounded-md border border-guild-green/30 bg-background px-3 py-2 text-foreground focus:border-guild-green focus:ring-1 focus:ring-guild-green focus:outline-none';
const labelClasses = 'text-sm font-medium text-muted';

export function AnnouncementForm({ action, defaultValues, posterUrl, submitLabel }: AnnouncementFormProps) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <div>
        <label htmlFor="poster" className={labelClasses}>
          Poster Photo {posterUrl && '(uploading a new one replaces the current)'}
        </label>
        {posterUrl && (
          <div className="border-guild-green/20 mt-2 overflow-hidden rounded-md border">
            <Image
              src={posterUrl}
              alt="Current poster"
              width={400}
              height={225}
              className="h-auto w-full max-w-sm object-cover"
            />
          </div>
        )}
        <input
          id="poster"
          name="poster"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="text-foreground file:bg-guild-green file:text-background hover:file:bg-guild-green-dim mt-2 w-full text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-bold file:tracking-wide file:uppercase"
        />
        {posterUrl && (
          <label className="text-muted mt-2 flex items-center gap-2 text-sm">
            <input type="checkbox" name="removePoster" className="accent-guild-green" />
            Remove current poster
          </label>
        )}
      </div>

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
        <label htmlFor="body" className={labelClasses}>
          Body
        </label>
        <textarea
          id="body"
          name="body"
          rows={8}
          required
          defaultValue={defaultValues?.body}
          className={inputClasses}
        />
        {state?.errors?.body && <p className="mt-1 text-sm text-red-400">{state.errors.body[0]}</p>}
      </div>

      {state?.message && !state.errors && <p className="text-sm text-red-400">{state.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-guild-green font-display text-background hover:bg-guild-green-dim w-full rounded-md px-6 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors disabled:opacity-50 sm:w-fit"
      >
        {isPending ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}