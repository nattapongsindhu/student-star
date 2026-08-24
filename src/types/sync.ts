export type ChangeSeverity = "info" | "watch" | "important" | "critical";

export type AssignmentSnapshot = {
  id: string;
  course_id: string;
  title: string;
  due_at: string | null;
  points_possible: number | null;
  status: string;
  canvas_submission_confirmed: boolean;
};

export type AssignmentChange = {
  event_key: string;
  course_id: string;
  assignment_id: string;
  event_type: string;
  severity: ChangeSeverity;
  title: string;
  previous_value: string | null;
  new_value: string | null;
  source: "canvas";
};
