import { prisma } from '@/lib/db';

// upsert against a fixed id means: create the row with defaults on the
// very first call, return the existing row every time after — always
// exactly one settings record, no separate "does it exist yet" check.
export async function getSiteSettings() {
  return prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    create: {},
    update: {},
  });
}
