import { prisma } from '@/lib/db';

export async function getMembersForDashboard() {
  return prisma.member.findMany({
    orderBy: { joinedAt: 'desc' },
  });
}

// Used by the public /verify/[id] page — deliberately returns everything
// needed to render "valid" or "invalid," nothing more sensitive.
export async function getMemberById(id: string) {
  return prisma.member.findUnique({ where: { id } });
}
