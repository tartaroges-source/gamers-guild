import Image from 'next/image';
import { getTeamMemberById } from '@/features/team/queries';
import { Reticle } from '@/components/Reticle';

export default async function VerifyOfficerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const officer = await getTeamMemberById(id);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center sm:px-6">
      {officer ? (
        <>
          {officer.photoUrl ? (
            <Image
              src={officer.photoUrl}
              alt={officer.name}
              width={120}
              height={120}
              className="border-guild-gold h-28 w-28 rounded-full border-2 object-cover"
            />
          ) : (
            <Reticle className="text-guild-gold h-16 w-16" />
          )}
          <p className="font-mono text-guild-gold mt-4 text-xs tracking-widest uppercase">
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
          <Reticle className="h-16 w-16 text-red-400" />
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