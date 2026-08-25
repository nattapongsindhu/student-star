insert into public.courses
  (id, canvas_course_id, code, title, term_label, course_status, campus, modality, units, final_grade, starts_on, ends_on, weekly_hours, color, source)
values
  ('co-tech-002', null, 'CO TECH 002', 'Intro to Electronics', 'Winter 2027', 'upcoming', 'Student Educational Plan', 'Planned course from Student Educational Plan; schedule TBA', 3, null, '2027-01-04', '2027-02-06', 0, '#0369a1', 'user'),
  ('fam-cs-021', null, 'FAM CS 021', 'Nutrition', 'Winter 2027', 'upcoming', 'Student Educational Plan', 'Planned course from Student Educational Plan; schedule TBA', 3, null, '2027-01-04', '2027-02-06', 0, '#65a30d', 'user'),
  ('cis-212', null, 'CIS 212', 'A+ Cert Prep HW', 'Spring 2027', 'upcoming', 'Student Educational Plan', 'Planned course from Student Educational Plan; schedule TBA', 3, null, '2027-02-09', '2027-06-08', 0, '#1d4ed8', 'user'),
  ('cis-213', null, 'CIS 213', 'A+ Operating Systems', 'Spring 2027', 'upcoming', 'Student Educational Plan', 'Planned course from Student Educational Plan; schedule TBA', 3, null, '2027-02-09', '2027-06-08', 0, '#7c3aed', 'user'),
  ('cis-211', null, 'CIS 211', 'Security+ Preparation', 'Spring 2027', 'upcoming', 'Student Educational Plan', 'Planned course from Student Educational Plan; schedule TBA', 3, null, '2027-02-09', '2027-06-08', 0, '#be123c', 'user'),
  ('cis-170', null, 'CIS 170', 'Intro to Ethical Hacking', 'Spring 2027', 'upcoming', 'Student Educational Plan', 'Planned course from Student Educational Plan; schedule TBA', 3, null, '2027-02-09', '2027-06-08', 0, '#0f766e', 'user'),
  ('cis-191', null, 'CIS 191', 'Cloud+ Tech', 'Spring 2027', 'upcoming', 'Student Educational Plan', 'Planned course from Student Educational Plan; schedule TBA', 3, null, '2027-02-09', '2027-06-08', 0, '#0891b2', 'user')
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
