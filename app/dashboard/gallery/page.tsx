import Image from 'next/image';
import { getGalleryImagesForDashboard } from '@/features/gallery/queries';
import { GalleryUploadForm } from '@/components/GalleryUploadForm';
import { deleteImageAction } from '@/features/gallery/actions';

export default async function DashboardGalleryPage() {
  const images = await getGalleryImagesForDashboard();

  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        Gallery
      </h1>

      <div className="mt-6 max-w-xl">
        <GalleryUploadForm />
      </div>

      {images.length === 0 ? (
        <p className="text-muted mt-8">No photos uploaded yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="border-guild-green/20 bg-surface overflow-hidden rounded-lg border"
            >
              <Image
                src={image.url}
                alt={image.caption ?? 'Gallery image'}
                width={300}
                height={300}
                className="aspect-square w-full object-cover"
              />
              <div className="p-2">
                {image.caption && <p className="text-muted text-xs">{image.caption}</p>}
                <p className="text-muted mt-1 text-[10px]">{image.uploadedBy?.name ?? 'Unknown'}</p>
                <form action={deleteImageAction.bind(null, image.id, image.url)} className="mt-2">
                  <button
                    type="submit"
                    className="w-full rounded-md border border-red-500/40 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}