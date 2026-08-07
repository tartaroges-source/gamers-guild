import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAlbumById } from '@/features/albums/queries';
import {
  uploadAlbumImageAction,
  deleteAlbumImageAction,
  setCoverImageAction,
} from '@/features/albums/actions';
import { AlbumImageUploadForm } from '@/components/AlbumImageUploadForm';

export default async function ManageAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = await getAlbumById(id);
  if (!album) notFound();

  const boundUploadAction = uploadAlbumImageAction.bind(null, album.id);

  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        {album.title}
      </h1>
      <p className="text-muted mt-2">Manage this album&apos;s photos and cover image.</p>

      <div className="mt-6">
        <AlbumImageUploadForm action={boundUploadAction} />
      </div>

      {album.images.length === 0 ? (
        <p className="text-muted mt-8">No photos yet — upload the first one above.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {album.images.map((image) => {
            const isCover = album.coverImageId === image.id;
            return (
              <div
                key={image.id}
                className="border-guild-green/20 bg-surface overflow-hidden rounded-lg border"
              >
                <Image
                  src={image.url}
                  alt=""
                  width={300}
                  height={300}
                  className="aspect-square w-full object-cover"
                />
                <div className="flex flex-col gap-1 p-2">
                  {isCover ? (
                    <span className="text-guild-gold text-center font-mono text-[10px] tracking-widest uppercase">
                      Cover
                    </span>
                  ) : (
                    <form action={setCoverImageAction.bind(null, album.id, image.id)}>
                      <button
                        type="submit"
                        className="border-guild-gold/40 text-guild-gold hover:bg-guild-gold/10 w-full rounded-md border px-2 py-1 text-xs"
                      >
                        Set as Cover
                      </button>
                    </form>
                  )}
                  <form action={deleteAlbumImageAction.bind(null, image.id, image.url, album.id)}>
                    <button
                      type="submit"
                      className="w-full rounded-md border border-red-500/40 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
