import Link from "next/link";
import { AlertTriangle, ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";
import { ManualSyncPanel } from "@/components/manual-sync-panel";
import { getSyncDashboardData } from "@/lib/sync-dashboard-data";
import { formatShortDate } from "@/lib/semester";

export default async function SyncPage() {
  const data = await getSyncDashboardData();
  const latest = data.syncRuns[0];

  return (
    <main className="min-h-screen bg-[#f7f8f3] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-teal-800" href="/">
            <ArrowLeft className="h-4 w-4" />
            Today
          </Link>
          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Canvas Sync Console</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-normal md:text-5xl">
                Verify that Canvas is being audited before work can fall through.
              </h1>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <RefreshCw className="h-4 w-4" />
                Latest Run
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {latest ? `${latest.status} · ${formatShortDate(latest.finished_at)}` : "No Supabase sync run found yet."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div className="space-y-6">
          <ManualSyncPanel />

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold">Configuration Check</h2>
            <div className="mt-4 space-y-3">
              <ConfigRow ok={data.configured.supabase} label="Supabase URL + service role key" />
              <ConfigRow ok={data.configured.canvasBaseUrl} label="Canvas base URL" />
              <ConfigRow ok={data.configured.canvasToken} label="Canvas access token" />
              <ConfigRow ok={data.configured.cronSecret} label="CRON_SECRET" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold">Recent Sync Runs</h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
              {data.syncRuns.length ? (
                data.syncRuns.map((run) => (
                  <div className="grid gap-2 border-b border-slate-200 p-4 last:border-0 md:grid-cols-[1fr_auto]" key={run.id}>
                    <div>
                      <p className="font-semibold">{run.status}</p>
                      <p className="text-sm text-slate-600">{formatShortDate(run.finished_at)}</p>
                      {run.error_message ? <p className="mt-1 text-sm text-rose-700">{run.error_message}</p> : null}
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      {run.courses_seen} courses · {run.assignments_seen} assignments · {run.changes_seen} changes
                    </p>
                  </div>
                ))
              ) : (
                <p className="p-4 text-sm text-slate-600">No sync history yet. Configure Supabase, then run sync.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold">Recent Canvas Changes</h2>
            <div className="mt-4 space-y-3">
              {data.changes.length ? (
                data.changes.map((change) => (
                  <article className="rounded-lg bg-slate-50 p-4" key={change.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-white px-2 py-1 text-xs font-semibold uppercase text-slate-700">
                        {change.severity}
                      </span>
                      <span className="text-xs text-slate-500">{formatShortDate(change.detected_at)}</span>
                    </div>
                    <h3 className="mt-2 font-semibold">{change.title}</h3>
                    {change.previous_value || change.new_value ? (
                      <p className="mt-1 text-sm text-slate-600">
                        {change.previous_value ?? "None"} → {change.new_value ?? "None"}
                      </p>
                    ) : null}
                  </article>
                ))
              ) : (
                <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                  No change events yet. New assignments and changed deadlines will appear here after sync.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ConfigRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2">
      {ok ? <CheckCircle2 className="h-5 w-5 text-teal-700" /> : <AlertTriangle className="h-5 w-5 text-amber-700" />}
      <span className="text-sm font-medium">{label}</span>
      <span className="ml-auto text-xs font-semibold uppercase text-slate-500">{ok ? "Ready" : "Missing"}</span>
    </div>
  );
}
