import { AlbumForm } from '@/components/AlbumForm';
import { createAlbumAction } from '@/features/albums/actions';

export default function NewAlbumPage() {
  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        New Album
      </h1>
      <div className="mt-8">
        <AlbumForm action={createAlbumAction} submitLabel="Create Album" />
      </div>
    </main>
  );
}
