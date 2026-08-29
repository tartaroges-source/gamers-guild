'use client';

import { useActionState, useState, type ChangeEvent } from 'react';
import { upload } from '@vercel/blob/client';
import { updateHomepageContentAction } from '@/features/homepage/actions';

const inputClasses =
  'mt-1 w-full rounded-md border border-guild-green/30 bg-background px-3 py-2 text-foreground focus:border-guild-green focus:ring-1 focus:ring-guild-green focus:outline-none';
const labelClasses = 'text-sm font-medium text-muted';

type HomepageContentFormProps = {
  defaultValues: {
    heroMediaType: 'IMAGE' | 'VIDEO';
    heroTagline: string;
  };
  hasHeroImage: boolean;
  hasHeroVideo: boolean;
};

export function HomepageContentForm({
  defaultValues,
  hasHeroImage,
  hasHeroVideo,
}: HomepageContentFormProps) {
  const [state, formAction, isPending] = useActionState(updateHomepageContentAction, undefined);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoStatus, setVideoStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [videoError, setVideoError] = useState('');

  async function handleVideoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoStatus('uploading');
    setVideoError('');

    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/homepage/video-upload',
      });
      setVideoUrl(blob.url);
      setVideoStatus('idle');
    } catch (err) {
      setVideoStatus('error');
      setVideoError(err instanceof Error ? err.message : 'Upload failed.');
      e.target.value = '';
    }
  }

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <div>
        <label className={labelClasses}>Active Hero Media</label>
        <div className="mt-1 flex gap-4">
          <label className="text-foreground flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="heroMediaType"
              value="IMAGE"
              defaultChecked={defaultValues.heroMediaType === 'IMAGE'}
            />
            Image
          </label>
          <label className="text-foreground flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="heroMediaType"
              value="VIDEO"
              defaultChecked={defaultValues.heroMediaType === 'VIDEO'}
            />
            Video
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="heroTagline" className={labelClasses}>
          Hero Tagline
        </label>
        <input
          id="heroTagline"
          name="heroTagline"
          type="text"
          defaultValue={defaultValues.heroTagline}
          className={inputClasses}
        />
        {state?.errors?.heroTagline && (
          <p className="mt-1 text-sm text-red-400">{state.errors.heroTagline[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="heroImage" className={labelClasses}>
          Hero Image {hasHeroImage && '(uploading a new one replaces the current)'}
        </label>
        <input
          id="heroImage"
          name="heroImage"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="text-foreground file:bg-guild-green file:text-background hover:file:bg-guild-green-dim mt-1 w-full text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-bold file:tracking-wide file:uppercase"
        />
      </div>

      <div>
        <label htmlFor="heroVideo" className={labelClasses}>
          Hero Video {hasHeroVideo && '(uploading a new one replaces the current)'}
        </label>
        <input
          id="heroVideo"
          type="file"
          accept="video/mp4,video/webm"
          onChange={handleVideoChange}
          className="text-foreground file:bg-guild-green file:text-background hover:file:bg-guild-green-dim mt-1 w-full text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-bold file:tracking-wide file:uppercase"
        />
        <input type="hidden" name="heroVideoUrl" value={videoUrl} />

        {videoStatus === 'uploading' && (
          <p className="text-muted mt-1 text-xs">Uploading video…</p>
        )}
        {videoStatus === 'error' && <p className="mt-1 text-xs text-red-400">{videoError}</p>}
        {videoUrl && videoStatus === 'idle' && (
          <p className="text-guild-green mt-1 text-xs">Video uploaded — click Save to apply.</p>
        )}

        <p className="text-muted mt-1 text-xs">
          Keep it short and compressed — every visitor downloads this file. Max 100MB.
        </p>
      </div>

      {state?.success && <p className="text-guild-green text-sm">{state.message}</p>}
      {state?.message && !state.success && !state.errors && (
        <p className="text-sm text-red-400">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending || videoStatus === 'uploading'}
        className="bg-guild-green font-display text-background hover:bg-guild-green-dim w-fit rounded-md px-6 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors disabled:opacity-50"
      >
        {isPending ? 'Saving...' : 'Save Homepage'}
      </button>
    </form>
  );
}