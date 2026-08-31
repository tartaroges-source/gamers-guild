import { notFound } from 'next/navigation';
import QRCode from 'qrcode';
import { getMemberById } from '@/features/members/queries';
import { prisma } from '@/lib/db';
import { formatDateOnly } from '@/lib/format';
import { getBaseUrl } from '@/lib/url';
import { MemberIdCardView } from '@/components/MemberIdCardView';

export default async function MemberIdCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getMemberById(id);

  if (!member) {
    notFound();
  }

  const officerAccount = await prisma.user.findUnique({
    where: { email: member.email },
    select: { id: true },
  });

  const isOfficer = Boolean(officerAccount);

  const dateOfIssue = new Date();

  const baseUrl = await getBaseUrl();
  const qrDataUrl = await QRCode.toDataURL(`${baseUrl}/verify/${member.id}`, { width: 500 });

  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        Generate ID &mdash; {member.fullName}
      </h1>
      <p className="text-muted mt-2">
        Review the card below, then download it as a print-ready PDF.
      </p>

      <div className="mt-8">
        <MemberIdCardView
          photoUrl={member.application?.idPictureUrl ?? null}
          ign={member.ign ?? '—'}
          fullName={member.fullName}
          studentId={member.studentId}
          positionLabel={isOfficer ? 'Officer' : 'Member'}
          dateOfBirth={member.dateOfBirth ? formatDateOnly(member.dateOfBirth) : '—'}
          dateOfIssue={formatDateOnly(dateOfIssue)}
          memberSince={String(member.joinedAt.getFullYear())}
          signatureUrl={member.signatureUrl}
          qrDataUrl={qrDataUrl}
        />
      </div>
    </main>
  );
}