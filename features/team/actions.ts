'use server';

import { del } from '@vercel/blob';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { teamMemberFormSchema } from '@/lib/validation/teamMember';
import { validateAndUploadImage } from '@/lib/blob';
import { logActivity } from '@/lib/audit';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export type TeamMemberActionState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

// Same permission level as Events/Announcements — any logged-in
// Admin or Officer can manage the roster, not just whoever created it.
async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session.user;
}

function parseTeamMemberInput(formData: FormData) {
  return teamMemberFormSchema.safeParse({
    name: formData.get('name'),
    position: formData.get('position'),
    committee: formData.get('committee'),
    bio: formData.get('bio'),
    order: formData.get('order'),
  });
}

export async function createTeamMemberAction(
  _prevState: TeamMemberActionState,
  formData: FormData
): Promise<TeamMemberActionState> {
  const user = await requireUser();
  if (!user) {
    return { message: 'You must be signed in to manage the team roster.' };
  }

  const parsed = parseTeamMemberInput(formData);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }

  const photoFile = formData.get('photo');
  let photoUrl: string | null = null;

  if (photoFile instanceof File && photoFile.size > 0) {
    const result = await validateAndUploadImage(photoFile, 'team');
    if ('error' in result) {
      return { message: result.error };
    }
    photoUrl = result.url;
  }

  const member = await prisma.teamMember.create({
    data: {
      name: parsed.data.name,
      position: parsed.data.position,
      committee: parsed.data.committee || null,
      bio: parsed.data.bio || null,
      order: parsed.data.order,
      photoUrl,
      createdById: user.id,
    },
  });

  await logActivity({
    action: 'CREATE',
    entityType: 'TeamMember',
    entityId: member.id,
    summary: `${member.name} (${member.position})`,
    performedById: user.id,
    performedByName: user.name ?? 'Unknown',
  });

  revalidatePath('/about');
  revalidatePath('/dashboard/team');
  redirect('/dashboard/team');
}

export async function updateTeamMemberAction(
  id: string,
  _prevState: TeamMemberActionState,
  formData: FormData
): Promise<TeamMemberActionState> {
  const user = await requireUser();
  if (!user) {
    return { message: 'You must be signed in to manage the team roster.' };
  }

  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    return { message: 'This team member no longer exists.' };
  }

  const parsed = parseTeamMemberInput(formData);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }

  const photoFile = formData.get('photo');
  const removePhoto = formData.get('removePhoto') === 'on';
  let photoUrl = existing.photoUrl;

  if (photoFile instanceof File && photoFile.size > 0) {
    // A new photo was uploaded: replace the old one, cleaning up the
    // orphaned file so Blob storage doesn't quietly accumulate unused
    // images every time someone updates their photo.
    const result = await validateAndUploadImage(photoFile, 'team');
    if ('error' in result) {
      return { message: result.error };
    }
    if (existing.photoUrl) {
      await del(existing.photoUrl);
    }
    photoUrl = result.url;
  } else if (removePhoto && existing.photoUrl) {
    await del(existing.photoUrl);
    photoUrl = null;
  }

  const member = await prisma.teamMember.update({
    where: { id },
    data: {
      name: parsed.data.name,
      position: parsed.data.position,
      committee: parsed.data.committee || null,
      bio: parsed.data.bio || null,
      order: parsed.data.order,
      photoUrl,
    },
  });

  await logActivity({
    action: 'UPDATE',
    entityType: 'TeamMember',
    entityId: member.id,
    summary: `${member.name} (${member.position})`,
    performedById: user.id,
    performedByName: user.name ?? 'Unknown',
  });

  revalidatePath('/about');
  revalidatePath('/dashboard/team');
  redirect('/dashboard/team');
}

export async function deleteTeamMemberAction(id: string) {
  const user = await requireUser();
  if (!user) return;

  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) return;

  if (existing.photoUrl) {
    await del(existing.photoUrl);
  }

  await prisma.teamMember.delete({ where: { id } });

  await logActivity({
    action: 'DELETE',
    entityType: 'TeamMember',
    entityId: id,
    summary: `${existing.name} (${existing.position})`,
    performedById: user.id,
    performedByName: user.name ?? 'Unknown',
  });

  revalidatePath('/about');
  revalidatePath('/dashboard/team');
}