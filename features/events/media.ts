'use server';

import { del } from '@vercel/blob';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { validateAndUploadImage, validateAndUploadVideo } from '@/lib/blob';
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

export async function uploadEventMediaAction(
  eventId: string,
  _prevState: EventMediaActionState,
  formData: FormData
): Promise<EventMediaActionState> {
  const user = await requireUser();
  if (!user) {
    return { message: 'You must be signed in to upload event media.' };
  }

  const files = formData.getAll('files').filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) {
    return { message: 'Please choose at least one file.' };
  }

  const existingCount = await prisma.eventMedia.count({ where: { eventId } });

  for (const [index, file] of files.entries()) {
    const isVideo = file.type.startsWith('video/');
    const result = isVideo
      ? await validateAndUploadVideo(file, 'events')
      : await validateAndUploadImage(file, 'events');

    if ('error' in result) {
      // Stop on the first bad file rather than silently skipping it —
      // the officer should know exactly which upload failed and why.
      return { message: `"${file.name}": ${result.error}` };
    }

    await prisma.eventMedia.create({
      data: {
        eventId,
        url: result.url,
        type: isVideo ? 'VIDEO' : 'IMAGE',
        order: existingCount + index,
      },
    });
  }

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
