'use server';

import { del } from '@vercel/blob';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { validateAndUploadImage } from '@/lib/blob';
import { revalidatePath } from 'next/cache';
import bcrypt from "bcryptjs";
import { changePasswordSchema } from "@/lib/validation/user";

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



export async function changeOwnPasswordAction(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const session = await auth();
  if (!session?.user) return { message: "You must be signed in." };

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { message: parsed.error.issues[0]?.message ?? "Please fix the errors below." };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { message: "Account not found." };

  const passwordsMatch = await bcrypt.compare(parsed.data.currentPassword, user.password);
  if (!passwordsMatch) {
    return { message: "Current password is incorrect." };
  }

  const newHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password: newHash } });

  return { success: true, message: "Password updated successfully." };
}