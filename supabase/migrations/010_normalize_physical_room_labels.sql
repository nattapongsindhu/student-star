update public.courses
set
  campus = 'LACC FH 201',
  updated_at = now()
where id = 'cis-112';

update public.courses
set
  campus = 'LACC FH 221',
  updated_at = now()
where id = 'anthro-102';
