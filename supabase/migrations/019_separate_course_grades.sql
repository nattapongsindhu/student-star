alter table public.courses
  add column if not exists current_canvas_grade text,
  add column if not exists expected_grade text,
  add column if not exists official_grade text;

update public.courses
set official_grade = final_grade
where official_grade is null
  and final_grade is not null
  and final_grade not like 'Expected %';

update public.courses
set expected_grade = substring(final_grade from 10)
where expected_grade is null
  and final_grade like 'Expected %';
