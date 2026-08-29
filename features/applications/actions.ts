'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { applicationFormSchema } from '@/lib/validation/application';
import { logActivity } from '@/lib/audit';
import { validateAndUploadImage } from '@/lib/blob';
import { revalidatePath } from 'next/cache';

export type ApplicationActionState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
      success?: boolean;
    }
  | undefined;

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session.user;
}

// Public, unauthenticated — anyone can apply. No audit log entry here,
// since logActivity requires a signed-in performer; the applicant isn't
// a staff account, they're a visitor filling out a form.
export async function submitApplicationAction(
  _prevState: ApplicationActionState,
  formData: FormData
): Promise<ApplicationActionState> {
  const parsed = applicationFormSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    studentId: formData.get('studentId'),
    department: formData.get('department'),
    course: formData.get('course'),
    yearLevel: formData.get('yearLevel'),
    gamesPlayed: formData.get('gamesPlayed'),
    message: formData.get('message'),
    paymentMethod: formData.get('paymentMethod'),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }

  try {
    const existingPending = await prisma.membershipApplication.findFirst({
      where: {
        status: 'PENDING',
        OR: [{ email: parsed.data.email }, { studentId: parsed.data.studentId }],
      },
    });

    if (existingPending) {
      return {
        message:
          'You already have a pending application under this email or student ID. Please wait for it to be reviewed before submitting again.',
      };
    }

    const existingMember = await prisma.member.findFirst({
      where: {
        OR: [{ email: parsed.data.email }, { studentId: parsed.data.studentId }],
      },
    });

    if (existingMember) {
      return {
        message: 'This email or student ID is already registered to an existing member.',
      };
    }

    const idPictureFile = formData.get('idPicture');
    if (!(idPictureFile instanceof File) || idPictureFile.size === 0) {
      return { message: 'Please upload and crop your 2x2 ID picture.' };
    }

    const idUploadResult = await validateAndUploadImage(idPictureFile, 'id-pictures');
    if ('error' in idUploadResult) {
      return { message: idUploadResult.error };
    }

    let paymentProofUrl: string | null = null;
    if (parsed.data.paymentMethod === 'ONLINE') {
      const proofFile = formData.get('paymentProof');
      if (!(proofFile instanceof File) || proofFile.size === 0) {
        return { message: 'Please upload a clear photo of your payment receipt.' };
      }
      const proofResult = await validateAndUploadImage(proofFile, 'payment-proofs');
      if ('error' in proofResult) {
        return { message: proofResult.error };
      }
      paymentProofUrl = proofResult.url;
    }

    await prisma.membershipApplication.create({
      data: { ...parsed.data, idPictureUrl: idUploadResult.url, paymentProofUrl },
    });

    return { success: true };
  } catch (error) {
    console.error('Application submission failed:', error);
    return {
      message: 'Something went wrong submitting your application. Please try again in a moment.',
    };
  }
}

export async function approveApplicationAction(id: string) {
  const user = await requireUser();
  if (!user) return;

  const application = await prisma.membershipApplication.findUnique({ where: { id } });
  // Guard against double-processing (e.g. a double-click, or two officers
  // reviewing the same queue at once) — only act on a still-pending one.
  if (!application || application.status !== 'PENDING') return;

  // Both writes need to succeed together: an application marked APPROVED
  // with no corresponding Member record would be a broken, confusing
  // state. $transaction guarantees they succeed or fail as one unit.
  await prisma.$transaction([
    prisma.membershipApplication.update({
      where: { id },
      data: {
        status: 'APPROVED',
        reviewedById: user.id,
        reviewedAt: new Date(),
      },
    }),
    prisma.member.create({
      data: {
        fullName: application.fullName,
        email: application.email,
        studentId: application.studentId,
        department: application.department,
        course: application.course,
        yearLevel: application.yearLevel,
        applicationId: application.id,
      },
    }),
  ]);

  await logActivity({
    action: 'UPDATE',
    entityType: 'MembershipApplication',
    entityId: id,
    summary: `Approved application from ${application.fullName}`,
    performedById: user.id,
    performedByName: user.name ?? 'Unknown',
  });

  revalidatePath('/dashboard/applications');
  revalidatePath('/dashboard/members');
}

export async function rejectApplicationAction(id: string) {
  const user = await requireUser();
  if (!user) return;

  const application = await prisma.membershipApplication.findUnique({ where: { id } });
  if (!application || application.status !== 'PENDING') return;

  await prisma.membershipApplication.update({
    where: { id },
    data: {
      status: 'REJECTED',
      reviewedById: user.id,
      reviewedAt: new Date(),
    },
  });

  await logActivity({
    action: 'UPDATE',
    entityType: 'MembershipApplication',
    entityId: id,
    summary: `Rejected application from ${application.fullName}`,
    performedById: user.id,
    performedByName: user.name ?? 'Unknown',
  });

  revalidatePath('/dashboard/applications');
}