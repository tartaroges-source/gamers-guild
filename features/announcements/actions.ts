'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { announcementFormSchema } from '@/lib/validation/announcement';
import { logActivity } from '@/lib/audit';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export type AnnouncementActionState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

// Both ADMIN and OFFICER can create, edit, and delete announcements — the
// distinction isn't a permission block, it's that every action gets
// written to the audit log, so deletions in particular stay traceable.
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

  const announcement = await prisma.announcement.create({
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
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

  // Fetch the current state BEFORE overwriting it — this is the "before"
  // half of the audit log entry. Without this, the old values would
  // already be gone by the time we tried to log them.
  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) {
    return { message: 'This announcement no longer exists.' };
  }

  const announcement = await prisma.announcement.update({
    where: { id },
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
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

  revalidatePath('/announcements');
  revalidatePath('/dashboard/announcements');
  redirect('/dashboard/announcements');
}

export async function deleteAnnouncementAction(id: string) {
  const user = await requireUser();
  if (!user) {
    return;
  }

  // Prisma's delete() returns the row as it was right before deletion —
  // that's exactly the "before" snapshot we want for the log.
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

  revalidatePath('/announcements');
  revalidatePath('/dashboard/announcements');
}
