'use server';

import { del } from '@vercel/blob';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export type EventMediaActionState =
  | {
      message?: string;
    }
  | undefined;

async function requireUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user;
}

// Called from the client after each file has already been uploaded
// directly to Vercel Blob — this just records the resulting URLs, so the
// payload here is tiny regardless of how large the actual video files were.
export async function attachEventMediaAction(
  eventId: string,
  items: { url: string; type: 'IMAGE' | 'VIDEO' }[]
): Promise<EventMediaActionState> {
  const user = await requireUser();
  if (!user) {
    return { message: 'You must be signed in to upload event media.' };
  }

  if (items.length === 0) {
    return { message: 'No files were uploaded.' };
  }

  const existingCount = await prisma.eventMedia.count({ where: { eventId } });

  await prisma.eventMedia.createMany({
    data: items.map((item, index) => ({
      eventId,
      url: item.url,
      type: item.type,
      order: existingCount + index,
    })),
  });

  revalidatePath('/events');
  revalidatePath(`/events/${eventId}`);
  revalidatePath('/dashboard/events');
  revalidatePath(`/dashboard/events/${eventId}/media`);
}

export async function deleteEventMediaAction(id: string, url: string, eventId: string) {
  const user = await requireUser();
  if (!user) return;

  await del(url);
  await prisma.eventMedia.delete({ where: { id } });

  revalidatePath('/events');
  revalidatePath(`/events/${eventId}`);
  revalidatePath(`/dashboard/events/${eventId}/media`);
}

export async function moveEventMediaAction(
  eventId: string,
  currentId: string,
  direction: 'up' | 'down'
) {
  const user = await requireUser();
  if (!user) return;

  const media = await prisma.eventMedia.findMany({
    where: { eventId },
    orderBy: { order: 'asc' },
  });

  const index = media.findIndex((m) => m.id === currentId);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= media.length) return;

  const current = media[index];
  const swapWith = media[swapIndex];

  await prisma.$transaction([
    prisma.eventMedia.update({ where: { id: current.id }, data: { order: swapWith.order } }),
    prisma.eventMedia.update({ where: { id: swapWith.id }, data: { order: current.order } }),
  ]);

  revalidatePath(`/events/${eventId}`);
  revalidatePath(`/dashboard/events/${eventId}/media`);
}

export async function setFeaturedEventAction(id: string) {
  const user = await requireUser();
  if (!user) return;

  await prisma.$transaction([
    prisma.event.updateMany({ data: { isFeatured: false }, where: { isFeatured: true } }),
    prisma.event.update({ where: { id }, data: { isFeatured: true } }),
  ]);

  revalidatePath('/');
  revalidatePath('/dashboard/events');
}