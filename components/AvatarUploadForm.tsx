'use client';

import { useActionState } from 'react';
import { updateOwnAvatarAction } from '@/features/profile/actions';

export function AvatarUploadForm() {
  const [state, formAction, isPending] = useActionState(updateOwnAvatarAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input
        type="file"
        name="avatar"
        accept="image/jpeg,image/png,image/webp,image/gif"
        required
        className="text-foreground file:bg-guild-green file:text-background hover:file:bg-guild-green-dim text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-bold file:tracking-wide file:uppercase"
      />
      {state?.success && <p className="text-guild-green text-sm">{state.message}</p>}
      {state?.message && !state.success && <p className="text-sm text-red-400">{state.message}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-guild-green font-display text-background hover:bg-guild-green-dim w-fit rounded-md px-5 py-2 text-sm font-bold tracking-wide uppercase disabled:opacity-50"
      >
        {isPending ? 'Uploading...' : 'Update Photo'}
      </button>
    </form>
  );
}