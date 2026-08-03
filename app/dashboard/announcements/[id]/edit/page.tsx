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
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        Edit Announcement
      </h1>
      <div className="mt-8">
        <AnnouncementForm
          action={boundUpdateAction}
          defaultValues={{
            title: announcement.title,
            body: announcement.body,
          }}
          submitLabel="Save Changes"
        />
      </div>
    </main>
  );
}
