import { Reticle } from '@/components/Reticle';

export function Footer() {
  return (
    <footer className="border-guild-green/20 bg-surface mt-auto border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <p className="font-display text-muted flex items-center gap-2 text-sm font-semibold tracking-widest uppercase">
          <Reticle className="text-guild-green h-4 w-4" />
          Gamers&apos; Guild &middot; PNC
        </p>

        <div className="flex flex-col items-center gap-1 sm:items-end">
          <p className="text-muted text-xs">
            &copy; {new Date().getFullYear()} Gamers&apos; Guild. All rights reserved.
          </p>
          <p className="text-guild-green/70 font-mono text-[11px] tracking-wider">
            {' powered by NJ Cajada'}
          </p>
        </div>
      </div>
    </footer>
  );
}