alter table public.courses
  add column if not exists source text not null default 'canvas';

alter table public.assignments
  add column if not exists risk_level text not null default 'LOW',
  add column if not exists progress_percent integer not null default 0,
  add column if not exists canvas_submission_confirmed boolean not null default false,
  add column if not exists source text not null default 'canvas',
  add column if not exists first_seen_at timestamptz not null default now(),
  add column if not exists last_seen_at timestamptz not null default now(),
  add column if not exists last_changed_at timestamptz;

alter table public.sync_runs
  add column if not exists changes_seen integer not null default 0,
  add column if not exists error_message text,
  add column if not exists started_at timestamptz not null default now();

create table if not exists public.change_events (
  id uuid primary key default gen_random_uuid(),
  event_key text not null unique,
  course_id text references public.courses(id) on delete cascade,
  assignment_id text references public.assignments(id) on delete cascade,
  event_type text not null,
  severity text not null default 'info'
    check (severity in ('info', 'watch', 'important', 'critical')),
  title text not null,
  previous_value text,
  new_value text,
  source text not null default 'canvas'
    check (source in ('canvas', 'syllabus', 'user', 'ai_inference', 'mock')),
  detected_at timestamptz not null default now(),
  acknowledged_at timestamptz
);

alter table public.change_events enable row level security;

drop policy if exists "service role manages change events" on public.change_events;
create policy "service role manages change events"
  on public.change_events for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
