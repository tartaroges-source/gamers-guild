'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { createUserSchema, updateUserSchema } from '@/lib/validation/user';
import { logActivity } from '@/lib/audit';
import type { Role } from '@/lib/generated/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export type UserActionState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

// Stricter than our other features' requireUser() — this checks the
// specific role, not just "someone is logged in." Account management is
// Admin-only per our permission matrix.
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return null;
  }
  return session.user;
}

export async function createUserAction(
  _prevState: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  const admin = await requireAdmin();
  if (!admin) {
    return { message: 'Only Admins can create accounts.' };
  }

  const parsed = createUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return {
      errors: { email: ['An account with this email already exists.'] },
      message: 'Please fix the errors below.',
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: passwordHash,
      role: parsed.data.role as Role,
    },
  });

  await logActivity({
    action: 'CREATE',
    entityType: 'User',
    entityId: user.id,
    summary: `${user.name} (${user.role})`,
    performedById: admin.id,
    performedByName: admin.name ?? 'Unknown',
  });

  revalidatePath('/dashboard/officers');
  redirect('/dashboard/officers');
}

export async function updateUserAction(
  id: string,
  _prevState: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  const admin = await requireAdmin();
  if (!admin) {
    return { message: 'Only Admins can edit accounts.' };
  }

  // The self-protection rule: an Admin can't change their own role or
  // reset their own password through this screen. This prevents an
  // accidental self-demotion or self-lockout.
  if (id === admin.id) {
    return { message: 'You cannot edit your own account here — ask another Admin.' };
  }

  const parsed = updateUserSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }

  const data: { name: string; role: Role; password?: string } = {
    name: parsed.data.name,
    role: parsed.data.role as Role,
  };

  if (parsed.data.password) {
    data.password = await bcrypt.hash(parsed.data.password, 12);
  }

  const user = await prisma.user.update({ where: { id }, data });

  await logActivity({
    action: 'UPDATE',
    entityType: 'User',
    entityId: user.id,
    summary: `${user.name} (${user.role})`,
    performedById: admin.id,
    performedByName: admin.name ?? 'Unknown',
  });

  revalidatePath('/dashboard/officers');
  redirect('/dashboard/officers');
}

export async function deleteUserAction(id: string) {
  const admin = await requireAdmin();
  if (!admin) return;

  // Same self-protection rule for deletion — the UI won't even show a
  // delete button for your own row, but this is the real, enforced
  // boundary, not just a hidden button.
  if (id === admin.id) return;

  const user = await prisma.user.delete({ where: { id } });

  await logActivity({
    action: 'DELETE',
    entityType: 'User',
    entityId: id,
    summary: `${user.name} (${user.role})`,
    performedById: admin.id,
    performedByName: admin.name ?? 'Unknown',
  });

  revalidatePath('/dashboard/officers');
}
