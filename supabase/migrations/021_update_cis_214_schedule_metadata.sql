update public.courses
set
  campus = 'Zoom',
  modality = 'Online live Zoom Tue 15:00-17:00; attendance recommended/not required',
  source = 'syllabus'
where id = 'cis-214'
  or code = 'CIS 214';
