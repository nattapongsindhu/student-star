import { describe, expect, it } from "vitest";
import { detectAssignmentChanges } from "./change-detection";
import { AssignmentSnapshot } from "@/types/sync";

const current: AssignmentSnapshot = {
  id: "cis214-100",
  course_id: "cis-214",
  title: "Packet Tracer Lab 6",
  due_at: "2026-09-16T23:59:00-07:00",
  points_possible: 50,
  status: "DISCOVERED",
  canvas_submission_confirmed: false,
};

describe("change detection", () => {
  it("creates an important event for a new Canvas assignment", () => {
    const changes = detectAssignmentChanges(null, current);

    expect(changes).toHaveLength(1);
    expect(changes[0].event_type).toBe("assignment_detected");
    expect(changes[0].severity).toBe("important");
  });

  it("creates a critical event when a due date changes", () => {
    const changes = detectAssignmentChanges(
      {
        ...current,
        due_at: "2026-09-18T23:59:00-07:00",
      },
      current,
    );

    expect(changes.some((change) => change.event_type === "due_date_changed")).toBe(true);
    expect(changes.find((change) => change.event_type === "due_date_changed")?.severity).toBe("critical");
  });

  it("flags a local submitted state that Canvas still has not confirmed", () => {
    const changes = detectAssignmentChanges(
      {
        ...current,
        status: "USER_MARKED_SUBMITTED",
      },
      {
        ...current,
        status: "USER_MARKED_SUBMITTED",
      },
    );

    expect(changes.some((change) => change.event_type === "submission_mismatch")).toBe(true);
  });
});
