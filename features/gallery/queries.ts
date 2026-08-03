import { prisma } from '@/lib/db';

// Public site: all images, most recent first.
export async function getGalleryImages() {
  return prisma.galleryImage.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

// Dashboard: same order, but includes who uploaded each one.
export async function getGalleryImagesForDashboard() {
  return prisma.galleryImage.findMany({
    orderBy: { createdAt: 'desc' },
    include: { uploadedBy: { select: { name: true } } },
  });
}
