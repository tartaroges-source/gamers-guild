'use server';

import { del } from '@vercel/blob';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { homepageContentSchema } from '@/lib/validation/homepage';
import { validateAndUploadImage, validateAndUploadVideo } from '@/lib/blob';
import { logActivity } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export type HomepageActionState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function updateHomepageContentAction(
  _prevState: HomepageActionState,
  formData: FormData
): Promise<HomepageActionState> {
  const session = await auth();
  if (!session?.user) {
    return { message: 'You must be signed in to edit the homepage.' };
  }

  const parsed = homepageContentSchema.safeParse({
    heroMediaType: formData.get('heroMediaType'),
    heroTagline: formData.get('heroTagline'),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }

  const existing = await prisma.homepageContent.upsert({
    where: { id: 'singleton' },
    create: {},
    update: {},
  });

  let heroImageUrl = existing.heroImageUrl;
  let heroVideoUrl = existing.heroVideoUrl;

  const imageFile = formData.get('heroImage');
  if (imageFile instanceof File && imageFile.size > 0) {
    const result = await validateAndUploadImage(imageFile, 'homepage');
    if ('error' in result) {
      return { message: result.error };
    }
    if (existing.heroImageUrl) await del(existing.heroImageUrl);
    heroImageUrl = result.url;
  }

  const newHeroVideoUrl = formData.get('heroVideoUrl');
if (typeof newHeroVideoUrl === 'string' && newHeroVideoUrl.length > 0) {
  if (existing.heroVideoUrl && existing.heroVideoUrl !== newHeroVideoUrl) {
    await del(existing.heroVideoUrl);
  }
  heroVideoUrl = newHeroVideoUrl;
}

  await prisma.homepageContent.update({
    where: { id: 'singleton' },
    data: {
      heroMediaType: parsed.data.heroMediaType,
      heroTagline: parsed.data.heroTagline || null,
      heroImageUrl,
      heroVideoUrl,
    },
  });

  await logActivity({
    action: 'UPDATE',
    entityType: 'HomepageContent',
    entityId: 'singleton',
    summary: 'Updated homepage hero content',
    performedById: session.user.id,
    performedByName: session.user.name ?? 'Unknown',
  });

  revalidatePath('/');
  revalidatePath('/dashboard/homepage');

  return { success: true, message: 'Homepage updated.' };
}
