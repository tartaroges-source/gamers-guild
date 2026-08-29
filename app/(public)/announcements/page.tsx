import Image from 'next/image';
import { getAnnouncements } from '@/features/announcements/queries';
import { formatEventDate } from '@/lib/format';

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
        <ul className="mt-10 flex flex-col gap-6">
          {announcements.map((announcement) => (
            <li
              key={announcement.id}
              className="border-guild-green/20 bg-surface overflow-hidden rounded-lg border"
            >
              {announcement.posterUrl && (
                <div className="relative h-56 w-full sm:h-72">
                  <Image
                    src={announcement.posterUrl}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <p className="text-guild-gold font-mono text-xs tracking-widest uppercase">
                  {formatEventDate(announcement.createdAt)}
                </p>
                <h2 className="font-display text-foreground mt-1 text-xl font-bold tracking-wide uppercase">
                  {announcement.title}
                </h2>
                <p className="text-muted mt-3 text-sm whitespace-pre-line">{announcement.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}