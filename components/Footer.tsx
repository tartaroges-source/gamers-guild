import { Reticle } from '@/components/Reticle';
import { getSiteSettings } from '@/features/settings/queries';

export async function Footer() {
  const settings = await getSiteSettings();

  const socialLinks = [
    { href: settings.discordUrl, label: 'Discord' },
    { href: settings.facebookUrl, label: 'Facebook' },
    { href: settings.instagramUrl, label: 'Instagram' },
  ].filter((link): link is { href: string; label: string } => Boolean(link.href));

  return (
    <footer className="border-guild-green/20 bg-surface mt-auto border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <p className="font-display text-muted flex items-center gap-2 text-sm font-semibold tracking-widest uppercase">
          <Reticle className="text-guild-green h-4 w-4" />
          {settings.clubName} &middot; PNC
        </p>

        <div className="flex flex-col items-center gap-2 sm:items-end">
          {(socialLinks.length > 0 || settings.contactEmail) && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:justify-end">
              {settings.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="text-muted hover:text-guild-green"
                >
                  {settings.contactEmail}
                </a>
              )}
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-guild-green"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
          <p className="text-muted text-xs">
            &copy; {new Date().getFullYear()} {settings.clubName}. All rights reserved.
          </p>
          <p className="text-guild-green/70 font-mono text-[11px] tracking-wider">
            {'// built by NJ Cajada'}
          </p>
        </div>
      </div>
    </footer>
  );
}
