import Image from 'next/image';
import { getTeamMemberById } from '@/features/team/queries';
import { Reticle } from '@/components/Reticle';

export default async function VerifyOfficerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const officer = await getTeamMemberById(id);

  return (
    <div className="relative mx-auto flex min-h-[70vh] max-w-md flex-col items-center px-4 py-24 text-center sm:px-6">
      {officer ? (
        <>
          <div className="relative flex h-44 w-44 items-center justify-center">
            <Reticle
              className="animate-reticle-spin text-guild-gold/[0.07] pointer-events-none absolute h-[420px] w-[420px] sm:h-[560px] sm:w-[560px]"
            />
            {officer.photoUrl ? (
              <Image
                src={officer.photoUrl}
                alt={officer.name}
                width={180}
                height={180}
                className="border-guild-gold relative h-44 w-44 rounded-full border-2 object-cover"
              />
            ) : (
              <Reticle className="text-guild-gold relative h-24 w-24" />
            )}
          </div>
          <p className="font-mono text-guild-gold mt-6 text-xs tracking-widest uppercase">
            Verified Officer
          </p>
          <h1 className="font-display text-foreground mt-2 text-2xl font-bold tracking-wide uppercase">
            {officer.name}
          </h1>
          <p className="text-guild-green mt-2 text-lg">{officer.position}</p>
          {officer.committee && <p className="text-muted mt-1 text-sm">{officer.committee}</p>}
        </>
      ) : (
        <>
          <div className="relative flex h-16 w-16 items-center justify-center">
            <Reticle
              className="text-red-400/[0.07] pointer-events-none absolute h-[420px] w-[420px] sm:h-[560px] sm:w-[560px]"
            />
            <Reticle className="relative h-16 w-16 text-red-400" />
          </div>
          <h1 className="font-display text-foreground mt-6 text-2xl font-bold tracking-wide uppercase">
            Not a Valid Officer
          </h1>
          <p className="text-muted mt-3 text-sm">
            This code doesn&apos;t match a current Gamers&apos; Guild officer.
          </p>
        </>
      )}
    </div>
  );
}