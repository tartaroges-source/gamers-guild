'use server';

import { del } from '@vercel/blob';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { aboutContentSchema, coreValueSchema } from '@/lib/validation/about';
import { validateAndUploadImage } from '@/lib/blob';
import { logActivity } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export type AboutActionState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
      success?: boolean;
    }
  | undefined;

async function requireUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user;
}

export async function updateAboutContentAction(
  _prevState: AboutActionState,
  formData: FormData
): Promise<AboutActionState> {
  const user = await requireUser();
  if (!user) {
    return { message: 'You must be signed in to edit About page content.' };
  }

  const parsed = aboutContentSchema.safeParse({
    heroTagline: formData.get('heroTagline'),
    whoWeAre: formData.get('whoWeAre'),
    mission: formData.get('mission'),
    vision: formData.get('vision'),
    whatWeDo: formData.get('whatWeDo'),
    gamingCommunities: formData.get('gamingCommunities'),
    whyJoin: formData.get('whyJoin'),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }

  const existing = await prisma.aboutContent.upsert({
    where: { id: 'singleton' },
    create: {},
    update: {},
  });

  const heroImageFile = formData.get('heroImage');
  let heroImageUrl = existing.heroImageUrl;

  if (heroImageFile instanceof File && heroImageFile.size > 0) {
    const result = await validateAndUploadImage(heroImageFile, 'about');
    if ('error' in result) {
      return { message: result.error };
    }
    if (existing.heroImageUrl) {
      await del(existing.heroImageUrl);
    }
    heroImageUrl = result.url;
  }

  await prisma.aboutContent.update({
    where: { id: 'singleton' },
    data: { ...parsed.data, heroImageUrl },
  });

  await logActivity({
    action: 'UPDATE',
    entityType: 'AboutContent',
    entityId: 'singleton',
    summary: 'Updated About page content',
    performedById: user.id,
    performedByName: user.name ?? 'Unknown',
  });

  revalidatePath('/about');
  revalidatePath('/dashboard/about');

  return { success: true, message: 'About page updated.' };
}

export async function createCoreValueAction(
  _prevState: AboutActionState,
  formData: FormData
): Promise<AboutActionState> {
  const user = await requireUser();
  if (!user) {
    return { message: 'You must be signed in to manage core values.' };
  }

  const parsed = coreValueSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }

  const value = await prisma.coreValue.create({ data: parsed.data });

  await logActivity({
    action: 'CREATE',
    entityType: 'CoreValue',
    entityId: value.id,
    summary: value.title,
    performedById: user.id,
    performedByName: user.name ?? 'Unknown',
  });

  revalidatePath('/about');
  revalidatePath('/dashboard/about');

  return { success: true };
}

export async function deleteCoreValueAction(id: string) {
  const user = await requireUser();
  if (!user) return;

  const value = await prisma.coreValue.delete({ where: { id } });

  await logActivity({
    action: 'DELETE',
    entityType: 'CoreValue',
    entityId: id,
    summary: value.title,
    performedById: user.id,
    performedByName: user.name ?? 'Unknown',
  });

  revalidatePath('/about');
  revalidatePath('/dashboard/about');
}
