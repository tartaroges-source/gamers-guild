import Link from 'next/link';
import { logoutAction } from '@/features/auth/actions';

const dashboardLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/events', label: 'Events' },
  { href: '/dashboard/announcements', label: 'Announcements' },
  { href: '/dashboard/gallery', label: 'Gallery' },
  { href: '/dashboard/activity', label: 'Activity Log' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <header className="border-guild-green/30 bg-background/95 sticky top-0 z-50 border-b backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <nav
            className="flex flex-wrap items-center gap-x-6 gap-y-2"
            aria-label="Dashboard navigation"
          >
            {dashboardLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-muted hover:text-guild-green text-sm font-semibold tracking-widest uppercase transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <form action={logoutAction}>
            <button
              type="submit"
              className="border-guild-green/30 text-muted hover:bg-surface rounded-md border px-4 py-1.5 text-sm"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}

