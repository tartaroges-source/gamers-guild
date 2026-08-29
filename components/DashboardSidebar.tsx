'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="border-guild-green/30 bg-background/95 sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3 backdrop-blur md:hidden">
        <Link
          href="/dashboard"
          className="font-display text-foreground text-sm font-bold tracking-wide uppercase"
        >
          Gamers&apos; Guild
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
          className="border-guild-green/40 text-guild-green flex h-9 w-9 items-center justify-center rounded-md border"
        >
          {isOpen ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown panel — sits below the top bar, full width */}
      {isOpen && (
        <div className="border-guild-green/20 bg-surface fixed inset-x-0 top-[57px] z-40 flex max-h-[calc(100vh-57px)] flex-col overflow-y-auto border-b md:hidden">
          <nav className="flex flex-col px-3 py-3">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-display mb-1 flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold tracking-widest uppercase transition-colors ${
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
            <Link
              href="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="mb-3 flex items-center gap-3 hover:opacity-80"
            >
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
        </div>
      )}

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