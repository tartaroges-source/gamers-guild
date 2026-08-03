import { AnnouncementForm } from '@/components/AnnouncementForm';
import { createAnnouncementAction } from '@/features/announcements/actions';

export default function NewAnnouncementPage() {
  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        New Announcement
      </h1>
      <div className="mt-8">
        <AnnouncementForm action={createAnnouncementAction} submitLabel="Post Announcement" />
      </div>
    </main>
  );
}
