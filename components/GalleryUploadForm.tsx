'use client';

import { useActionState } from 'react';
import { uploadImageAction } from '@/features/gallery/actions';

export function GalleryUploadForm() {
  const [state, formAction, isPending] = useActionState(uploadImageAction, undefined);

  return (
    <form
      action={formAction}
      className="border-guild-green/20 bg-surface flex flex-col gap-4 rounded-lg border p-6"
    >
      <div>
        <label htmlFor="file" className="text-muted text-sm font-medium">
          Image
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          required
          className="text-foreground file:bg-guild-green file:text-background hover:file:bg-guild-green-dim mt-1 w-full text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-bold file:tracking-wide file:uppercase"
        />
      </div>

      <div>
        <label htmlFor="caption" className="text-muted text-sm font-medium">
          Caption (optional)
        </label>
        <input
          id="caption"
          name="caption"
          type="text"
          className="border-guild-green/30 bg-background text-foreground focus:border-guild-green focus:ring-guild-green mt-1 w-full rounded-md border px-3 py-2 focus:ring-1 focus:outline-none"
        />
      </div>

      {state?.message && <p className="text-sm text-red-400">{state.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-guild-green font-display text-background hover:bg-guild-green-dim w-fit rounded-md px-6 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors disabled:opacity-50"
      >
        {isPending ? 'Uploading...' : 'Upload Image'}
      </button>
    </form>
  );
}
