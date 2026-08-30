update public.courses
set
  campus = 'LACC FH 201',
  modality = 'Campus Thu 14:30-17:40',
  updated_at = now()
where id = 'cis-112';
