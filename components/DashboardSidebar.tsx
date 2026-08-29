'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/features/auth/actions';
import { ConfirmButton } from '@/components/ConfirmButton';

type NavLink = { href: string; label: string; badge?: number };

type DashboardSidebarProps = {
  links: NavLink[];
  user: { name?: string | null; email?: string | null; role?: string; image?: string | null };
};

export function DashboardSidebar({ links, user }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile top bar — logo + profile/logout, no toggle needed anymore */}
      <div className="border-guild-green/30 bg-background/95 sticky top-0 z-40 flex items-center justify-between border-b px-4 py-2.5 backdrop-blur md:hidden">
        <Link
          href="/dashboard"
          className="font-display text-foreground text-sm font-bold tracking-wide uppercase"
        >
          Gamers&apos; Guild
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/profile" className="flex items-center gap-2 hover:opacity-80">
            {user.image ? (
              <Image
                src={user.image}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <div className="bg-surface text-guild-green font-display flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold">
                {user.name?.charAt(0) ?? '?'}
              </div>
            )}
          </Link>
          <form action={logoutAction}>
            <ConfirmButton
              confirmMessage="Sign out of your account?"
              className="text-muted hover:text-guild-green text-[11px] font-semibold uppercase"
            >
              Sign Out
            </ConfirmButton>
          </form>
        </div>
      </div>

      {/* Mobile bottom tab bar — replaces the sidebar entirely on small screens */}
      <nav
        aria-label="Dashboard navigation"
        className="border-guild-green/20 bg-surface fixed inset-x-0 bottom-0 z-40 flex overflow-x-auto border-t pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-display relative flex min-h-[60px] min-w-[80px] flex-1 flex-col items-center justify-center gap-1 px-2 py-3 text-center text-[11px] font-semibold tracking-wide uppercase transition-colors active:bg-background ${
                isActive ? 'text-guild-green' : 'text-muted'
              }`}
            >
              {!!link.badge && (
                <span className="bg-guild-gold text-background absolute top-1.5 right-3 rounded-full px-1 py-0.5 text-[9px] font-bold leading-none">
                  {link.badge}
                </span>
              )}
              <span className="leading-tight">{link.label}</span>
              {isActive && <span className="bg-guild-green absolute inset-x-3 -bottom-px h-0.5 rounded-full" />}
            </Link>
          );
        })}
      </nav>

      {/* Desktop sidebar — unchanged, still a static left column */}
      <aside className="border-guild-green/20 bg-surface z-50 hidden w-64 flex-col border-r md:static md:flex">
        <div className="border-guild-green/20 flex items-center gap-2 border-b px-5 py-4">
          <Image src="/logo.png" alt="" width={32} height={32} />
          <span className="font-display text-foreground text-sm font-bold tracking-wide uppercase">
            Gamers&apos; Guild
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-display mb-1 flex items-center justify-between rounded-md px-3 py-2 text-sm font-semibold tracking-widest uppercase transition-colors ${
                  isActive
                    ? 'bg-guild-green/15 text-guild-green'
                    : 'text-muted hover:bg-background hover:text-guild-green'
                }`}
              >
                {link.label}
                {!!link.badge && (
                  <span className="bg-guild-gold text-background rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-guild-green/20 border-t p-4">
          <Link href="/dashboard/profile" className="mb-3 flex items-center gap-3 hover:opacity-80">
            {user.image ? (
              <Image
                src={user.image}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="bg-background text-guild-green font-display flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold">
                {user.name?.charAt(0) ?? '?'}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-foreground truncate text-sm font-semibold">{user.name}</p>
              <p className="text-muted text-xs">{user.role}</p>
            </div>
          </Link>
          <form action={logoutAction}>
            <ConfirmButton
              confirmMessage="Sign out of your account?"
              className="border-guild-green/30 text-muted hover:bg-background w-full rounded-md border px-3 py-2 text-sm"
            >
              Sign Out
            </ConfirmButton>
          </form>
        </div>
      </aside>
    </>
  );
}