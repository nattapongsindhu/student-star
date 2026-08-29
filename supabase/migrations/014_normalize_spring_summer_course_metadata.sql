update public.courses
set
  campus = 'Zoom'
where id in ('cs-101', 'engl-c1000');

update public.courses
set
  modality = 'Online live Zoom Mon/Wed 09:00-11:00; recordings posted',
  starts_on = '2026-06-15',
  ends_on = '2026-08-09'
where id = 'cis-210';

update public.courses
set
  canvas_course_id = 341495,
  starts_on = '2026-02-09',
  ends_on = '2026-06-08'
where id = 'engl-c1000';

update public.courses
set
  canvas_course_id = 341642,
  modality = '8-week self-paced online public health course',
  starts_on = '2026-04-13',
  ends_on = '2026-06-08'
where id = 'health-101';
