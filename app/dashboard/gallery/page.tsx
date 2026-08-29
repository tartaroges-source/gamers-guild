import Link from 'next/link';
import { getAlbumsForDashboard } from '@/features/albums/queries';
import { deleteAlbumAction, setFeaturedAlbumAction } from '@/features/albums/actions';
import { ConfirmButton } from '@/components/ConfirmButton';

export default async function DashboardGalleryPage() {
  const albums = await getAlbumsForDashboard();

  return (
    <main className="p-4 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-foreground text-xl font-bold tracking-wide uppercase sm:text-2xl">
          Gallery Albums
        </h1>
        <Link
          href="/dashboard/gallery/new"
          className="bg-guild-green font-display text-background hover:bg-guild-green-dim rounded-md px-4 py-2.5 text-center text-sm font-bold tracking-wide uppercase sm:py-2"
        >
          + New Album
        </Link>
      </div>

      {albums.length === 0 ? (
        <div className="border-guild-green/20 bg-surface mt-6 flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-12 text-center sm:mt-8">
          <span className="font-display text-guild-green/60 text-3xl">＋</span>
          <p className="text-foreground text-sm font-semibold">No albums yet</p>
          <p className="text-muted text-xs">Create the first one to start building the gallery.</p>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3 sm:mt-8">
          {albums.map((album) => (
            <li
              key={album.id}
              className="border-guild-green/20 bg-surface flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0">
                <p className="font-display text-foreground font-bold uppercase break-words">
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
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {!album.isFeatured && (
                  <form action={setFeaturedAlbumAction.bind(null, album.id)} className="contents sm:block">
                    <button
                      type="submit"
                      className="border-guild-gold/40 text-guild-gold hover:bg-guild-gold/10 w-full rounded-md border px-3 py-1.5 text-sm sm:w-auto"
                    >
                      Set Featured
                    </button>
                  </form>
                )}
                <Link
                  href={`/dashboard/gallery/${album.id}`}
                  className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 rounded-md border px-3 py-1.5 text-center text-sm"
                >
                  Manage Photos
                </Link>
                <Link
                  href={`/dashboard/gallery/${album.id}/edit`}
                  className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 rounded-md border px-3 py-1.5 text-center text-sm"
                >
                  Edit Info
                </Link>
                <form action={deleteAlbumAction.bind(null, album.id)} className="contents sm:block">
                  <ConfirmButton className="w-full rounded-md border border-red-500/40 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 sm:w-auto">
                    Delete
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}