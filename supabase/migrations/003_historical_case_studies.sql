alter table public.courses
  add column if not exists final_grade text;

insert into public.courses
  (id, canvas_course_id, code, title, term_label, course_status, campus, modality, units, final_grade, starts_on, ends_on, weekly_hours, color, source)
values
  ('cis-210', 362781, 'CIS 210', 'Intro to Computer Networking', 'Summer 2026', 'case_study', 'City Online', 'Completed Canvas course used as a networking case study', 3, 'A', '2026-05-17', '2026-08-10', 0, '#0e7490', 'canvas'),
  ('anthro-102', 341065, 'ANTHRO 102', 'Human Ways Of Life', 'Spring 2026', 'case_study', 'City Online', 'Completed Canvas course used as a general education case study', 3, 'A', '2026-01-26', '2026-06-21', 0, '#a16207', 'canvas'),
  ('cs-101', 341019, 'CS 101', 'Intro to Comp Sci', 'Spring 2026', 'case_study', 'City Online', 'Completed Canvas course used as a computer science case study', 3, 'A', '2026-02-09', '2026-06-08', 0, '#4338ca', 'canvas'),
  ('engl-c1000', null, 'ENGL C1000', 'Academic Reading & Writing', 'Spring 2026', 'case_study', 'SIS history', 'Completed course from SIS history; Canvas access not visible to current token', 3, 'A', '2026-01-26', '2026-06-21', 0, '#047857', 'user'),
  ('health-101', null, 'HEALTH 101', 'Intro Public Health', 'Spring 2026', 'case_study', 'SIS history', 'Completed course from SIS history; Canvas access not visible to current token', 3, 'A', '2026-01-26', '2026-06-21', 0, '#0891b2', 'user')
on conflict (id) do update set
  canvas_course_id = excluded.canvas_course_id,
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

update public.courses
set final_grade = 'Expected A',
    updated_at = now()
where id = 'pols-c1000'
  and final_grade is null;
