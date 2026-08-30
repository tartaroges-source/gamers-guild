'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { upload } from '@vercel/blob/client';
import {
  attachEventMediaAction,
  deleteEventMediaAction,
  moveEventMediaAction,
} from '@/features/events/media';

type MediaItem = { id: string; url: string; type: 'IMAGE' | 'VIDEO' };

type EventMediaManagerProps = {
  eventId: string;
  media: MediaItem[];
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export function EventMediaManager({ eventId, media }: EventMediaManagerProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    const form = e.currentTarget;
    const input = form.elements.namedItem('files') as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    if (files.length === 0) {
      setMessage('Please choose at least one file.');
      return;
    }

    // Soft client-side check before spending time uploading — the token
    // route also enforces a hard 50MB ceiling server-side either way.
    for (const file of files) {
      const isVideo = file.type.startsWith('video/');
      const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
      if (file.size > limit) {
        setMessage(
          `"${file.name}" is too large (max ${isVideo ? '50MB' : '5MB'} for ${isVideo ? 'videos' : 'images'}).`
        );
        return;
      }
    }

    setIsUploading(true);
    try {
      const uploaded: { url: string; type: 'IMAGE' | 'VIDEO' }[] = [];

      for (const file of files) {
        const isVideo = file.type.startsWith('video/');
        const blob = await upload(`events/${Date.now()}-${file.name}`, file, {
          access: 'public',
          handleUploadUrl: '/api/blob/event-media',
        });
        uploaded.push({ url: blob.url, type: isVideo ? 'VIDEO' : 'IMAGE' });
      }

      const result = await attachEventMediaAction(eventId, uploaded);
      if (result?.message) {
        setMessage(result.message);
      } else {
        form.reset();
        router.refresh();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      {media.length === 0 ? (
        <p className="text-muted">No media uploaded yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {media.map((item, index) => (
            <div
              key={item.id}
              className="border-guild-green/20 bg-surface overflow-hidden rounded-lg border"
            >
              {item.type === 'VIDEO' ? (
                <video src={item.url} controls className="aspect-video w-full object-cover" />
              ) : (
                <div className="relative aspect-video w-full">
                  <Image
                    src={item.url}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex items-center justify-between gap-2 p-2">
                <div className="flex gap-1">
                  <form action={moveEventMediaAction.bind(null, eventId, item.id, 'up')}>
                    <button
                      type="submit"
                      disabled={index === 0}
                      className="border-guild-green/30 text-guild-green hover:bg-guild-green/10 rounded border px-2 py-1 text-xs disabled:opacity-30"
                    >
                      ↑
                    </button>
                  </form>
                  <form action={moveEventMediaAction.bind(null, eventId, item.id, 'down')}>
                    <button
                      type="submit"
                      disabled={index === media.length - 1}
                      className="border-guild-green/30 text-guild-green hover:bg-guild-green/10 rounded border px-2 py-1 text-xs disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </form>
                </div>
                <form action={deleteEventMediaAction.bind(null, item.id, item.url, eventId)}>
                  <button
                    type="submit"
                    className="rounded border border-red-500/40 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="border-guild-green/20 bg-surface mt-6 flex flex-col gap-3 rounded-lg border p-4"
      >
        <label htmlFor="files" className="text-muted text-sm font-medium">
          Add Images or Videos (multiple allowed, videos max 50MB each)
        </label>
        <input
          id="files"
          name="files"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
          className="text-foreground file:bg-guild-green file:text-background hover:file:bg-guild-green-dim w-full text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-bold file:tracking-wide file:uppercase"
        />
        {message && <p className="text-sm text-red-400">{message}</p>}
        <button
          type="submit"
          disabled={isUploading}
          className="bg-guild-green font-display text-background hover:bg-guild-green-dim w-fit rounded-md px-6 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}