<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Student Star Agent Guidelines

## System Rules & Architecture
- **Core Mission**: "Zero Missed Assignments -> Protect an A in Every Class." (Fall 2026: 18 units across 6 courses at Los Angeles City College).
- **Source of Truth**: Follow [`docs/architecture.md`](file:///c:/Users/localonly/Documents/Projects/OpenAI%20Codex/student-star/docs/architecture.md). Canvas REST API, Supabase, and verified user entries are authoritative.
- **Removed / Unpublished Canvas Work**:
  - Assignments that disappear from Canvas API are reconciled to status `CANCELLED`.
  - Cancelled assignments must never count toward total course assignments, completion rates, or trigger "Missed / At risk" warnings.
- **Third-Party LTI Glitches (Cengage / NetLab)**:
  - When external learning platforms fail to sync grades back to Canvas, assignments can be marked as `USER_MARKED_SUBMITTED` with `progress_percent: 100` and external proof recorded in `notes`.
  - In dashboards, `USER_MARKED_SUBMITTED` items are categorized under `mismatch` (awaiting Canvas confirmation) and must NEVER be classified as `missing` (overdue incomplete work).
- **Database Migrations**:
  - Maintain strictly sequenced migrations in `supabase/migrations/` (currently up to `024_allow_cancelled_status.sql`).
- **Testing & Verification**:
  - Always run `npm test` (Vitest) and `npm run build` before pushing any changes.
