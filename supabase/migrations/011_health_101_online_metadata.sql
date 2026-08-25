update public.courses
set
  campus = 'City Online',
  modality = 'Completed online course from SIS history; Canvas access not visible to current token',
  updated_at = now()
where id = 'health-101';
