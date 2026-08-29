import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedAlbum, getOtherAlbums } from '@/features/albums/queries';
import { RevealOnScroll } from '@/components/RevealOnScroll';

export default async function GalleryPage() {
  const featured = await getFeaturedAlbum();
  const others = await getOtherAlbums(featured?.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-foreground text-4xl font-bold tracking-wide uppercase">
        Gallery
      </h1>
      <p className="text-muted mt-2">Moments from the guild.</p>

      {!featured ? (
        <p className="text-muted mt-10">No albums yet — check back soon.</p>
      ) : (
        <>
          <RevealOnScroll direction="left">
            <Link
              href={`/gallery/${featured.id}`}
              className="border-guild-green/30 bg-surface hover:border-guild-green mt-10 block overflow-hidden rounded-lg border transition-colors"
            >
              <div className="grid sm:grid-cols-2">
                {featured.coverImage ? (
                  <Image
                    src={featured.coverImage.url}
                    alt={featured.title}
                    width={600}
                    height={400}
                    className="h-64 w-full object-cover sm:h-full"
                  />
                ) : (
                  <div className="bg-background text-muted flex h-64 w-full items-center justify-center sm:h-full">
                    No cover photo yet
                  </div>
                )}
                <div className="flex flex-col justify-center p-8">
                  <p className="text-guild-gold font-mono text-xs tracking-widest uppercase">
                    Featured Album
                  </p>
                  <h2 className="font-display text-foreground mt-2 text-2xl font-bold tracking-wide uppercase">
                    {featured.title}
                  </h2>
                  {featured.eventDate && (
                    <p className="text-muted mt-1 text-sm">
                      {featured.eventDate.toLocaleDateString()}
                    </p>
                  )}
                  {featured.description && (
                    <p className="text-muted mt-3 text-sm">{featured.description}</p>
                  )}
                  <span className="bg-guild-green font-display text-background mt-4 w-fit rounded-md px-5 py-2 text-sm font-bold tracking-wide uppercase">
                    View Album
                  </span>
                </div>
              </div>
            </Link>
          </RevealOnScroll>

          {others.length > 0 && (
            <RevealOnScroll direction="right">
              <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {others.map((album) => (
                  <Link
                    key={album.id}
                    href={`/gallery/${album.id}`}
                    className="border-guild-green/20 bg-surface hover:border-guild-green overflow-hidden rounded-lg border transition-colors"
                  >
                    {album.coverImage ? (
                      <Image
                        src={album.coverImage.url}
                        alt={album.title}
                        width={400}
                        height={300}
                        className="aspect-video w-full object-cover"
                      />
                    ) : (
                      <div className="bg-background text-muted flex aspect-video w-full items-center justify-center">
                        No cover photo yet
                      </div>
                    )}
                    <div className="p-4">
                      <p className="font-display text-foreground font-bold tracking-wide uppercase">
                        {album.title}
                      </p>
                      <p className="text-muted mt-1 text-xs">
                        {album.images.length} photo{album.images.length === 1 ? '' : 's'}
                        {album.eventDate && <> &middot; {album.eventDate.toLocaleDateString()}</>}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </RevealOnScroll>
          )}
        </>
      )}
    </div>
  );
}