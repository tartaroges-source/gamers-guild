'use server';

import { put, del } from '@vercel/blob';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export type GalleryActionState =
  | {
      message?: string;
    }
  | undefined;

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session.user;
}

export async function uploadImageAction(
  _prevState: GalleryActionState,
  formData: FormData
): Promise<GalleryActionState> {
  const user = await requireUser();
  if (!user) {
    return { message: 'You must be signed in to upload images.' };
  }

  const file = formData.get('file');
  const caption = formData.get('caption');

  if (!(file instanceof File) || file.size === 0) {
    return { message: 'Please choose an image file.' };
  }

  // Never trust client-side restrictions alone — the <input accept="...">
  // attribute is just a UI hint; a request can always be crafted to skip
  // it. Re-checking type and size here, on the server, is the real
  // security boundary.
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { message: 'Only JPEG, PNG, WebP, or GIF images are allowed.' };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { message: 'Image must be smaller than 5MB.' };
  }

  const blob = await put(`gallery/${crypto.randomUUID()}-${file.name}`, file, {
    access: 'public',
  });

  const image = await prisma.galleryImage.create({
    data: {
      url: blob.url,
      caption: typeof caption === 'string' && caption.trim() ? caption.trim() : null,
      uploadedById: user.id,
    },
  });

  await logActivity({
    action: 'CREATE',
    entityType: 'GalleryImage',
    entityId: image.id,
    summary: image.caption ?? 'Untitled image',
    performedById: user.id,
    performedByName: user.name ?? 'Unknown',
  });

  revalidatePath('/gallery');
  revalidatePath('/dashboard/gallery');
}

export async function deleteImageAction(id: string, url: string) {
  const user = await requireUser();
  if (!user) {
    return;
  }

  // Delete from Blob storage first, then the database record. If we did
  // it the other way around and the Blob delete failed, we'd have an
  // orphaned file taking up storage with nothing pointing to it.
  await del(url);

  await prisma.galleryImage.delete({ where: { id } });

  await logActivity({
    action: 'DELETE',
    entityType: 'GalleryImage',
    entityId: id,
    summary: url,
    performedById: user.id,
    performedByName: user.name ?? 'Unknown',
  });

  revalidatePath('/gallery');
  revalidatePath('/dashboard/gallery');
}