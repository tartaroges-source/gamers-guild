import Image from 'next/image';
import { getMemberById } from '@/features/members/queries';
import { formatEventDate } from '@/lib/format';
import { Reticle } from '@/components/Reticle';

export default async function VerifyMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getMemberById(id);
  const isValid = Boolean(member && member.status === 'ACTIVE');

  return (
    <div className="relative mx-auto flex min-h-[70vh] max-w-md flex-col items-center overflow-hidden px-4 py-24 text-center sm:px-6">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Reticle
          className={`animate-reticle-spin h-[420px] w-[420px] sm:h-[560px] sm:w-[560px] ${
            isValid ? 'text-guild-green/[0.07]' : 'text-red-400/[0.07]'
          }`}
        />
      </div>

      {isValid && member ? (
        <div className="relative">
          {member.application?.idPictureUrl ? (
            <Image
              src={member.application.idPictureUrl}
              alt={member.fullName}
              width={180}
              height={180}
              className="border-guild-green h-44 w-44 rounded-full border-2 object-cover object-top"
            />
          ) : (
            <Reticle className="text-guild-green h-24 w-24" />
          )}
          <h1 className="font-display text-foreground mt-6 text-2xl font-bold tracking-wide uppercase">
            Verified Member
          </h1>
          <p className="text-foreground mt-3 text-lg">{member.fullName}</p>
          <p className="text-muted mt-1 text-sm">Member since {formatEventDate(member.joinedAt)}</p>
        </div>
      ) : (
        <div className="relative">
          <Reticle className="h-16 w-16 text-red-400" />
          <h1 className="font-display text-foreground mt-6 text-2xl font-bold tracking-wide uppercase">
            Not a Valid Member
          </h1>
          <p className="text-muted mt-3 text-sm">
            This code doesn&apos;t match an active Gamers&apos; Guild membership.
          </p>
        </div>
      )}
    </div>
  );
}