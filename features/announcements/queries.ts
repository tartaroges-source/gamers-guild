import { prisma } from "@/lib/db";

// Public site: all announcements, most recent first.
export async function getAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// Dashboard: same order, but includes who posted each one.
export async function getAnnouncementsForDashboard() {
  return prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { name: true } } },
  });
}

export async function getAnnouncementById(id: string) {
  return prisma.announcement.findUnique({ where: { id } });
}