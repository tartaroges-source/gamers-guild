'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { announcementFormSchema } from '@/lib/validation/announcement';
import { logActivity } from '@/lib/audit';
import { validateAndUploadImage } from '@/lib/blob';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export type AnnouncementActionState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session.user;
}

function parseAnnouncementInput(formData: FormData) {
  return announcementFormSchema.safeParse({
    title: formData.get('title'),
    body: formData.get('body'),
  });
}

export async function createAnnouncementAction(
  _prevState: AnnouncementActionState,
  formData: FormData
): Promise<AnnouncementActionState> {
  const user = await requireUser();
  if (!user) {
    return { message: 'You must be signed in to post announcements.' };
  }

  const parsed = parseAnnouncementInput(formData);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }

  // Poster is optional — only upload if a file was actually chosen.
  let posterUrl: string | null = null;
  const posterFile = formData.get('poster');
  if (posterFile instanceof File && posterFile.size > 0) {
    const result = await validateAndUploadImage(posterFile, 'announcement-posters');
    if ('error' in result) {
      return { message: result.error };
    }
    posterUrl = result.url;
  }

  const announcement = await prisma.announcement.create({
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      posterUrl,
      createdById: user.id,
    },
  });

  await logActivity({
    action: 'CREATE',
    entityType: 'Announcement',
    entityId: announcement.id,
    summary: announcement.title,
    performedById: user.id,
    performedByName: user.name ?? 'Unknown',
    newData: { title: announcement.title, body: announcement.body },
  });

  revalidatePath('/');
  revalidatePath('/announcements');
  revalidatePath('/dashboard/announcements');
  redirect('/dashboard/announcements');
}

export async function updateAnnouncementAction(
  id: string,
  _prevState: AnnouncementActionState,
  formData: FormData
): Promise<AnnouncementActionState> {
  const user = await requireUser();
  if (!user) {
    return { message: 'You must be signed in to edit announcements.' };
  }

  const parsed = parseAnnouncementInput(formData);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }

  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) {
    return { message: 'This announcement no longer exists.' };
  }

  // Poster handling: a new upload replaces the current poster; checking
  // "Remove current poster" with no new file clears it; otherwise the
  // existing poster (if any) is left untouched.
  let posterUrl: string | null | undefined = undefined;
  const posterFile = formData.get('poster');
  if (posterFile instanceof File && posterFile.size > 0) {
    const result = await validateAndUploadImage(posterFile, 'announcement-posters');
    if ('error' in result) {
      return { message: result.error };
    }
    posterUrl = result.url;
  } else if (formData.get('removePoster') === 'on') {
    posterUrl = null;
  }

  const announcement = await prisma.announcement.update({
    where: { id },
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      ...(posterUrl !== undefined ? { posterUrl } : {}),
    },
  });

  await logActivity({
    action: 'UPDATE',
    entityType: 'Announcement',
    entityId: announcement.id,
    summary: announcement.title,
    performedById: user.id,
    performedByName: user.name ?? 'Unknown',
    previousData: { title: existing.title, body: existing.body },
    newData: { title: announcement.title, body: announcement.body },
  });

  revalidatePath('/');
  revalidatePath('/announcements');
  revalidatePath('/dashboard/announcements');
  redirect('/dashboard/announcements');
}

export async function deleteAnnouncementAction(id: string) {
  const user = await requireUser();
  if (!user) {
    return;
  }

  const announcement = await prisma.announcement.delete({ where: { id } });

  await logActivity({
    action: 'DELETE',
    entityType: 'Announcement',
    entityId: id,
    summary: announcement.title,
    performedById: user.id,
    performedByName: user.name ?? 'Unknown',
    previousData: { title: announcement.title, body: announcement.body },
  });

  revalidatePath('/');
  revalidatePath('/announcements');
  revalidatePath('/dashboard/announcements');
}