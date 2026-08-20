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
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        Membership Applications
      </h1>
      <p className="text-muted mt-2">Pending applications appear first.</p>

      {applications.length === 0 ? (
        <p className="text-muted mt-8">No applications yet.</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {applications.map((application) => (
            <li
              key={application.id}
              className="border-guild-green/20 bg-surface rounded-lg border p-4"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="flex gap-4">
                  {application.idPictureUrl && (
                    <Image
                      src={application.idPictureUrl}
                      alt={`ID picture for ${application.fullName}`}
                      width={64}
                      height={64}
                      className="h-16 w-16 flex-shrink-0 rounded-md object-cover"
                    />
                    
                  )}
                  <div className="mt-2 text-xs text-muted">
  <p>
    Payment: <span className="text-foreground">{application.paymentMethod}</span>
  </p>
  {application.paymentProofUrl && (
    <a href={application.paymentProofUrl} target="_blank" rel="noopener noreferrer">
      <Image
        src={application.paymentProofUrl}
        alt="Payment receipt"
        width={64}
        height={64}
        className="mt-1 h-16 w-16 rounded-md object-cover hover:opacity-80"
      />
    </a>
  )}
</div>
                  <div>
                    <p className="font-display text-foreground font-bold uppercase">
                      {application.fullName}{' '}
                      <span
                        className={`font-mono text-xs tracking-widest uppercase ${statusStyles[application.status]}`}
                      >
                        {application.status}
                      </span>
                    </p>
                    <p className="text-muted mt-1 text-sm">
                      {application.email} &middot; {application.studentId} &middot;{' '}
                      {application.courseYear}
                    </p>
                    <p className="text-foreground mt-2 text-sm">
                      <span className="text-muted">Plays:</span> {application.gamesPlayed}
                    </p>
                    <p className="text-muted mt-1 text-sm whitespace-pre-line">
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
                  <div className="flex flex-shrink-0 gap-2">
                    <form action={approveApplicationAction.bind(null, application.id)}>
                      <button
                        type="submit"
                        className="border-guild-green/40 text-guild-green hover:bg-guild-green/10 rounded-md border px-3 py-1.5 text-sm"
                      >
                        Approve
                      </button>
                    </form>
                    <form action={rejectApplicationAction.bind(null, application.id)}>
                      <button
                        type="submit"
                        className="rounded-md border border-red-500/40 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
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
