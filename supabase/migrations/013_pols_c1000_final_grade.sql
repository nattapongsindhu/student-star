update public.courses
set
  final_grade = 'A',
  course_status = 'case_study',
  updated_at = now()
where id = 'pols-c1000';
