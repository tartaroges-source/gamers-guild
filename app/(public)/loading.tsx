import { Reticle } from '@/components/Reticle';

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Reticle className="text-guild-green h-8 w-8 animate-spin" />
    </div>
  );
}
