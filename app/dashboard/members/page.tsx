import Link from 'next/link';
import QRCode from 'qrcode';
import { getMembersForDashboard, getDistinctCourses } from '@/features/members/queries';
import { getBaseUrl } from '@/lib/url';
import { formatEventDate } from '@/lib/format';
import { MemberQrCard } from '@/components/MemberQrCard';
import { toggleMemberStatusAction } from '@/features/members/actions';

export default async function DashboardMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; course?: string; status?: string }>;
}) {
  const { search, course, status } = await searchParams;
const [members, baseUrl, courses] = await Promise.all([
  getMembersForDashboard(search, course, status),
  getBaseUrl(),
  getDistinctCourses(),
]);

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
        Search by name, student ID, or course. Click a QR code to preview and download it.
      </p>

      <form method="get" className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          name="search"
          defaultValue={search ?? ''}
          placeholder="Search by name, student ID..."
          className="border-guild-green/30 bg-background text-foreground focus:border-guild-green focus:ring-guild-green min-w-[240px] flex-1 rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
        />
        <select
          name="course"
          defaultValue={course ?? ''}
          className="border-guild-green/30 bg-background text-foreground focus:border-guild-green focus:ring-guild-green rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
  name="status"
  defaultValue={status ?? ''}
  className="border-guild-green/30 bg-background text-foreground focus:border-guild-green focus:ring-guild-green rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
>
  <option value="">All Statuses</option>
  <option value="ACTIVE">Active</option>
  <option value="INACTIVE">Inactive</option>
</select>
        <button
          type="submit"
          className="bg-guild-green font-display text-background hover:bg-guild-green-dim rounded-md px-4 py-2 text-sm font-bold tracking-wide uppercase"
        >
          Filter
        </button>
      </form>

      {membersWithQr.length === 0 ? (
        <p className="text-muted mt-8">No members match your search.</p>
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
                  {member.studentId} &middot; {member.department} &middot; {member.course} &middot;{' '}
                  {member.yearLevel}
                </p>
                <p className="text-muted mt-0.5 text-xs">
                  Member since {formatEventDate(member.joinedAt)}
                </p>
                <form action={toggleMemberStatusAction.bind(null, member.id)} className="mt-1">
                  <button
                    type="submit"
                    className={`font-mono text-xs uppercase underline ${
                      member.status === 'ACTIVE' ? 'text-guild-green' : 'text-red-400'
                    }`}
                  >
                    {member.status} (click to toggle)
                  </button>
                </form>
                <Link
                  href={`/dashboard/members/${member.id}/id-card`}
                  className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 mt-2 inline-block rounded-md border px-2 py-1 text-xs"
                >
                  Generate ID
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}