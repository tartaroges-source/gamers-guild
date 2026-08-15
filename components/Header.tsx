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
  return (
    <header className="border-guild-green/30 bg-background/95 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-2 sm:px-6">
        <Link href="/" className="flex items-center gap-3 py-1">
          <Image
            src="/logo.png"
            alt="Gamers' Guild crest"
            width={112}
            height={112}
            priority
            className="h-14 w-14 object-contain sm:h-16 sm:w-16"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-foreground text-lg font-bold tracking-wide uppercase sm:text-xl">
              Gamers&apos; Guild
            </span>
            <span className="text-guild-gold font-mono text-[10px] tracking-[0.2em] uppercase">
              PNC
            </span>
          </div>
        </Link>

        <nav
          className="flex flex-wrap items-center gap-x-6 gap-y-2"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-muted hover:text-guild-green relative text-sm font-semibold tracking-widest uppercase transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-guild-green after:transition-all after:content-[''] hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}