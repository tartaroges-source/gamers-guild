import { FaDiscord, FaFacebook, FaInstagram } from 'react-icons/fa';
import { Reticle } from '@/components/Reticle';
import { getSiteSettings } from '@/features/settings/queries';

const socialIcons = {
  Discord: FaDiscord,
  Facebook: FaFacebook,
  Instagram: FaInstagram,
};

function SocialLink({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-muted hover:text-guild-green transition-colors">
      <Icon className="h-5 w-5" />
    </a>
  );
}

export async function Footer() {
  const settings = await getSiteSettings();

  const socialLinks = [
    { href: settings.discordUrl, label: 'Discord' as const },
    { href: settings.facebookUrl, label: 'Facebook' as const },
    { href: settings.instagramUrl, label: 'Instagram' as const },
  ].filter((link): link is { href: string; label: keyof typeof socialIcons } => Boolean(link.href));

  return (
    <footer className="border-guild-green/20 bg-surface mt-auto border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <p className="font-display text-muted flex items-center gap-2 text-sm font-semibold tracking-widest uppercase">
          <Reticle className="text-guild-green h-4 w-4" />
          {settings.clubName} &middot; PNC
        </p>

        <div className="flex flex-col items-center gap-2 sm:items-end">
          {(socialLinks.length > 0 || settings.contactEmail) && (
            <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end">
              {settings.contactEmail && (
                <a href={`mailto:${settings.contactEmail}`} className="text-muted hover:text-guild-green text-xs">
                  {settings.contactEmail}
                </a>
              )}
              {socialLinks.map((link) => (
                <SocialLink key={link.label} href={link.href} label={link.label} Icon={socialIcons[link.label]} />
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