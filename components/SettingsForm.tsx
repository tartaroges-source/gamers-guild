'use client';

import { useActionState } from 'react';
import { updateSiteSettingsAction } from '@/features/settings/actions';

const inputClasses =
  'mt-1 w-full rounded-md border border-guild-green/30 bg-background px-3 py-2 text-foreground focus:border-guild-green focus:ring-1 focus:ring-guild-green focus:outline-none';
const labelClasses = 'text-sm font-medium text-muted';

type SettingsFormProps = {
  defaultValues: {
    clubName: string;
    contactEmail: string;
    discordUrl: string;
    facebookUrl: string;
    instagramUrl: string;
  };
};

export function SettingsForm({ defaultValues }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(updateSiteSettingsAction, undefined);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-5">
      <div>
        <label htmlFor="clubName" className={labelClasses}>
          Club Name
        </label>
        <input
          id="clubName"
          name="clubName"
          type="text"
          required
          defaultValue={defaultValues.clubName}
          className={inputClasses}
        />
        {state?.errors?.clubName && (
          <p className="mt-1 text-sm text-red-400">{state.errors.clubName[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="contactEmail" className={labelClasses}>
          Contact Email
        </label>
        <input
          id="contactEmail"
          name="contactEmail"
          type="email"
          defaultValue={defaultValues.contactEmail}
          className={inputClasses}
        />
        {state?.errors?.contactEmail && (
          <p className="mt-1 text-sm text-red-400">{state.errors.contactEmail[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="discordUrl" className={labelClasses}>
          Discord Invite Link
        </label>
        <input
          id="discordUrl"
          name="discordUrl"
          type="url"
          defaultValue={defaultValues.discordUrl}
          className={inputClasses}
        />
        {state?.errors?.discordUrl && (
          <p className="mt-1 text-sm text-red-400">{state.errors.discordUrl[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="facebookUrl" className={labelClasses}>
          Facebook Page
        </label>
        <input
          id="facebookUrl"
          name="facebookUrl"
          type="url"
          defaultValue={defaultValues.facebookUrl}
          className={inputClasses}
        />
        {state?.errors?.facebookUrl && (
          <p className="mt-1 text-sm text-red-400">{state.errors.facebookUrl[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="instagramUrl" className={labelClasses}>
          Instagram
        </label>
        <input
          id="instagramUrl"
          name="instagramUrl"
          type="url"
          defaultValue={defaultValues.instagramUrl}
          className={inputClasses}
        />
        {state?.errors?.instagramUrl && (
          <p className="mt-1 text-sm text-red-400">{state.errors.instagramUrl[0]}</p>
        )}
      </div>

      {state?.success && <p className="text-guild-green text-sm">{state.message}</p>}
      {state?.message && !state.success && !state.errors && (
        <p className="text-sm text-red-400">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-guild-green font-display text-background hover:bg-guild-green-dim w-fit rounded-md px-6 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors disabled:opacity-50"
      >
        {isPending ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
}
