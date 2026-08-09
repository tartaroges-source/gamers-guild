import { getHomepageContent } from '@/features/homepage/queries';
import { HomepageContentForm } from '@/components/HomepageContentForm';

export default async function DashboardHomepagePage() {
  const content = await getHomepageContent();

  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        Homepage
      </h1>
      <p className="text-muted mt-2">Controls the hero section on the public homepage.</p>

      <div className="mt-8">
        <HomepageContentForm
          defaultValues={{
            heroMediaType: content.heroMediaType,
            heroTagline: content.heroTagline ?? '',
          }}
          hasHeroImage={Boolean(content.heroImageUrl)}
          hasHeroVideo={Boolean(content.heroVideoUrl)}
        />
      </div>
    </main>
  );
}
