update public.courses
set
  campus = 'Zoom',
  modality = 'Online Lecture Wed 18:50-22:00',
  updated_at = now()
where id = 'engl-c1000';
