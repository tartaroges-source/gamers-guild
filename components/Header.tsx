import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/announcements', label: 'Announcements' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/apply', label: 'Join' },
];

export function Header() {
  return (
    <header className="border-guild-green/30 bg-background/95 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Gamers' Guild crest" width={40} height={40} priority />
          <span className="font-display text-foreground text-lg font-bold tracking-wide uppercase">
            Gamers&apos; Guild
          </span>
        </Link>

        <nav
          className="flex flex-wrap items-center gap-x-6 gap-y-2"
          aria-label="Primary navigation"
        >
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
      </div>
    </header>
  );
}
