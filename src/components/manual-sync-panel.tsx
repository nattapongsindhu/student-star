"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";

type SyncResponse = {
  ok: boolean;
  coursesSeen?: number;
  assignmentsSeen?: number;
  changesSeen?: number;
  error?: string;
};

export function ManualSyncPanel() {
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function runSync() {
    setMessage(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/sync/canvas", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secret}`,
          },
        });
        const data = (await response.json()) as SyncResponse;

        if (!response.ok || !data.ok) {
          setMessage(data.error ?? "Sync failed.");
          return;
        }

        setMessage(
          `Synced ${data.coursesSeen ?? 0} courses, ${data.assignmentsSeen ?? 0} assignments, ${data.changesSeen ?? 0} changes.`,
        );
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Sync failed.");
      }
    });
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold">Manual Canvas Sync</h2>
      <p className="mt-2 text-sm text-slate-600">
        Enter your local `CRON_SECRET` to trigger a read-only Canvas sync. The secret is not stored by this UI.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          aria-label="Cron secret"
          className="min-h-11 flex-1 rounded-md border border-slate-300 px-3 text-sm outline-none ring-teal-700 focus:ring-2"
          onChange={(event) => setSecret(event.target.value)}
          placeholder="CRON_SECRET"
          type="password"
          value={secret}
        />
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={!secret || isPending}
          onClick={runSync}
          type="button"
        >
          <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
          {isPending ? "Syncing" : "Run Sync"}
        </button>
      </div>
      {message ? <p className="mt-3 text-sm font-medium text-slate-700">{message}</p> : null}
    </div>
  );
}
