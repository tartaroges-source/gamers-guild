import Link from 'next/link';
import Image from 'next/image';
import { getAnnouncementsForDashboard } from '@/features/announcements/queries';
import { formatEventDate } from '@/lib/format';
import { deleteAnnouncementAction } from '@/features/announcements/actions';
import { ConfirmButton } from '@/components/ConfirmButton';

export default async function DashboardAnnouncementsPage() {
  const announcements = await getAnnouncementsForDashboard();

  return (
    <main className="p-4 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-foreground text-xl font-bold tracking-wide uppercase sm:text-2xl">
          Announcements
        </h1>
        <Link
          href="/dashboard/announcements/new"
          className="bg-guild-green font-display text-background hover:bg-guild-green-dim rounded-md px-4 py-2.5 text-center text-sm font-bold tracking-wide uppercase sm:py-2"
        >
          + New Announcement
        </Link>
      </div>

      {announcements.length === 0 ? (
        <div className="border-guild-green/20 bg-surface mt-6 flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-12 text-center sm:mt-8">
          <span className="font-display text-guild-green/60 text-3xl">＋</span>
          <p className="text-foreground text-sm font-semibold">No announcements yet</p>
          <p className="text-muted text-xs">Create the first one to let members know what's new.</p>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3 sm:mt-8">
          {announcements.map((announcement) => (
            <li
              key={announcement.id}
              className="border-guild-green/20 bg-surface flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 gap-3">
                {announcement.posterUrl && (
                  <Image
                    src={announcement.posterUrl}
                    alt=""
                    width={64}
                    height={64}
                    className="h-16 w-16 flex-shrink-0 rounded-md object-cover"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-guild-gold font-mono text-xs tracking-widest uppercase">
                    {formatEventDate(announcement.createdAt)}
                  </p>
                  <p className="font-display text-foreground mt-1 font-bold uppercase break-words">
                    {announcement.title}
                  </p>
                  <p className="text-muted mt-0.5 text-xs">
                    Posted by {announcement.createdBy?.name ?? 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/announcements/${announcement.id}/edit`}
                  className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 flex-1 rounded-md border px-3 py-1.5 text-center text-sm sm:flex-none"
                >
                  Edit
                </Link>
                <form action={deleteAnnouncementAction.bind(null, announcement.id)} className="flex-1 sm:flex-none">
                  <ConfirmButton className="w-full rounded-md border border-red-500/40 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10">
                    Delete
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}