update public.courses
set
  modality = 'Online live Zoom Mon/Wed 09:00-11:00; recordings posted',
  starts_on = '2026-06-15',
  ends_on = '2026-08-09',
  updated_at = now()
where id = 'cis-210';

update public.courses
set
  canvas_course_id = 341495,
  campus = 'City-OF Campus Zoom',
  modality = 'Lecture Wed 18:50-22:00',
  starts_on = '2026-02-09',
  ends_on = '2026-06-08',
  updated_at = now()
where id = 'engl-c1000';

update public.courses
set
  canvas_course_id = 341642,
  campus = 'City Online',
  modality = '8-week self-paced online public health course',
  starts_on = '2026-04-13',
  ends_on = '2026-06-08',
  updated_at = now()
where id = 'health-101';
