'use client';

import { useActionState } from 'react';
import { createCoreValueAction, deleteCoreValueAction } from '@/features/about/actions';
import { ConfirmButton } from '@/components/ConfirmButton';

type CoreValuesManagerProps = {
  values: { id: string; title: string; description: string }[];
};

export function CoreValuesManager({ values }: CoreValuesManagerProps) {
  const [state, formAction, isPending] = useActionState(createCoreValueAction, undefined);

  return (
    <div className="max-w-2xl">
      <ul className="flex flex-col gap-2">
        {values.map((value) => (
          <li
            key={value.id}
            className="border-guild-green/20 bg-surface flex items-start justify-between gap-3 rounded-lg border p-3"
          >
            <div>
              <p className="font-display text-foreground text-sm font-bold uppercase">
                {value.title}
              </p>
              <p className="text-muted mt-0.5 text-xs">{value.description}</p>
            </div>
            <form action={deleteCoreValueAction.bind(null, value.id)}>
              <ConfirmButton className="rounded-md border border-red-500/40 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10">Delete</ConfirmButton>
            </form>
          </li>
        ))}
      </ul>

      <form
        action={formAction}
        className="border-guild-green/20 bg-surface mt-4 flex flex-col gap-3 rounded-lg border p-4"
      >
        <p className="text-muted text-sm font-medium">Add a Core Value</p>
        <input
          name="title"
          type="text"
          placeholder="Title (e.g. Sportsmanship)"
          required
          className="border-guild-green/30 bg-background text-foreground focus:border-guild-green focus:ring-guild-green w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
        />
        {state?.errors?.title && <p className="text-sm text-red-400">{state.errors.title[0]}</p>}
        <textarea
          name="description"
          placeholder="Short description"
          rows={2}
          required
          className="border-guild-green/30 bg-background text-foreground focus:border-guild-green focus:ring-guild-green w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
        />
        {state?.errors?.description && (
          <p className="text-sm text-red-400">{state.errors.description[0]}</p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="bg-guild-green font-display text-background hover:bg-guild-green-dim w-fit rounded-md px-4 py-2 text-xs font-bold tracking-wide uppercase disabled:opacity-50"
        >
          {isPending ? 'Adding...' : 'Add Value'}
        </button>
      </form>
    </div>
  );
}
