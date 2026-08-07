'use server';

import { del } from '@vercel/blob';
import { validateAndUploadImage } from '@/lib/blob';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { albumFormSchema } from '@/lib/validation/album';
import { logActivity } from '@/lib/audit';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export type AlbumActionState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

async function requireUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user;
}

function parseAlbumInput(formData: FormData) {
  return albumFormSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    eventDate: formData.get('eventDate'),
  });
}

export async function createAlbumAction(
  _prevState: AlbumActionState,
  formData: FormData
): Promise<AlbumActionState> {
  const user = await requireUser();
  if (!user) return { message: 'You must be signed in to create albums.' };

  const parsed = parseAlbumInput(formData);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, message: 'Please fix the errors below.' };
  }

  const album = await prisma.album.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      eventDate: parsed.data.eventDate ? new Date(parsed.data.eventDate) : null,
      createdById: user.id,
    },
  });

  await logActivity({
    action: 'CREATE',
    entityType: 'Album',
    entityId: album.id,
    summary: album.title,
    performedById: user.id,
    performedByName: user.name ?? 'Unknown',
  });

  revalidatePath('/gallery');
  revalidatePath('/dashboard/gallery');
  redirect(`/dashboard/gallery/${album.id}`);
}

export async function updateAlbumAction(
  id: string,
  _prevState: AlbumActionState,
  formData: FormData
): Promise<AlbumActionState> {
  const user = await requireUser();
  if (!user) return { message: 'You must be signed in to edit albums.' };

  const parsed = parseAlbumInput(formData);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, message: 'Please fix the errors below.' };
  }

  const album = await prisma.album.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      eventDate: parsed.data.eventDate ? new Date(parsed.data.eventDate) : null,
    },
  });

  await logActivity({
    action: 'UPDATE',
    entityType: 'Album',
    entityId: album.id,
    summary: album.title,
    performedById: user.id,
    performedByName: user.name ?? 'Unknown',
  });

  revalidatePath('/gallery');
  revalidatePath(`/gallery/${id}`);
  revalidatePath('/dashboard/gallery');
  redirect('/dashboard/gallery');
}

export async function deleteAlbumAction(id: string) {
  const user = await requireUser();
  if (!user) return;

  const album = await prisma.album.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!album) return;

  // Clean up Blob storage before the DB cascade-deletes the rows —
  // otherwise the files would sit orphaned in storage forever.
  await Promise.all(album.images.map((image) => del(image.url)));

  await prisma.album.delete({ where: { id } });

  await logActivity({
    action: 'DELETE',
    entityType: 'Album',
    entityId: id,
    summary: album.title,
    performedById: user.id,
    performedByName: user.name ?? 'Unknown',
  });

  revalidatePath('/gallery');
  revalidatePath('/dashboard/gallery');
}

export async function setFeaturedAlbumAction(id: string) {
  const user = await requireUser();
  if (!user) return;

  await prisma.$transaction([
    prisma.album.updateMany({ data: { isFeatured: false }, where: { isFeatured: true } }),
    prisma.album.update({ where: { id }, data: { isFeatured: true } }),
  ]);

  revalidatePath('/gallery');
  revalidatePath('/dashboard/gallery');
}

export async function uploadAlbumImageAction(
  albumId: string,
  _prevState: { message?: string } | undefined,
  formData: FormData
): Promise<{ message?: string } | undefined> {
  const user = await requireUser();
  if (!user) return { message: 'You must be signed in to upload images.' };

  const file = formData.get('file');
  if (!(file instanceof File)) return { message: 'Please choose an image file.' };

  const result = await validateAndUploadImage(file, 'albums');
  if ('error' in result) return { message: result.error };

  const image = await prisma.galleryImage.create({
    data: { url: result.url, albumId, uploadedById: user.id },
  });

  // First image uploaded to an album automatically becomes its cover, so
  // an album is never left with no thumbnail after just one upload.
  const album = await prisma.album.findUnique({ where: { id: albumId } });
  if (album && !album.coverImageId) {
    await prisma.album.update({ where: { id: albumId }, data: { coverImageId: image.id } });
  }

  revalidatePath('/gallery');
  revalidatePath(`/gallery/${albumId}`);
  revalidatePath(`/dashboard/gallery/${albumId}`);
  revalidatePath('/dashboard/gallery');
}

export async function deleteAlbumImageAction(imageId: string, url: string, albumId: string) {
  const user = await requireUser();
  if (!user) return;

  await del(url);
  // If this was the album's cover, Prisma's onDelete: SetNull on the
  // coverImage relation automatically clears Album.coverImageId here —
  // no manual cleanup needed.
  await prisma.galleryImage.delete({ where: { id: imageId } });

  revalidatePath('/gallery');
  revalidatePath(`/gallery/${albumId}`);
  revalidatePath(`/dashboard/gallery/${albumId}`);
  revalidatePath('/dashboard/gallery');
}

export async function setCoverImageAction(albumId: string, imageId: string) {
  const user = await requireUser();
  if (!user) return;

  await prisma.album.update({ where: { id: albumId }, data: { coverImageId: imageId } });

  revalidatePath('/gallery');
  revalidatePath(`/gallery/${albumId}`);
  revalidatePath(`/dashboard/gallery/${albumId}`);
}
