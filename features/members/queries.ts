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
                { department: { contains: search, mode: 'insensitive' } },
                { course: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        course ? { course } : {},
        status === 'ACTIVE' || status === 'INACTIVE' ? { status } : {},
      ],
    },
    orderBy: { joinedAt: 'desc' },
  });
}

// Used to populate the course filter dropdown with real, distinct values.
export async function getDistinctCourses() {
  const members = await prisma.member.findMany({
    select: { course: true },
    distinct: ['course'],
    orderBy: { course: 'asc' },
  });
  return members.map((m) => m.course);
}

export async function getMemberById(id: string) {
  return prisma.member.findUnique({
    where: { id },
    include: { application: { select: { idPictureUrl: true } } },
  });
}