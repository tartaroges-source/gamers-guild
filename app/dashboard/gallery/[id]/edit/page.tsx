import { notFound } from 'next/navigation';
import { AlbumForm } from '@/components/AlbumForm';
import { getAlbumById } from '@/features/albums/queries';
import { updateAlbumAction } from '@/features/albums/actions';

export default async function EditAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = await getAlbumById(id);
  if (!album) notFound();

  const boundUpdateAction = updateAlbumAction.bind(null, album.id);

  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        Edit Album
      </h1>
      <div className="mt-8">
        <AlbumForm
          action={boundUpdateAction}
          defaultValues={{
            title: album.title,
            description: album.description ?? '',
            eventDate: album.eventDate ? album.eventDate.toISOString().slice(0, 10) : '',
          }}
          submitLabel="Save Changes"
        />
      </div>
    </main>
  );
}
