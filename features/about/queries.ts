import { prisma } from '@/lib/db';

export async function getAboutContent() {
  return prisma.aboutContent.upsert({
    where: { id: 'singleton' },
    create: {},
    update: {},
  });
}

export async function getCoreValues() {
  return prisma.coreValue.findMany({
    orderBy: [{ order: 'asc' }, { title: 'asc' }],
  });
}
