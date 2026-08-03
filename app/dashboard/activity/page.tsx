import { getRecentActivity } from '@/features/audit/queries';
import { formatEventDate } from '@/lib/format';

// AuditLog.previousData/newData are stored as JSON, so their shape isn't
// known at compile time. This safely reads the fields we expect out of
// them without assuming they exist.
function readSnapshot(data: unknown): { title?: string; body?: string } | null {
  if (!data || typeof data !== 'object') return null;
  const record = data as Record<string, unknown>;
  return {
    title: typeof record.title === 'string' ? record.title : undefined,
    body: typeof record.body === 'string' ? record.body : undefined,
  };
}

export default async function ActivityLogPage() {
  const logs = await getRecentActivity();

  return (
    <main className="p-8">
      <h1 className="font-display text-foreground text-2xl font-bold tracking-wide uppercase">
        Activity Log
      </h1>
      <p className="text-muted mt-2">Recent create, edit, and delete actions across the site.</p>

      {logs.length === 0 ? (
        <p className="text-muted mt-8">No activity recorded yet.</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-2">
          {logs.map((log) => {
            const before = readSnapshot(log.previousData);
            const after = readSnapshot(log.newData);
            const hasDetails = before || after;

            return (
              <li
                key={log.id}
                className="border-guild-green/20 bg-surface rounded-lg border p-4 text-sm"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-foreground">
                    <span className="text-guild-gold font-mono text-xs tracking-widest uppercase">
                      {log.action}
                    </span>{' '}
                    {log.entityType.toLowerCase()} &mdash; &ldquo;{log.summary}&rdquo;
                  </p>
                  <p className="text-muted text-xs">
                    {log.performedByName} &middot; {formatEventDate(log.createdAt)}
                  </p>
                </div>

                {hasDetails && (
                  <details className="mt-3">
                    <summary className="text-guild-green cursor-pointer text-xs font-semibold">
                      View changes
                    </summary>
                    <div className="border-guild-green/10 mt-3 grid gap-4 border-t pt-3 sm:grid-cols-2">
                      {before && (
                        <div>
                          <p className="text-muted font-mono text-[11px] tracking-widest uppercase">
                            Before
                          </p>
                          {before.title && (
                            <p className="text-foreground mt-1 font-semibold">{before.title}</p>
                          )}
                          {before.body && (
                            <p className="text-muted mt-1 whitespace-pre-line">{before.body}</p>
                          )}
                        </div>
                      )}
                      {after && (
                        <div>
                          <p className="text-muted font-mono text-[11px] tracking-widest uppercase">
                            After
                          </p>
                          {after.title && (
                            <p className="text-foreground mt-1 font-semibold">{after.title}</p>
                          )}
                          {after.body && (
                            <p className="text-muted mt-1 whitespace-pre-line">{after.body}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
