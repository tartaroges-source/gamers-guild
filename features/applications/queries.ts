import { prisma } from '@/lib/db';

// Pending first, so officers see what actually needs action at the top.
export async function getApplicationsForDashboard() {
  return prisma.membershipApplication.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    include: { reviewedBy: { select: { name: true } } },
  });
}
