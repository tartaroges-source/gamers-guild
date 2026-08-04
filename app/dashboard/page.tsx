import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getDashboardStats } from '@/features/stats/queries';

export default async function DashboardPage() {
  const [session, stats] = await Promise.all([auth(), getDashboardStats()]);
  const isAdmin = session?.user?.role === 'ADMIN';

  const cards = [
    { label: 'Upcoming Events', value: stats.upcomingEvents, href: '/dashboard/events' },
    { label: 'Announcements', value: stats.totalAnnouncements, href: '/dashboard/announcements' },
    { label: 'Gallery Photos', value: stats.totalGalleryImages, href: '/dashboard/gallery' },
    {
      label: 'Pending Applications',
      value: stats.pendingApplications,
      href: '/dashboard/applications',
    },
    { label: 'Active Members', value: stats.activeMembers, href: '/dashboard/members' },
    ...(isAdmin
      ? [{ label: 'Officer Accounts', value: stats.totalOfficers, href: '/dashboard/officers' }]
      : []),
  ];

  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        Dashboard
      </h1>
      <p className="text-muted mt-2">
        Signed in as {session?.user?.name} ({session?.user?.role})
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="border-guild-green/20 bg-surface hover:border-guild-green rounded-lg border p-6 transition-colors"
          >
            <p className="text-guild-green font-mono text-4xl font-bold">{card.value}</p>
            <p className="text-muted mt-2 text-sm">{card.label}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}