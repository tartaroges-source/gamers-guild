'use client';

import { useActionState } from 'react';
import type { UserActionState } from '@/features/users/actions';

type UserFormProps = {
  action: (state: UserActionState, formData: FormData) => Promise<UserActionState>;
  mode: 'create' | 'edit';
  defaultValues?: {
    name: string;
    role: 'ADMIN' | 'OFFICER';
  };
  submitLabel: string;
};

const inputClasses =
  'mt-1 w-full rounded-md border border-guild-green/30 bg-background px-3 py-2 text-foreground focus:border-guild-green focus:ring-1 focus:ring-guild-green focus:outline-none';
const labelClasses = 'text-sm font-medium text-muted';

export function UserForm({ action, mode, defaultValues, submitLabel }: UserFormProps) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-5">
      <div>
        <label htmlFor="name" className={labelClasses}>
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultValues?.name}
          className={inputClasses}
        />
        {state?.errors?.name && <p className="mt-1 text-sm text-red-400">{state.errors.name[0]}</p>}
      </div>

      {mode === 'create' && (
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email
          </label>
          <input id="email" name="email" type="email" required className={inputClasses} />
          {state?.errors?.email && (
            <p className="mt-1 text-sm text-red-400">{state.errors.email[0]}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="password" className={labelClasses}>
          {mode === 'create' ? 'Password' : 'New Password (leave blank to keep current)'}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required={mode === 'create'}
          className={inputClasses}
        />
        {state?.errors?.password && (
          <p className="mt-1 text-sm text-red-400">{state.errors.password[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="role" className={labelClasses}>
          Role
        </label>
        <select
          id="role"
          name="role"
          defaultValue={defaultValues?.role ?? 'OFFICER'}
          className={inputClasses}
        >
          <option value="OFFICER">Officer</option>
          <option value="ADMIN">Admin</option>
        </select>
        {state?.errors?.role && <p className="mt-1 text-sm text-red-400">{state.errors.role[0]}</p>}
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
