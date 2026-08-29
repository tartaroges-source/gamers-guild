'use client';

import { useActionState } from 'react';
import { updateAboutContentAction } from '@/features/about/actions';

const inputClasses =
  'mt-1 w-full rounded-md border border-guild-green/30 bg-background px-3 py-2 text-foreground focus:border-guild-green focus:ring-1 focus:ring-guild-green focus:outline-none';
const labelClasses = 'text-sm font-medium text-muted';

type AboutContentFormProps = {
  defaultValues: {
    heroTagline: string;
    whoWeAre: string;
    mission: string;
    vision: string;
    whatWeDo: string;
    gamingCommunities: string;
    whyJoin: string;
  };
  hasHeroImage: boolean;
};

const fields: {
  name: keyof AboutContentFormProps['defaultValues'];
  label: string;
  rows?: number;
}[] = [
  { name: 'heroTagline', label: 'Hero Tagline' },
  { name: 'whoWeAre', label: 'Who We Are', rows: 4 },
  { name: 'mission', label: 'Mission', rows: 3 },
  { name: 'vision', label: 'Vision', rows: 3 },
  { name: 'whatWeDo', label: 'What We Do', rows: 4 },
  { name: 'gamingCommunities', label: 'Gaming Communities We Support', rows: 3 },
  { name: 'whyJoin', label: 'Why Join Us', rows: 3 },
];

export function AboutContentForm({ defaultValues, hasHeroImage }: AboutContentFormProps) {
  const [state, formAction, isPending] = useActionState(updateAboutContentAction, undefined);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <div>
        <label htmlFor="heroImage" className={labelClasses}>
          Hero Background Image {hasHeroImage && '(uploading a new one replaces the current)'}
        </label>
        <input
          id="heroImage"
          name="heroImage"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="text-foreground file:bg-guild-green file:text-background hover:file:bg-guild-green-dim mt-1 w-full text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-bold file:tracking-wide file:uppercase"
        />
      </div>

      {fields.map(({ name, label, rows }) => (
        <div key={name}>
          <label htmlFor={name} className={labelClasses}>
            {label}
          </label>
          {rows ? (
            <textarea
              id={name}
              name={name}
              rows={rows}
              defaultValue={defaultValues[name]}
              className={inputClasses}
            />
          ) : (
            <input
              id={name}
              name={name}
              type="text"
              defaultValue={defaultValues[name]}
              className={inputClasses}
            />
          )}
          {state?.errors?.[name] && (
            <p className="mt-1 text-sm text-red-400">{state.errors[name][0]}</p>
          )}
        </div>
      ))}

      {state?.success && <p className="text-guild-green text-sm">{state.message}</p>}
      {state?.message && !state.success && !state.errors && (
        <p className="text-sm text-red-400">{state.message}</p>
      )}

      <button
  type="submit"
  disabled={isPending}
  className="bg-guild-green font-display text-background hover:bg-guild-green-dim w-full rounded-md px-6 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors disabled:opacity-50 sm:w-fit"
>
  {isPending ? 'Saving...' : 'Save About Page'}
</button>
    </form>
  );
}
