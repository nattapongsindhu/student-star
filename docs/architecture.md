# Student Star Architecture

Mission: Zero Missed Assignments -> Protect an A in Every Class.

This document separates verified workflow logic from future AI interpretation. Canvas, Supabase, and user-entered records are the source of truth. AI may summarize, audit, and explain, but it must not invent due dates, grades, submission confirmations, or professor policies.

## 1. System Architecture

The production app is a single-user Next.js application deployed on Vercel.

Primary flow:

```text
Canvas LMS -> Canvas Client -> Sync Engine -> Supabase
                                |
                                v
Change Detection -> Risk Engine -> Today Dashboard
                                |
                                v
AI Analyzer / Audit Engine -> Structured Findings
```

Boundaries:

- `canvas`: read-only Canvas REST API client and normalizers.
- `sync`: upserts Canvas objects, writes sync logs, and detects changes.
- `risk`: deterministic score calculation for assignments and courses.
- `grades`: official Canvas grade storage plus local what-if calculations.
- `audits`: AI analysis of instructions, rubrics, drafts, and syllabi.
- `ui`: server-rendered dashboard reads from Supabase and never sees secrets.

## 2. Database Schema Plan

Current MVP tables:

- `courses`
- `assignments`
- `lab_notes`
- `sync_runs`
- `change_events`

Next tables to add:

- `submissions`: Canvas submission status, attempt count, missing/late flags.
- `grades`: official Canvas scores per assignment.
- `grade_snapshots`: course grade trend over time.
- `assignment_versions`: previous Canvas instruction/due-date snapshots.
- `rubrics` and `rubric_criteria`.
- `modules` and `module_items`.
- `announcements`.
- `calendar_events`.
- `task_checklists`.
- `assignment_audits` and `audit_findings`.
- `study_sessions`.
- `exam_plans` and `exam_topics`.
- `app_settings`.

Every Canvas-synced record stores the Canvas object ID where available and a `source` value such as `canvas`, `mock`, `syllabus`, `user`, or `ai_inference`.

## 3. Canvas API Integration Plan

Use Canvas REST API read-only in the first production version.

Initial endpoints:

- active courses
- course assignments with `include[]=submission`
- assignment groups
- submissions
- course grades/enrollments

Next endpoints:

- discussions
- quizzes
- modules and module items
- announcements
- calendar events
- rubrics
- pages and file metadata

Do not write back to Canvas in MVP. Submission and completion status must be verified by Canvas data when available.

## 4. Sync + Change Detection Design

Every sync run should:

1. Fetch courses.
2. Fetch assignments and submissions.
3. Normalize records.
4. Upsert by stable Canvas IDs.
5. Compare key fields against existing rows.
6. Write `change_events` for new work, changed deadlines, changed points, changed status, new grades, and submission mismatches.
7. Save `sync_runs` with counts and status.

High-value comparisons:

- `due_at`
- `points_possible`
- `title`
- assignment description hash
- submission status
- grade/score
- missing/late flags

## 5. Risk/Priority Engine Design

Risk is deterministic and stored with a transparent breakdown.

Signals:

- deadline proximity
- points possible
- estimated effort
- progress percentage
- task lifecycle status
- Canvas submission confirmation
- current grade / A safety margin
- accelerated course multiplier

Risk bands:

- `LOW`: 0-29
- `WATCH`: 30-59
- `HIGH`: 60-79
- `CRITICAL`: 80-100

Priority queue sorts by risk score first, then due date.

## 6. Security Plan

- Canvas token stays in server-side environment variables.
- Supabase service role key stays server-side only.
- Do not log credentials.
- Keep Canvas sync read-only.
- Validate route inputs.
- Use `CRON_SECRET` for manual and scheduled sync routes.
- Label AI output as interpretation or estimate.
- Do not expose private coursework publicly.

Before production, add single-user authentication so the dashboard is not public.

## 7. MVP Development Roadmap

Phase 0: Foundation

- project scaffold
- Supabase schema
- environment setup
- mock data
- typed status/risk model

Phase 1: Zero Missed Work MVP

- Canvas course sync
- assignment sync
- submission sync
- due-date monitor
- submission mismatch warnings
- change detection
- Today Dashboard

Phase 2: A Protection

- grades
- A safety margin
- grade snapshots
- course health
- workload forecast

Phase 3: AI Academic Intelligence

- assignment instruction analyzer
- checklist generator
- rubric inspector
- final audit mode
- syllabus analyzer

Phase 4: Exams and Study

- exam command center
- topic tracking
- study timer
- time estimation

## 8. Recommended Folder Structure

```text
src/app
src/components
src/features/assignments
src/features/courses
src/features/grades
src/features/sync
src/lib
src/server/canvas
src/server/db
src/server/sync
src/server/ai
src/types
src/tests
supabase
docs
```

Keep business logic outside UI components. UI should receive already-normalized dashboard data.

## 9. Key TypeScript Interfaces

Core interfaces live in `src/types/academic.ts`.

Important enums:

- `TaskStatus`
- `RiskLevel`
- `TaskType`
- `SourceKind`

Important models:

- `RiskInput`
- `RiskBreakdown`
- `RiskResult`

## 10. Mock Fall 2026 Dataset Plan

Mock data exists so the app runs without Canvas credentials.

Rules:

- include all six Fall 2026 courses;
- use realistic but fake assignments;
- mark records with `source: "mock"`;
- never present mock assignments as real Canvas data;
- replace or merge with Canvas records after first successful sync.

Fall 2026 courses:

- CIS 112 Operating Systems
- CIS 162 Cyber Security I
- CIS 166 Computer Forensics
- CIS 214 Intro to Network Plus
- ASIAN 001 Asian American History
- CS 119 Python Programming
