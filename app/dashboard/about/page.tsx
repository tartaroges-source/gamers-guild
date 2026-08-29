import { getAboutContent, getCoreValues } from '@/features/about/queries';
import { AboutContentForm } from '@/components/AboutContentForm';
import { CoreValuesManager } from '@/components/CoreValuesManager';

export default async function DashboardAboutPage() {
  const [content, values] = await Promise.all([getAboutContent(), getCoreValues()]);

  return (
    <main className="p-4 sm:p-8">
      <h1 className="font-display text-foreground text-xl font-bold tracking-wide uppercase sm:text-2xl">
        About Page
      </h1>
      <p className="text-muted mt-2 text-sm sm:text-base">
        Controls the public About Us page content.
      </p>

      <div className="mt-6 sm:mt-8">
        <AboutContentForm
          defaultValues={{
            heroTagline: content.heroTagline ?? '',
            whoWeAre: content.whoWeAre ?? '',
            mission: content.mission ?? '',
            vision: content.vision ?? '',
            whatWeDo: content.whatWeDo ?? '',
            gamingCommunities: content.gamingCommunities ?? '',
            whyJoin: content.whyJoin ?? '',
          }}
          hasHeroImage={Boolean(content.heroImageUrl)}
        />
      </div>

      <h2 className="font-display text-foreground mt-10 text-lg font-bold tracking-wide uppercase sm:mt-12 sm:text-xl">
        Core Values
      </h2>
      <div className="mt-4">
        <CoreValuesManager values={values} />
      </div>
    </main>
  );
}