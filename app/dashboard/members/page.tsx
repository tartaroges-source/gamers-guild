import QRCode from 'qrcode';
import { getMembersForDashboard } from '@/features/members/queries';
import { getBaseUrl } from '@/lib/url';
import { formatEventDate } from '@/lib/format';
import { MemberQrCard } from '@/components/MemberQrCard';

export default async function DashboardMembersPage() {
  const [members, baseUrl] = await Promise.all([getMembersForDashboard(), getBaseUrl()]);

  const membersWithQr = await Promise.all(
    members.map(async (member) => ({
      ...member,
      qrDataUrl: await QRCode.toDataURL(`${baseUrl}/verify/${member.id}`, { width: 500 }),
    }))
  );

  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        Members
      </h1>
      <p className="text-muted mt-2">
        Each member has a unique QR code. Click a code to preview and download it. Scanning it
        confirms their membership without needing a login.
      </p>

      {membersWithQr.length === 0 ? (
        <p className="text-muted mt-8">No approved members yet.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {membersWithQr.map((member) => (
            <div
              key={member.id}
              className="border-guild-green/20 bg-surface flex items-center gap-4 rounded-lg border p-4"
            >
              <MemberQrCard
                fullName={member.fullName}
                qrDataUrl={member.qrDataUrl}
                fileName={`${member.fullName.replace(/\s+/g, '-')}-qr.png`}
              />
              <div>
                <p className="font-display text-foreground font-bold uppercase">
                  {member.fullName}
                </p>
                <p className="text-muted mt-0.5 text-xs">
                  Member since {formatEventDate(member.joinedAt)}
                </p>
                <p
                  className={`mt-1 font-mono text-xs uppercase ${
                    member.status === 'ACTIVE' ? 'text-guild-green' : 'text-red-400'
                  }`}
                >
                  {member.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}