"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { TaskStatus } from "@/types/academic";

type StatusAction = {
  status: TaskStatus;
  label: string;
};

type AssignmentStatusActionsProps = {
  actions: StatusAction[];
  assignmentId: string;
  currentStatus: TaskStatus;
};

export function AssignmentStatusActions({ actions, assignmentId, currentStatus }: AssignmentStatusActionsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!actions.length) return null;

  function updateStatus(status: TaskStatus) {
    setError(null);
    startTransition(async () => {
      const response = await fetch("/api/assignments/status", {
        body: JSON.stringify({ assignmentId, status }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        setError("Status update failed. Try again after checking the sync connection.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending || currentStatus === action.status}
            key={action.status}
            onClick={() => updateStatus(action.status)}
            type="button"
          >
            {isPending ? "Updating..." : action.label}
          </button>
        ))}
      </div>
      {error ? <p className="mt-2 text-xs font-medium text-red-700">{error}</p> : null}
    </div>
  );
}
