'use client';

import { useActionState } from 'react';
import { changeOwnPasswordAction } from '@/features/profile/actions';

const inputClasses =
  'mt-1 w-full rounded-md border border-guild-green/30 bg-background px-3 py-2 text-foreground focus:border-guild-green focus:ring-1 focus:ring-guild-green focus:outline-none';
const labelClasses = 'text-sm font-medium text-muted';

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changeOwnPasswordAction, undefined);

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-4">
      <div>
        <label htmlFor="currentPassword" className={labelClasses}>
          Current Password
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="newPassword" className={labelClasses}>
          New Password
        </label>
        <input id="newPassword" name="newPassword" type="password" required className={inputClasses} />
      </div>
      <div>
        <label htmlFor="confirmPassword" className={labelClasses}>
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          className={inputClasses}
        />
      </div>

      {state?.success && <p className="text-sm text-guild-green">{state.message}</p>}
      {state?.message && !state.success && <p className="text-sm text-red-400">{state.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-md bg-guild-green px-5 py-2 font-display text-sm font-bold tracking-wide text-background uppercase hover:bg-guild-green-dim disabled:opacity-50"
      >
        {isPending ? 'Updating...' : 'Change Password'}
      </button>
    </form>
  );
}