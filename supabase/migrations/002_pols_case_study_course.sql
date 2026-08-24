alter table public.courses
  add column if not exists term_label text not null default 'Fall 2026',
  add column if not exists course_status text not null default 'active';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'courses_course_status_check'
      and conrelid = 'public.courses'::regclass
  ) then
    alter table public.courses
      add constraint courses_course_status_check
      check (course_status in ('upcoming', 'active', 'completed', 'case_study'));
  end if;
end $$;

insert into public.courses
  (id, canvas_course_id, code, title, term_label, course_status, campus, modality, units, starts_on, ends_on, weekly_hours, color, source)
values
  ('pols-c1000', 362736, 'POLS C1000', 'American Government & Politics', 'Summer 2026', 'case_study', 'City Online', 'Completed online course used as a Student Star case study', 3, '2026-07-20', '2026-08-23', 0, '#6d28d9', 'canvas')
on conflict (id) do update set
  canvas_course_id = excluded.canvas_course_id,
  code = excluded.code,
  title = excluded.title,
  term_label = excluded.term_label,
  course_status = excluded.course_status,
  campus = excluded.campus,
  modality = excluded.modality,
  units = excluded.units,
  starts_on = excluded.starts_on,
  ends_on = excluded.ends_on,
  weekly_hours = excluded.weekly_hours,
  color = excluded.color,
  source = excluded.source,
  updated_at = now();
