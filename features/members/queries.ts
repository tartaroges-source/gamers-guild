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

// Bundles everything the ID card needs: the member's own data, whether
// they also hold a dashboard login (shown as "Officer" vs "Member"), the
// President's name/signature for the back of the card, and the Vision
// text from the About page content.
export async function getMemberIdCardData(id: string) {
  const member = await prisma.member.findUnique({
    where: { id },
    include: { application: { select: { idPictureUrl: true } } },
  });

  if (!member) return null;

  const [officerAccount, president, aboutContent] = await Promise.all([
    prisma.user.findUnique({ where: { email: member.email }, select: { id: true } }),
    prisma.teamMember.findFirst({
      where: { position: 'President' },
      select: { name: true, signatureUrl: true },
    }),
    prisma.aboutContent.findUnique({ where: { id: 'singleton' }, select: { vision: true } }),
  ]);

  return {
    member,
    isOfficer: Boolean(officerAccount),
    president,
    vision: aboutContent?.vision ?? null,
  };
}