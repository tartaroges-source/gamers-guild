import { notFound } from 'next/navigation';
import { getAlbumById } from '@/features/albums/queries';
import { formatEventDate } from '@/lib/format';
import { AlbumLightbox } from '@/components/AlbumLightbox';
import { RevealOnScroll } from '@/components/RevealOnScroll';

export default async function AlbumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = await getAlbumById(id);
  if (!album) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-foreground text-4xl font-bold tracking-wide uppercase">
        {album.title}
      </h1>
      {album.eventDate && (
        <p className="text-guild-gold mt-2 font-mono text-sm uppercase">
          {formatEventDate(album.eventDate)}
        </p>
      )}
      {album.description && <p className="text-muted mt-3 max-w-2xl">{album.description}</p>}

      {album.images.length === 0 ? (
        <p className="text-muted mt-10">No photos in this album yet.</p>
      ) : (
        <RevealOnScroll direction="left">
          <div className="mt-10">
            <AlbumLightbox images={album.images} />
          </div>
        </RevealOnScroll>
      )}
    </div>
  );
}