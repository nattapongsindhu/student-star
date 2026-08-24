import { TaskStatus } from "@/types/academic";

export const statusLabels: Record<TaskStatus, string> = {
  DISCOVERED: "Discovered",
  ACKNOWLEDGED: "Acknowledged",
  STARTED: "Started",
  READY_FOR_AUDIT: "Ready for Audit",
  AI_AUDITED: "AI Audited",
  READY_TO_SUBMIT: "Ready to Submit",
  USER_MARKED_SUBMITTED: "Marked Submitted",
  CANVAS_CONFIRMED: "Canvas Confirmed",
  GRADED: "Graded",
};

export function isCanvasComplete(status: TaskStatus) {
  return status === "CANVAS_CONFIRMED" || status === "GRADED";
}
