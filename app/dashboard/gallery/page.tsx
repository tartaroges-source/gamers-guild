import Link from 'next/link';
import { getAlbumsForDashboard } from '@/features/albums/queries';
import { deleteAlbumAction, setFeaturedAlbumAction } from '@/features/albums/actions';
import { ConfirmButton } from '@/components/ConfirmButton';

export default async function DashboardGalleryPage() {
  const albums = await getAlbumsForDashboard();

  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
          Gallery Albums
        </h1>
        <Link
          href="/dashboard/gallery/new"
          className="bg-guild-green font-display text-background hover:bg-guild-green-dim rounded-md px-4 py-2 text-sm font-bold tracking-wide uppercase"
        >
          + New Album
        </Link>
      </div>

      {albums.length === 0 ? (
        <p className="text-muted mt-8">No albums yet. Create the first one above.</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {albums.map((album) => (
            <li
              key={album.id}
              className="border-guild-green/20 bg-surface flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
            >
              <div>
                <p className="font-display text-foreground font-bold uppercase">
                  {album.title}
                  {album.isFeatured && (
                    <span className="text-guild-gold ml-2 font-mono text-xs tracking-widest uppercase">
                      Featured
                    </span>
                  )}
                </p>
                <p className="text-muted mt-1 text-sm">
                  {album.images.length} photo{album.images.length === 1 ? '' : 's'}
                  {album.eventDate && <> &middot; {album.eventDate.toLocaleDateString()}</>}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {!album.isFeatured && (
                  <form action={setFeaturedAlbumAction.bind(null, album.id)}>
                    <button
                      type="submit"
                      className="border-guild-gold/40 text-guild-gold hover:bg-guild-gold/10 rounded-md border px-3 py-1.5 text-sm"
                    >
                      Set Featured
                    </button>
                  </form>
                )}
                <Link
                  href={`/dashboard/gallery/${album.id}`}
                  className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 rounded-md border px-3 py-1.5 text-sm"
                >
                  Manage Photos
                </Link>
                <Link
                  href={`/dashboard/gallery/${album.id}/edit`}
                  className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 rounded-md border px-3 py-1.5 text-sm"
                >
                  Edit Info
                </Link>
                <form action={deleteAlbumAction.bind(null, album.id)}>
                  <ConfirmButton className="rounded-md border border-red-500/40 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10">Delete</ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
