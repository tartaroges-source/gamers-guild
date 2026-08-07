import { prisma } from '@/lib/db';
import { sortTeamMembers } from '@/lib/teamHierarchy';

// Executive Board hierarchy can't be expressed as a simple database
// ORDER BY (it's a fixed, arbitrary rank list, not a sortable column), so
// we fetch everything and apply the hierarchy-aware sort in JavaScript.
// Fine at our scale — a handful of team members, not thousands.
export async function getTeamMembers() {
  const members = await prisma.teamMember.findMany();
  return sortTeamMembers(members);
}

export async function getTeamMembersForDashboard() {
  const members = await prisma.teamMember.findMany({
    include: { createdBy: { select: { name: true } } },
  });
  return sortTeamMembers(members);
}

export async function getTeamMemberById(id: string) {
  return prisma.teamMember.findUnique({ where: { id } });
}