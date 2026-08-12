import { Reticle } from '@/components/Reticle';

export default function DashboardLoading() {
  return (
    <main className="flex min-h-[50vh] items-center justify-center p-8">
      <Reticle className="text-guild-green h-8 w-8 animate-spin" />
    </main>
  );
}
