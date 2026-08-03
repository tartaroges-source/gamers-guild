import { getMemberById } from '@/features/members/queries';
import { formatEventDate } from '@/lib/format';
import { Reticle } from '@/components/Reticle';

export default async function VerifyMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getMemberById(id);
  const isValid = Boolean(member && member.status === 'ACTIVE');

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center sm:px-6">
      <Reticle className={`h-16 w-16 ${isValid ? 'text-guild-green' : 'text-red-400'}`} />

      {isValid && member ? (
        <>
          <h1 className="font-display text-foreground mt-6 text-2xl font-bold tracking-wide uppercase">
            Verified Member
          </h1>
          <p className="text-foreground mt-3 text-lg">{member.fullName}</p>
          <p className="text-muted mt-1 text-sm">Member since {formatEventDate(member.joinedAt)}</p>
        </>
      ) : (
        <>
          <h1 className="font-display text-foreground mt-6 text-2xl font-bold tracking-wide uppercase">
            Not a Valid Member
          </h1>
          <p className="text-muted mt-3 text-sm">
            This code doesn&apos;t match an active Gamers&apos; Guild membership.
          </p>
        </>
      )}
    </div>
  );
}
