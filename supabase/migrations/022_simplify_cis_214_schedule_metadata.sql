update public.courses
set
  title = 'Introduction to Network Plus',
  campus = 'Zoom',
  modality = 'Online live Zoom Tue 15:00-17:00',
  source = 'syllabus'
where id = 'cis-214'
  or code = 'CIS 214';
