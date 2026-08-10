import { prisma } from '@/lib/db';

// Public site: only events happening now or in the future, soonest first.
export async function getUpcomingEvents() {
  return prisma.event.findMany({
    where: { startsAt: { gte: new Date() } },
    orderBy: { startsAt: 'asc' },
    include: { media: { orderBy: { order: 'asc' }, take: 1 } },
  });
}

// Dashboard: every event regardless of date, most recent first — officers
// managing the calendar need to see past events too, not just what's next.
export async function getAllEvents() {
  return prisma.event.findMany({
    orderBy: { startsAt: 'desc' },
    include: { createdBy: { select: { name: true } } },
  });
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: { media: { orderBy: { order: 'asc' } } },
  });
}

// Homepage: prefer a manually-flagged featured event; fall back to
// whichever upcoming event is soonest if none is flagged.
export async function getFeaturedEventForHomepage() {
  const manuallyFeatured = await prisma.event.findFirst({
    where: { isFeatured: true, startsAt: { gte: new Date() } },
    include: { media: { orderBy: { order: 'asc' }, take: 1 } },
  });
  if (manuallyFeatured) return manuallyFeatured;

  return prisma.event.findFirst({
    where: { startsAt: { gte: new Date() } },
    orderBy: { startsAt: 'asc' },
    include: { media: { orderBy: { order: 'asc' }, take: 1 } },
  });
}
