update public.courses
set
  modality = 'Online lecture + Thu lab 14:30-17:40',
  updated_at = now()
where id = 'cis-112';

update public.courses
set
  modality = 'Online lecture + Sat live Zoom 14:00-18:10',
  updated_at = now()
where id = 'cis-162';
