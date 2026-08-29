'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/announcements', label: 'Announcements' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/apply', label: 'Join' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-guild-green/30 bg-background/95 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-x-6 px-4 py-2 sm:px-6">
        <Link href="/" className="flex items-center gap-3 py-1" onClick={() => setIsOpen(false)}>
          <Image src="/logo.png" alt="Gamers' Guild crest" width={40} height={40} priority />
          <span className="font-display text-foreground text-lg font-bold tracking-wide uppercase">
            Gamers&apos; Guild
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-muted hover:text-guild-green text-sm font-semibold tracking-widest uppercase transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
          className="border-guild-green/40 text-guild-green flex h-10 w-10 items-center justify-center rounded-md border md:hidden"
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

      {isOpen && (
        <nav
          className="border-guild-green/20 bg-background flex flex-col border-t px-4 py-3 md:hidden"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-display text-muted hover:bg-surface hover:text-guild-green rounded-md px-2 py-3 text-sm font-semibold tracking-widest uppercase transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}