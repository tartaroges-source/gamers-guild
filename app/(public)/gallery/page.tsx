import Image from 'next/image';
import { getGalleryImages } from '@/features/gallery/queries';

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-foreground text-4xl font-bold tracking-wide uppercase">
        Gallery
      </h1>
      <p className="text-muted mt-2">Moments from the guild.</p>

      {images.length === 0 ? (
        <p className="text-muted mt-10">No photos yet — check back soon.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image) => (
            <figure
              key={image.id}
              className="border-guild-green/20 bg-surface overflow-hidden rounded-lg border"
            >
              <Image
                src={image.url}
                alt={image.caption ?? "Gamers' Guild event photo"}
                width={400}
                height={400}
                className="aspect-square w-full object-cover"
              />
              {image.caption && (
                <figcaption className="text-muted p-2 text-xs">{image.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
