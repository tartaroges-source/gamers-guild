'use client';

import { useActionState } from 'react';

type AlbumImageUploadFormProps = {
  action: (
    state: { message?: string } | undefined,
    formData: FormData
  ) => Promise<{ message?: string } | undefined>;
};

export function AlbumImageUploadForm({ action }: AlbumImageUploadFormProps) {
  const [state, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-4">
      <div>
        <label htmlFor="file" className="text-muted text-sm font-medium">
          Add a photo
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          required
          className="text-foreground file:bg-guild-green file:text-background hover:file:bg-guild-green-dim mt-1 block text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-bold file:tracking-wide file:uppercase"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 rounded-md border px-4 py-2 text-sm disabled:opacity-50"
      >
        {isPending ? 'Uploading...' : 'Upload'}
      </button>
      {state?.message && <p className="w-full text-sm text-red-400">{state.message}</p>}
    </form>
  );
}
