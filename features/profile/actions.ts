'use server';

import { del } from '@vercel/blob';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { validateAndUploadImage } from '@/lib/blob';
import { revalidatePath } from 'next/cache';

export type ProfileActionState = { message?: string; success?: boolean } | undefined;

export async function updateOwnAvatarAction(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const session = await auth();
  if (!session?.user) return { message: 'You must be signed in.' };

  const file = formData.get('avatar');
  if (!(file instanceof File) || file.size === 0) {
    return { message: 'Please choose an image.' };
  }

  const result = await validateAndUploadImage(file, 'avatars');
  if ('error' in result) return { message: result.error };

  const existing = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (existing?.avatarUrl) {
    await del(existing.avatarUrl);
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { avatarUrl: result.url },
  });

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/profile');
  return { success: true, message: 'Profile picture updated.' };
}