'use client';

import { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="border-guild-green/30 bg-background/95 sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3 md:hidden">
        <Link
          href="/dashboard"
          className="font-display text-foreground text-sm font-bold tracking-wide uppercase"
        >
          Gamers&apos; Guild
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-muted hover:text-guild-green text-sm font-semibold uppercase"
        >
          Menu
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside
        className={`border-guild-green/20 bg-surface fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r transition-transform md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
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
                onClick={() => setIsOpen(false)}
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