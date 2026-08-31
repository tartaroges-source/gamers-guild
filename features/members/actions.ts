'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

async function requireUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user;
}

export async function toggleMemberStatusAction(id: string) {
  const user = await requireUser();
  if (!user) return;

  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) return;

  const newStatus = member.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

  await prisma.member.update({ where: { id }, data: { status: newStatus } });

  await logActivity({
    action: 'UPDATE',
    entityType: 'Member',
    entityId: id,
    summary: `${member.fullName} set to ${newStatus}`,
    performedById: user.id,
    performedByName: user.name ?? 'Unknown',
  });

  revalidatePath('/dashboard/members');
  revalidatePath(`/verify/${id}`);
}

// Date of birth isn't collected on the public application form — it's
// filled in by an officer directly on the Members page, typically right
// before generating that member's ID card.
export async function updateMemberDobAction(id: string, formData: FormData) {
  const user = await requireUser();
  if (!user) return;

  const raw = formData.get('dateOfBirth');
  if (typeof raw !== 'string' || raw.trim() === '') return;

  const dateOfBirth = new Date(raw);
  if (Number.isNaN(dateOfBirth.getTime())) return;

  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) return;

  await prisma.member.update({ where: { id }, data: { dateOfBirth } });

  await logActivity({
    action: 'UPDATE',
    entityType: 'Member',
    entityId: id,
    summary: `${member.fullName} date of birth set`,
    performedById: user.id,
    performedByName: user.name ?? 'Unknown',
  });

  revalidatePath('/dashboard/members');
}