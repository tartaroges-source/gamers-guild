import { notFound } from 'next/navigation';
import { AnnouncementForm } from '@/components/AnnouncementForm';
import { getAnnouncementById } from '@/features/announcements/queries';
import { updateAnnouncementAction } from '@/features/announcements/actions';

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const announcement = await getAnnouncementById(id);

  if (!announcement) {
    notFound();
  }

  const boundUpdateAction = updateAnnouncementAction.bind(null, announcement.id);

  return (
    <main className="p-4 sm:p-8">
      <h1 className="font-display text-foreground text-xl font-bold tracking-wide uppercase sm:text-2xl">
        Edit Announcement
      </h1>
      <div className="mt-6 sm:mt-8">
        <AnnouncementForm
          action={boundUpdateAction}
          defaultValues={{
            title: announcement.title,
            body: announcement.body,
          }}
          posterUrl={announcement.posterUrl}
          submitLabel="Save Changes"
        />
      </div>
    </main>
  );
}