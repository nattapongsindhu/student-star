import { describe, expect, it } from "vitest";
import {
  findVerifiedSubmissionOverride,
  reconcileAssignmentWithVerifiedProof,
} from "./verified-submissions";
import type { Assignment } from "./semester";

describe("verified external submissions reconciliation", () => {
  it("matches CIS 214 Working with IP Addresses lab", () => {
    const match = findVerifiedSubmissionOverride(
      "CIS 214",
      "Network Simulation 11-1: Working with IP Addresses",
    );
    expect(match).toBeDefined();
    expect(match?.notes).toContain("LabConnection");
  });

  it("matches CIS 214 Chapter 11 Quiz", () => {
    const match = findVerifiedSubmissionOverride(
      "CIS 214",
      "Quiz: Chapter 11 Network Operating System Fundamentals",
    );
    expect(match).toBeDefined();
    expect(match?.notes).toContain("Cengage MindTap");
  });

  it("reconciles unsubmitted assignment to USER_MARKED_SUBMITTED with 100% progress", () => {
    const mockAssignment: Assignment = {
      id: "canvas-12345",
      course_id: "cis-214",
      canvas_assignment_id: 12345,
      title: "Network Simulation 11-1: Working with IP Addresses",
      due_at: "2026-12-01T23:59:00-08:00",
      status: "DISCOVERED",
      points_possible: 100,
      estimated_minutes: 90,
      difficulty: "medium",
      task_type: "lab",
      priority_score: 80,
      risk_level: "HIGH",
      progress_percent: 0,
      canvas_submission_confirmed: false,
      notes: null,
      url: null,
      source: "canvas",
    };

    const reconciled = reconcileAssignmentWithVerifiedProof("CIS 214", mockAssignment);
    expect(reconciled.status).toBe("USER_MARKED_SUBMITTED");
    expect(reconciled.progress_percent).toBe(100);
    expect(reconciled.priority_score).toBe(0);
    expect(reconciled.risk_level).toBe("LOW");
    expect(reconciled.notes).toContain("LabConnection");
  });

  it("does not overwrite already CANVAS_CONFIRMED or GRADED assignments", () => {
    const confirmedAssignment: Assignment = {
      id: "canvas-12345",
      course_id: "cis-214",
      canvas_assignment_id: 12345,
      title: "Quiz: Chapter 11 Network Operating System Fundamentals",
      due_at: "2026-12-01T23:59:00-08:00",
      status: "CANVAS_CONFIRMED",
      points_possible: 25,
      estimated_minutes: 60,
      difficulty: "light",
      task_type: "quiz",
      priority_score: 0,
      risk_level: "LOW",
      progress_percent: 100,
      canvas_submission_confirmed: true,
      notes: "Grade confirmed by Canvas",
      url: null,
      source: "canvas",
    };

    const reconciled = reconcileAssignmentWithVerifiedProof("CIS 214", confirmedAssignment);
    expect(reconciled.status).toBe("CANVAS_CONFIRMED");
    expect(reconciled.canvas_submission_confirmed).toBe(true);
  });
});
