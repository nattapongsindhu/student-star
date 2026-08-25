insert into public.courses
  (id, canvas_course_id, code, title, term_label, course_status, campus, modality, units, final_grade, starts_on, ends_on, weekly_hours, color, source)
values
  ('asian-001', null, 'ASIAN 001', 'Asian American History', 'Fall 2026', 'upcoming', 'Harbor Online', 'Online', 3, null, '2026-10-05', '2026-12-20', 4.58, '#0f766e', 'mock'),
  ('cis-112', null, 'CIS 112', 'Operating Systems', 'Fall 2026', 'upcoming', 'LACC FH 201', 'Online lecture + Thu lab 2:30-5:40 PM', 3, null, '2026-08-31', '2026-12-20', 5.25, '#2563eb', 'mock'),
  ('cis-162', null, 'CIS 162', 'Cyber Security I', 'Fall 2026', 'upcoming', 'City Online', 'Online lecture + online lab', 3, null, '2026-08-31', '2026-12-20', 4.17, '#7c3aed', 'mock'),
  ('cis-166', 364809, 'CIS 166', 'Computer Forensics', 'Fall 2026', 'active', 'City Online', 'Online lecture + online lab', 3, null, '2026-08-31', '2026-12-20', 5.25, '#be123c', 'canvas'),
  ('cis-214', null, 'CIS 214', 'Intro to Network Plus', 'Fall 2026', 'upcoming', 'City Online', 'Online lecture + online lab', 3, null, '2026-08-31', '2026-12-20', 4.17, '#c2410c', 'mock'),
  ('cs-119', null, 'CS 119', 'Python Programming', 'Fall 2026', 'upcoming', 'City Online', 'Late-start online lecture + lab', 3, null, '2026-10-26', '2026-12-20', 8.5, '#15803d', 'mock'),
  ('pols-c1000', 362736, 'POLS C1000', 'American Government & Politics', 'Summer 2026', 'case_study', 'City Online', 'Completed online course used as a Student Star case study', 3, 'Expected A', '2026-07-20', '2026-08-23', 0, '#6d28d9', 'canvas'),
  ('cis-210', 362781, 'CIS 210', 'Intro to Computer Networking', 'Summer 2026', 'case_study', 'City Online', 'Completed Canvas course used as a networking case study', 3, 'A', '2026-05-17', '2026-08-10', 0, '#0e7490', 'canvas'),
  ('anthro-102', 341065, 'ANTHRO 102', 'Human Ways Of Life', 'Spring 2026', 'case_study', 'LACC FH 221', 'Lecture Wed 14:20-15:45', 3, 'A', '2026-01-26', '2026-06-21', 0, '#a16207', 'canvas'),
  ('cs-101', 341019, 'CS 101', 'Intro to Comp Sci', 'Spring 2026', 'case_study', 'City-OF Campus Zoom', 'Online lecture + Tue/Thu lab 11:10-12:35', 3, 'A', '2026-02-09', '2026-06-08', 0, '#4338ca', 'canvas'),
  ('engl-c1000', null, 'ENGL C1000', 'Academic Reading & Writing', 'Spring 2026', 'case_study', 'City-OF Campus Zoom', 'Lecture Wed 18:50-22:00', 3, 'A', '2026-01-26', '2026-06-21', 0, '#047857', 'user'),
  ('health-101', null, 'HEALTH 101', 'Intro Public Health', 'Spring 2026', 'case_study', 'City Online', 'Completed online course from SIS history; Canvas access not visible to current token', 3, 'A', '2026-01-26', '2026-06-21', 0, '#0891b2', 'user')
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
