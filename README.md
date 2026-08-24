# Student Star

Personal Next.js + Supabase app for tracking Fall 2026 Canvas work across 6 courses / 18 units.

Product architecture and implementation plan:

- [docs/architecture.md](docs/architecture.md)

## What is included

- Clean dashboard for course load, due-soon work, priority queue, kanban counts, and lab-note planning.
- Canvas LMS sync endpoint for `https://ilearn.laccd.edu`.
- Supabase tables for courses, assignments, lab notes, and sync runs.
- Vercel cron config for daily Canvas sync.
- Seed data for ASIAN 001, CIS 112, CIS 162, CIS 166, CIS 214, and CS 119.
- Deterministic risk engine with tests for assignment priority and submission mismatch risk.

## Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
   - If you already ran an older schema, run `supabase/migrations/001_phase1_sync_foundation.sql` after it.
   - To add the POLS C1000 completed-course case study, run `supabase/migrations/002_pols_case_study_course.sql`.
   - To add historical A case studies, run `supabase/migrations/003_historical_case_studies.sql`.
   - To refresh the Fall/upcoming metadata, run `supabase/migrations/004_refresh_seed_course_metadata.sql`.
   - To remove the tutoring-center record from case studies, run `supabase/migrations/005_remove_tutor_case_study.sql`.
3. Copy `.env.example` to `.env.local`.
4. Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CANVAS_ACCESS_TOKEN`
   - `CRON_SECRET`
5. Optional: set `CANVAS_COURSE_IDS` to comma-separated Canvas course IDs if auto-matching by course code does not find every Fall 2026 course.

## Canvas token

In Canvas, go to Account -> Settings -> Approved Integrations -> New Access Token.

Use the token only in server-side environment variables. Do not paste it into browser code.

## Local commands

```bash
npm run dev
npm run build
npm run test
```

Manual sync:

```bash
curl -X POST http://localhost:3000/api/sync/canvas \
  -H "Authorization: Bearer $CRON_SECRET"
```

## Vercel

Add the same environment variables in Vercel. The daily cron runs:

```text
0 13 * * *
```

That is 6:00 AM Los Angeles time during daylight saving time.
