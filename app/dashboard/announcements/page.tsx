import Link from 'next/link';
import { getAnnouncementsForDashboard } from '@/features/announcements/queries';
import { formatEventDate } from '@/lib/format';
import { deleteAnnouncementAction } from '@/features/announcements/actions';

export default async function DashboardAnnouncementsPage() {
  const announcements = await getAnnouncementsForDashboard();

  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
          Announcements
        </h1>
        <Link
          href="/dashboard/announcements/new"
          className="bg-guild-green font-display text-background hover:bg-guild-green-dim rounded-md px-4 py-2 text-sm font-bold tracking-wide uppercase"
        >
          + New Announcement
        </Link>
      </div>

      {announcements.length === 0 ? (
        <p className="text-muted mt-8">No announcements yet. Create the first one above.</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {announcements.map((announcement) => (
            <li
              key={announcement.id}
              className="border-guild-green/20 bg-surface flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
            >
              <div>
                <p className="text-guild-gold font-mono text-xs tracking-widest uppercase">
                  {formatEventDate(announcement.createdAt)}
                </p>
                <p className="font-display text-foreground mt-1 font-bold uppercase">
                  {announcement.title}
                </p>
                <p className="text-muted mt-0.5 text-xs">
                  Posted by {announcement.createdBy?.name ?? 'Unknown'}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/announcements/${announcement.id}/edit`}
                  className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 rounded-md border px-3 py-1.5 text-sm"
                >
                  Edit
                </Link>
                <form action={deleteAnnouncementAction.bind(null, announcement.id)}>
                  <button
                    type="submit"
                    className="rounded-md border border-red-500/40 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
