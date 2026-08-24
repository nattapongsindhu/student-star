import Link from "next/link";
import { AlertTriangle, ExternalLink, RefreshCw } from "lucide-react";

type CanvasTokenAlertProps = {
  lastAttemptAt: string | null;
};

export function CanvasTokenAlert({ lastAttemptAt }: CanvasTokenAlertProps) {
  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-5 text-amber-950 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <AlertTriangle className="h-5 w-5 text-amber-700" />
            <span>⚠️ Canvas Access Token has expired or is invalid. Sync paused.</span>
          </div>
          <p className="mt-2 text-sm text-amber-900">
            Student Star is still showing the last cached assignments, but new Canvas changes will not sync until the
            token is replaced.
          </p>
          {lastAttemptAt ? (
            <p className="mt-2 text-xs font-semibold uppercase tracking-normal text-amber-800">
              Outdated / Sync Paused · Last attempt {lastAttemptAt}
            </p>
          ) : null}
          <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-amber-950">
            <li>Go to Canvas &gt; Account &gt; Settings &gt; Approved Integrations</li>
            <li>Generate a new token (+ New Access Token)</li>
            <li>Update `CANVAS_ACCESS_TOKEN` in Vercel Environment Variables &amp; Redeploy</li>
          </ol>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col">
          <Link
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-amber-900 px-3 text-sm font-semibold text-white"
            href="/sync"
          >
            <RefreshCw className="h-4 w-4" />
            Open Sync Console
          </Link>
          <a
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-amber-300 bg-white px-3 text-sm font-semibold text-amber-950"
            href="https://ilearn.laccd.edu/profile/settings"
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink className="h-4 w-4" />
            Open Canvas Settings
          </a>
        </div>
      </div>
    </div>
  );
}
