import { prisma } from '@/lib/db';

export async function getDashboardStats() {
  const [
    upcomingEvents,
    totalAnnouncements,
    totalGalleryImages,
    pendingApplications,
    activeMembers,
    totalOfficers,
  ] = await Promise.all([
    prisma.event.count({ where: { startsAt: { gte: new Date() } } }),
    prisma.announcement.count(),
    prisma.galleryImage.count(),
    prisma.membershipApplication.count({ where: { status: 'PENDING' } }),
    prisma.member.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count(),
  ]);

  return {
    upcomingEvents,
    totalAnnouncements,
    totalGalleryImages,
    pendingApplications,
    activeMembers,
    totalOfficers,
  };
}
