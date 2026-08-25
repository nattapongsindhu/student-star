update public.courses
set
  campus = 'City-Franklin Hall 221',
  modality = 'Lecture Wed 14:20-15:45',
  updated_at = now()
where id = 'anthro-102';

update public.courses
set
  campus = 'City-OF Campus Zoom',
  modality = 'Online lecture + Tue/Thu lab 11:10-12:35',
  updated_at = now()
where id = 'cs-101';
