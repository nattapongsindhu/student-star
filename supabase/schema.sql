create table if not exists public.courses (
  id text primary key,
  canvas_course_id bigint unique,
  code text not null,
  title text not null,
  term_label text not null default 'Fall 2026',
  course_status text not null default 'active'
    check (course_status in ('upcoming', 'active', 'completed', 'case_study')),
  campus text not null,
  modality text not null,
  units numeric not null default 3,
  final_grade text,
  starts_on date not null,
  ends_on date not null,
  weekly_hours numeric not null default 0,
  color text not null default '#334155',
  source text not null default 'canvas'
    check (source in ('canvas', 'syllabus', 'user', 'ai_inference', 'mock')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assignments (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  canvas_assignment_id bigint,
  title text not null,
  due_at timestamptz,
  status text not null default 'DISCOVERED'
    check (status in ('DISCOVERED', 'ACKNOWLEDGED', 'STARTED', 'READY_FOR_AUDIT', 'AI_AUDITED', 'READY_TO_SUBMIT', 'USER_MARKED_SUBMITTED', 'CANVAS_CONFIRMED', 'GRADED')),
  points_possible numeric,
  estimated_minutes integer not null default 90,
  difficulty text not null default 'medium'
    check (difficulty in ('light', 'medium', 'heavy')),
  task_type text not null default 'reading'
    check (task_type in ('assignment', 'essay', 'discussion', 'reply', 'quiz', 'lab', 'simulation', 'project', 'presentation', 'midterm', 'final', 'exam', 'reading', 'homework', 'coding_assignment', 'paper', 'research_assignment', 'extra_credit', 'module_requirement', 'other')),
  priority_score integer not null default 0,
  risk_level text not null default 'LOW'
    check (risk_level in ('LOW', 'WATCH', 'HIGH', 'CRITICAL')),
  progress_percent integer not null default 0
    check (progress_percent between 0 and 100),
  canvas_submission_confirmed boolean not null default false,
  notes text,
  url text,
  source text not null default 'canvas'
    check (source in ('canvas', 'syllabus', 'user', 'ai_inference', 'mock')),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  last_changed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, canvas_assignment_id)
);

create index if not exists assignments_due_at_idx on public.assignments (due_at);
create index if not exists assignments_status_idx on public.assignments (status);
create index if not exists assignments_priority_idx on public.assignments (priority_score desc);

create table if not exists public.lab_notes (
  id uuid primary key default gen_random_uuid(),
  assignment_id text not null references public.assignments(id) on delete cascade,
  note text not null,
  command_snippet text,
  result_summary text,
  next_step text,
  created_at timestamptz not null default now()
);

create table if not exists public.sync_runs (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'canvas',
  status text not null,
  courses_seen integer not null default 0,
  assignments_seen integer not null default 0,
  changes_seen integer not null default 0,
  error_message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz not null default now()
);

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

alter table public.courses enable row level security;
alter table public.assignments enable row level security;
alter table public.lab_notes enable row level security;
alter table public.sync_runs enable row level security;
alter table public.change_events enable row level security;

create policy "service role manages courses"
  on public.courses for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role manages assignments"
  on public.assignments for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role manages lab notes"
  on public.lab_notes for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role manages sync runs"
  on public.sync_runs for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role manages change events"
  on public.change_events for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

insert into public.courses
  (id, canvas_course_id, code, title, term_label, course_status, campus, modality, units, final_grade, starts_on, ends_on, weekly_hours, color, source)
values
  ('asian-001', null, 'ASIAN 001', 'Asian American History', 'Fall 2026', 'upcoming', 'Harbor Online', 'Online', 3, null, '2026-10-05', '2026-12-20', 4.58, '#0f766e', 'mock'),
  ('cis-112', null, 'CIS 112', 'Operating Systems', 'Fall 2026', 'upcoming', 'LACC FH 201', 'Online lecture + Thu lab 14:30-17:40', 3, null, '2026-08-31', '2026-12-20', 5.25, '#2563eb', 'mock'),
  ('cis-162', null, 'CIS 162', 'Cyber Security I', 'Fall 2026', 'upcoming', 'City Online', 'Online lecture + Sat live Zoom 14:00-18:00', 3, null, '2026-08-31', '2026-12-20', 4.17, '#7c3aed', 'mock'),
  ('cis-166', null, 'CIS 166', 'Computer Forensics', 'Fall 2026', 'active', 'City Online', 'Online live Zoom Mon/Wed 11:00-12:15', 3, null, '2026-08-31', '2026-12-20', 5.25, '#be123c', 'mock'),
  ('cis-214', null, 'CIS 214', 'Intro to Network Plus', 'Fall 2026', 'upcoming', 'City Online', 'Online lecture + online lab', 3, null, '2026-08-31', '2026-12-20', 4.17, '#c2410c', 'mock'),
  ('cs-119', null, 'CS 119', 'Python Programming', 'Fall 2026', 'upcoming', 'City Online', 'Late-start online lecture + lab', 3, null, '2026-10-26', '2026-12-20', 8.5, '#15803d', 'mock'),
  ('pols-c1000', 362736, 'POLS C1000', 'American Government & Politics', 'Summer 2026', 'case_study', 'City Online', 'Completed online course used as a Student Star case study', 3, 'A', '2026-07-20', '2026-08-23', 0, '#6d28d9', 'canvas'),
  ('cis-210', 362781, 'CIS 210', 'Intro to Computer Networking', 'Summer 2026', 'case_study', 'City Online', 'Online live Zoom Mon/Wed 09:00-11:00; recordings posted', 3, 'A', '2026-06-15', '2026-08-09', 0, '#0e7490', 'canvas'),
  ('anthro-102', 341065, 'ANTHRO 102', 'Human Ways Of Life', 'Spring 2026', 'case_study', 'LACC FH 221', 'Lecture Wed 14:20-15:45', 3, 'A', '2026-01-26', '2026-06-21', 0, '#a16207', 'canvas'),
  ('cs-101', 341019, 'CS 101', 'Intro to Comp Sci', 'Spring 2026', 'case_study', 'Zoom', 'Online lecture + Tue/Thu lab 11:10-12:35', 3, 'A', '2026-02-09', '2026-06-08', 0, '#4338ca', 'canvas'),
  ('engl-c1000', 341495, 'ENGL C1000', 'Academic Reading & Writing', 'Spring 2026', 'case_study', 'Zoom', 'Lecture Wed 18:50-22:00', 3, 'A', '2026-02-09', '2026-06-08', 0, '#047857', 'user'),
  ('health-101', 341642, 'HEALTH 101', 'Intro Public Health', 'Spring 2026', 'case_study', 'City Online', '8-week self-paced online public health course', 3, 'A', '2026-04-13', '2026-06-08', 0, '#0891b2', 'user')
on conflict (id) do update set
  code = excluded.code,
  title = excluded.title,
  term_label = excluded.term_label,
  course_status = excluded.course_status,
  campus = excluded.campus,
  modality = excluded.modality,
  units = excluded.units,
  final_grade = excluded.final_grade,
  starts_on = excluded.starts_on,
  ends_on = excluded.ends_on,
  weekly_hours = excluded.weekly_hours,
  color = excluded.color,
  source = excluded.source,
  updated_at = now();
