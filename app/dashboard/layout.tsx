import { auth } from '@/lib/auth';
import { getPendingApplicationsCount } from '@/features/applications/queries';
import { DashboardSidebar } from '@/components/DashboardSidebar';

const dashboardLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/home', label: 'Home' },
  { href: '/dashboard/events', label: 'Events' },
  { href: '/dashboard/announcements', label: 'Announcements' },
  { href: '/dashboard/gallery', label: 'Gallery' },
  { href: '/dashboard/team', label: 'Team' },
  { href: '/dashboard/about', label: 'About Page' },
  { href: '/dashboard/applications', label: 'Applications' },
  { href: '/dashboard/members', label: 'Members' },
  { href: '/dashboard/activity', label: 'Activity Log' },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [session, pendingCount] = await Promise.all([auth(), getPendingApplicationsCount()]);
  const isAdmin = session?.user?.role === 'ADMIN';

  const links = (
    isAdmin
      ? [
          ...dashboardLinks,
          { href: '/dashboard/officers', label: 'Officers' },
          { href: '/dashboard/settings', label: 'Settings' },
        ]
      : dashboardLinks
  ).map((link) => ({
    ...link,
    badge: link.href === '/dashboard/applications' ? pendingCount : undefined,
  }));

  return (
    <div className="bg-background flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar
        links={links}
        user={{
          name: session?.user?.name,
          email: session?.user?.email,
          role: session?.user?.role,
          image: session?.user?.image,
        }}
      />
      <div className="flex-1 pb-16 md:pb-0">{children}</div>
    </div>
  );
}