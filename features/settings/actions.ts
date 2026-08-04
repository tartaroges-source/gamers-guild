'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { siteSettingsSchema } from '@/lib/validation/settings';
import { logActivity } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export type SettingsActionState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function updateSiteSettingsAction(
  _prevState: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { message: 'Only Admins can change site settings.' };
  }

  const parsed = siteSettingsSchema.safeParse({
    clubName: formData.get('clubName'),
    contactEmail: formData.get('contactEmail'),
    discordUrl: formData.get('discordUrl'),
    facebookUrl: formData.get('facebookUrl'),
    instagramUrl: formData.get('instagramUrl'),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }

  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', ...parsed.data },
    update: parsed.data,
  });

  await logActivity({
    action: 'UPDATE',
    entityType: 'SiteSettings',
    entityId: 'singleton',
    summary: 'Updated site settings',
    performedById: session.user.id,
    performedByName: session.user.name ?? 'Unknown',
  });

  // The footer (which shows these settings) is rendered by the shared
  // public layout on every public page. The "layout" option here
  // invalidates that shared layout across the whole route tree, not just
  // one page — otherwise other public pages would keep showing stale data.
  revalidatePath('/', 'layout');
  revalidatePath('/dashboard/settings');

  return { success: true, message: 'Settings updated.' };
}
