import { AssignmentChange, AssignmentSnapshot } from "@/types/sync";

function valueChanged(left: unknown, right: unknown) {
  return String(left ?? "") !== String(right ?? "");
}

export function detectAssignmentChanges(
  previous: AssignmentSnapshot | null,
  current: AssignmentSnapshot,
): AssignmentChange[] {
  if (!previous) {
    return [
      {
        event_key: `${current.id}:assignment_detected`,
        course_id: current.course_id,
        assignment_id: current.id,
        event_type: "assignment_detected",
        severity: current.due_at ? "important" : "watch",
        title: `New Canvas assignment detected: ${current.title}`,
        previous_value: null,
        new_value: current.due_at,
        source: "canvas",
      },
    ];
  }

  const changes: AssignmentChange[] = [];

  if (valueChanged(previous.due_at, current.due_at)) {
    changes.push({
      event_key: `${current.id}:due_date_changed:${previous.due_at ?? "none"}:${current.due_at ?? "none"}`,
      course_id: current.course_id,
      assignment_id: current.id,
      event_type: "due_date_changed",
      severity: "critical",
      title: `Due date changed: ${current.title}`,
      previous_value: previous.due_at,
      new_value: current.due_at,
      source: "canvas",
    });
  }

  if (valueChanged(previous.points_possible, current.points_possible)) {
    changes.push({
      event_key: `${current.id}:points_changed:${previous.points_possible ?? "none"}:${current.points_possible ?? "none"}`,
      course_id: current.course_id,
      assignment_id: current.id,
      event_type: "points_changed",
      severity: "important",
      title: `Point value changed: ${current.title}`,
      previous_value: previous.points_possible === null ? null : String(previous.points_possible),
      new_value: current.points_possible === null ? null : String(current.points_possible),
      source: "canvas",
    });
  }

  if (valueChanged(previous.title, current.title)) {
    changes.push({
      event_key: `${current.id}:title_changed:${previous.title}:${current.title}`,
      course_id: current.course_id,
      assignment_id: current.id,
      event_type: "title_changed",
      severity: "watch",
      title: `Assignment title changed: ${current.title}`,
      previous_value: previous.title,
      new_value: current.title,
      source: "canvas",
    });
  }

  if (previous.status !== current.status) {
    changes.push({
      event_key: `${current.id}:submission_status_changed:${previous.status}:${current.status}`,
      course_id: current.course_id,
      assignment_id: current.id,
      event_type: "submission_status_changed",
      severity: current.canvas_submission_confirmed ? "info" : "watch",
      title: `Submission status changed: ${current.title}`,
      previous_value: previous.status,
      new_value: current.status,
      source: "canvas",
    });
  }

  if (
    previous.status === "USER_MARKED_SUBMITTED" &&
    !previous.canvas_submission_confirmed &&
    !current.canvas_submission_confirmed
  ) {
    changes.push({
      event_key: `${current.id}:submission_mismatch`,
      course_id: current.course_id,
      assignment_id: current.id,
      event_type: "submission_mismatch",
      severity: "critical",
      title: `Submission mismatch: ${current.title}`,
      previous_value: "User marked submitted",
      new_value: "Canvas has not confirmed submission",
      source: "canvas",
    });
  }

  return changes;
}
