"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";

type SyncResponse = {
  ok: boolean;
  syncStatus?: "ok" | "token_expired" | "sync_failed";
  lastAttempt?: string;
  lastSynced?: string;
  coursesSeen?: number;
  assignmentsSeen?: number;
  changesSeen?: number;
  error?: string;
};

export function ManualSyncPanel() {
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<SyncResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  function runSync() {
    setMessage(null);
    setResult(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/sync/canvas", {
          method: "POST",
        });
        const data = (await response.json()) as SyncResponse;
        setResult(data);

        if (!response.ok || !data.ok) {
          setMessage(
            data.syncStatus === "token_expired"
              ? "Canvas Access Token has expired or is invalid. Update CANVAS_ACCESS_TOKEN, then redeploy."
              : data.error ?? "Sync failed.",
          );
          return;
        }

        setMessage(
          `Synced ${data.coursesSeen ?? 0} courses, ${data.assignmentsSeen ?? 0} assignments, ${data.changesSeen ?? 0} changes.`,
        );
        window.location.reload();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Sync failed.");
      }
    });
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold">Manual Canvas Sync</h2>
      <p className="mt-2 text-sm text-slate-600">
        Refresh Canvas data now. This uses your authenticated Student Star session and does not expose the cron secret.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isPending}
          onClick={runSync}
          type="button"
        >
          <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
          {isPending ? "Syncing" : "Sync Now"}
        </button>
      </div>
      {result?.lastSynced ? <p className="mt-3 text-xs text-slate-500">Completed at {result.lastSynced}</p> : null}
      {message ? <p className="mt-3 text-sm font-medium text-slate-700">{message}</p> : null}
    </div>
  );
}
