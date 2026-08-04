import { prisma } from '@/lib/db';

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: [{ role: 'asc' }, { name: 'asc' }],
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}
