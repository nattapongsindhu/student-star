---
name: student-star-sync
description: Manage and verify Canvas LMS synchronizations, reconciliations of cancelled/hidden assignments, and external Cengage/NetLab proof for Student Star.
---

# Student Star Operations & Sync Skill

This skill guides agents in maintaining and operating the Student Star Next.js + Supabase application.

## Primary Responsibilities

1. **Canvas Sync & Reconcile**:
   - Canvas API client in `src/lib/canvas-sync.ts`.
   - When synchronizing, assignments absent from Canvas API are reconciled to status `CANCELLED`.
   - Assignments marked `USER_MARKED_SUBMITTED` are preserved and not overwritten to `DISCOVERED`.

2. **Zero Missed Assignments Guarantee**:
   - `Missing / mismatch` metric on the Home dashboard (`src/app/page.tsx`):
     - `missing`: overdue tasks that have not been submitted (`days < 0 && !canvas_submission_confirmed && status !== "USER_MARKED_SUBMITTED" && status !== "CANCELLED"`).
     - `mismatch`: tasks submitted by the student (`USER_MARKED_SUBMITTED`) where Canvas hasn't confirmed yet (e.g., Cengage LTI sync glitch).
   - `CANCELLED` tasks are excluded from all active metrics and course totals.

3. **Database Migrations**:
   - All schema changes must be added as numbered `.sql` files in `supabase/migrations/`.
   - Use Supabase MCP `apply_migration` to execute migrations cleanly.

4. **Testing**:
   - Run `npm test` (Vitest) to verify unit tests.
   - Run `npm run build` to verify Next.js production builds.
