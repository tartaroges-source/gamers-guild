import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getSiteSettings } from '@/features/settings/queries';
import { SettingsForm } from '@/components/SettingsForm';

export default async function DashboardSettingsPage() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const settings = await getSiteSettings();

  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        Site Settings
      </h1>
      <p className="text-muted mt-2">Controls what appears in the site footer.</p>
      <div className="mt-8">
        <SettingsForm
          defaultValues={{
            clubName: settings.clubName,
            contactEmail: settings.contactEmail ?? '',
            discordUrl: settings.discordUrl ?? '',
            facebookUrl: settings.facebookUrl ?? '',
            instagramUrl: settings.instagramUrl ?? '',
          }}
        />
      </div>
    </main>
  );
}
