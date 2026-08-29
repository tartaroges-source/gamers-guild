import Image from 'next/image';
import { getApplicationsForDashboard } from '@/features/applications/queries';
import { approveApplicationAction, rejectApplicationAction } from '@/features/applications/actions';
import { formatEventDate } from '@/lib/format';

const statusStyles: Record<string, string> = {
  PENDING: 'text-guild-gold',
  APPROVED: 'text-guild-green',
  REJECTED: 'text-red-400',
};

export default async function DashboardApplicationsPage() {
  const applications = await getApplicationsForDashboard();

  return (
    <main className="p-4 sm:p-8">
      <h1 className="font-display text-foreground text-xl font-bold tracking-wide uppercase sm:text-2xl">
        Membership Applications
      </h1>
      <p className="text-muted mt-2 text-sm sm:text-base">Pending applications appear first.</p>

      {applications.length === 0 ? (
        <div className="border-guild-green/20 bg-surface mt-6 flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-12 text-center sm:mt-8">
          <span className="font-display text-guild-green/60 text-3xl">＋</span>
          <p className="text-foreground text-sm font-semibold">No applications yet</p>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3 sm:mt-8">
          {applications.map((application) => (
            <li
              key={application.id}
              className="border-guild-green/20 bg-surface rounded-lg border p-4"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex min-w-0 flex-col gap-3">
                  {/* Photos row: ID + payment proof side by side */}
                  <div className="flex gap-3">
                    {application.idPictureUrl && (
                      <Image
                        src={application.idPictureUrl}
                        alt={`ID picture for ${application.fullName}`}
                        width={64}
                        height={64}
                        className="h-16 w-16 flex-shrink-0 rounded-md object-cover"
                      />
                    )}
                    {application.paymentProofUrl && (
                      
                      <a  href={application.paymentProofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0"
                      >
                        <Image
                          src={application.paymentProofUrl}
                          alt="Payment receipt"
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-md object-cover hover:opacity-80"
                        />
                      </a>
                    )}
                  </div>

                  <p className="text-muted text-xs">
                    Payment: <span className="text-foreground">{application.paymentMethod}</span>
                  </p>

                  <div className="min-w-0">
                    <p className="font-display text-foreground font-bold uppercase break-words">
                      {application.fullName}{' '}
                      <span
                        className={`font-mono text-xs tracking-widest uppercase ${statusStyles[application.status]}`}
                      >
                        {application.status}
                      </span>
                    </p>
                    <p className="text-muted mt-1 text-sm break-words">
                      {application.email} &middot; {application.studentId} &middot;{' '}
                      {application.department} &middot; {application.course} &middot;{' '}
                      {application.yearLevel}
                    </p>
                    <p className="text-foreground mt-2 text-sm break-words">
                      <span className="text-muted">Plays:</span> {application.gamesPlayed}
                    </p>
                    <p className="text-muted mt-1 text-sm whitespace-pre-line break-words">
                      {application.message}
                    </p>
                    <p className="text-muted mt-2 text-xs">
                      Submitted {formatEventDate(application.createdAt)}
                      {application.reviewedBy && (
                        <> &middot; Reviewed by {application.reviewedBy.name}</>
                      )}
                    </p>
                  </div>
                </div>

                {application.status === 'PENDING' && (
                  <div className="flex flex-shrink-0 gap-2 sm:flex-col">
                    <form
                      action={approveApplicationAction.bind(null, application.id)}
                      className="flex-1 sm:flex-none"
                    >
                      <button
                        type="submit"
                        className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 w-full rounded-md border px-3 py-1.5 text-sm"
                      >
                        Approve
                      </button>
                    </form>
                    <form
                      action={rejectApplicationAction.bind(null, application.id)}
                      className="flex-1 sm:flex-none"
                    >
                      <button
                        type="submit"
                        className="w-full rounded-md border border-red-500/40 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}