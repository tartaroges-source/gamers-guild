import { getAnnouncements } from '@/features/announcements/queries';
import { AnnouncementGallery } from '@/components/AnnouncementGallery';

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-foreground text-4xl font-bold tracking-wide uppercase">
        Announcements
      </h1>
      <p className="text-muted mt-2">News and updates from the guild.</p>

      {announcements.length === 0 ? (
        <p className="text-muted mt-10">No announcements yet — check back soon.</p>
      ) : (
        <AnnouncementGallery announcements={announcements} variant="list" />
      )}
    </div>
  );
}