import { prisma } from '@/lib/db';

export async function getAlbumsForDashboard() {
  return prisma.album.findMany({
    orderBy: { createdAt: 'desc' },
    include: { images: { select: { id: true } }, coverImage: true },
  });
}

export async function getAlbumById(id: string) {
  return prisma.album.findUnique({
    where: { id },
    include: { images: { orderBy: { createdAt: 'asc' } }, coverImage: true },
  });
}

// Public: featured album first (manually set, or falls back to the most
// recent by event date), then everything else.
export async function getFeaturedAlbum() {
  const manual = await prisma.album.findFirst({
    where: { isFeatured: true },
    include: { coverImage: true, images: { select: { id: true } } },
  });
  if (manual) return manual;

  return prisma.album.findFirst({
    orderBy: [{ eventDate: 'desc' }, { createdAt: 'desc' }],
    include: { coverImage: true, images: { select: { id: true } } },
  });
}

export async function getOtherAlbums(excludeId?: string) {
  return prisma.album.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    orderBy: [{ eventDate: 'desc' }, { createdAt: 'desc' }],
    include: { coverImage: true, images: { select: { id: true } } },
  });
}
