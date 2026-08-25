import { prisma } from '@/lib/db';

export async function getMembersForDashboard(search?: string, course?: string, status?: string) {
  return prisma.member.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { fullName: { contains: search, mode: 'insensitive' } },
                { studentId: { contains: search, mode: 'insensitive' } },
                { courseYear: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        course ? { courseYear: course } : {},
        status === 'ACTIVE' || status === 'INACTIVE' ? { status } : {},
      ],
    },
    orderBy: { joinedAt: 'desc' },
  });
}

// Used to populate the course filter dropdown with real, distinct values.
export async function getDistinctCourses() {
  const members = await prisma.member.findMany({
    select: { courseYear: true },
    distinct: ['courseYear'],
    orderBy: { courseYear: 'asc' },
  });
  return members.map((m) => m.courseYear);
}

export async function getMemberById(id: string) {
  return prisma.member.findUnique({ where: { id } });
}