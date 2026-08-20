import { prisma } from '@/lib/db';

// Pending first, so officers see what actually needs action at the top.
export async function getApplicationsForDashboard() {
  return prisma.membershipApplication.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    include: { reviewedBy: { select: { name: true } } },
  });
}
export async function getPendingApplicationsCount() {
  return prisma.membershipApplication.count({ where: { status: 'PENDING' } });
}
