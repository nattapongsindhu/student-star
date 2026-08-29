with spring_assignments as (
  select *
  from (
    values
      ('engl-c1000-introduce-yourself-alive-in-los-angeles', 'engl-c1000', 'Introduce yourself to the class! Alive in Los Angeles!', '2026-02-13 23:59:00-07'::timestamptz, 20, 'discussion'),
      ('engl-c1000-syllabus-quiz', 'engl-c1000', 'Syllabus Quiz', '2026-02-13 23:59:00-07'::timestamptz, 15, 'quiz'),
      ('engl-c1000-essay-introduction-to-la-conversation', 'engl-c1000', 'Essay: Introduction to The L.A. Conversation', '2026-02-15 23:59:00-07'::timestamptz, 50, 'essay'),
      ('engl-c1000-quiz-1-lost-la-wild-la', 'engl-c1000', 'Quiz 1: Lost LA: S1, E1 "Wild LA"', '2026-02-16 23:59:00-07'::timestamptz, 6, 'quiz'),
      ('engl-c1000-commentary-1-in-the-beginning', 'engl-c1000', 'Commentary 1: "In the Beginning"', '2026-02-22 23:59:00-07'::timestamptz, 20, 'discussion'),
      ('engl-c1000-practice-email-corrigan-mcnabb', 'engl-c1000', 'Practice Email re: Corrigan and McNabb', '2026-02-22 23:59:00-07'::timestamptz, 10, 'assignment'),
      ('engl-c1000-quiz-2-lost-la-before-the-dodgers', 'engl-c1000', 'Quiz 2: Lost LA: S1, E2 "Before the Dodgers"', '2026-02-23 23:59:00-07'::timestamptz, 18, 'quiz'),
      ('engl-c1000-commentary-2-how-history-stays-with-us', 'engl-c1000', 'Commentary #2: "How History Stays With Us"', '2026-03-01 23:59:00-07'::timestamptz, 20, 'discussion'),
      ('engl-c1000-quiz-3-lost-la-reshaping-la', 'engl-c1000', 'QUIZ 3: Lost LA: S1, E3 "Reshaping LA"', '2026-03-02 23:59:00-07'::timestamptz, 10, 'quiz'),
      ('engl-c1000-commentary-3-contemporary-visions-los-angeles', 'engl-c1000', 'Commentary #3: "Contemporary Visions of Los Angeles"', '2026-03-08 23:59:00-07'::timestamptz, 20, 'discussion'),
      ('engl-c1000-quiz-4-lost-la-descanso-gardens', 'engl-c1000', 'QUIZ 4: Lost LA: S1, E4 "Descanso Gardens"', '2026-03-09 23:59:00-07'::timestamptz, 20, 'quiz'),
      ('engl-c1000-commentary-4-reflections-la-basin', 'engl-c1000', 'Commentary #4: "Reflections on the L.A. Basin"', '2026-03-15 23:59:00-07'::timestamptz, 20, 'discussion'),
      ('engl-c1000-choose-topic-final-project', 'engl-c1000', 'Choose a Topic for Your Final Project', '2026-03-22 23:59:00-07'::timestamptz, 30, 'project'),
      ('engl-c1000-practice-audit-assignment', 'engl-c1000', 'Practice Audit Assignment', '2026-03-22 23:59:00-07'::timestamptz, 50, 'assignment'),
      ('engl-c1000-rhetorical-analysis-essay-la-conversation', 'engl-c1000', 'Rhetorical Analysis Essay: Getting into the L.A. Conversation', '2026-03-22 23:59:00-07'::timestamptz, 105, 'essay'),
      ('engl-c1000-quiz-5-lost-la-borderlands', 'engl-c1000', 'QUIZ 5: Lost LA: S2, E1 "Borderlands"', '2026-03-23 23:59:00-07'::timestamptz, 15, 'quiz'),
      ('engl-c1000-commentary-5-new-ideas-about-place', 'engl-c1000', 'Commentary #5: "New Ideas About Place"', '2026-03-29 23:59:00-07'::timestamptz, 20, 'discussion'),
      ('engl-c1000-quiz-6-lost-la-wild-west', 'engl-c1000', 'QUIZ 6: Lost LA: S2, E2 "Wild West"', '2026-03-30 23:59:00-07'::timestamptz, 15, 'quiz'),
      ('engl-c1000-annotated-bibliography', 'engl-c1000', 'Annotated Bibliography', '2026-04-02 23:59:00-07'::timestamptz, 15, 'research_assignment'),
      ('engl-c1000-commentary-6-new-ideas-about-the-land', 'engl-c1000', 'Commentary #6: "New Ideas About the Land"', '2026-04-05 23:59:00-07'::timestamptz, 20, 'discussion'),
      ('engl-c1000-quiz-7-lost-la-building-metropolis', 'engl-c1000', 'QUIZ 7: Lost LA: S2, E3 "Building the Metropolis"', '2026-04-13 23:59:00-07'::timestamptz, 15, 'quiz'),
      ('engl-c1000-commentary-7-fox-wrap-up', 'engl-c1000', 'Commentary #7: Fox Wrap-Up', '2026-04-19 23:59:00-07'::timestamptz, 20, 'discussion'),
      ('engl-c1000-mla-video-lecture-discussion', 'engl-c1000', 'MLA Video Lecture & Discussion', '2026-04-19 23:59:00-07'::timestamptz, 20, 'discussion'),
      ('engl-c1000-quiz-8-lost-la-dream-factory', 'engl-c1000', 'QUIZ 8: Lost LA: S2, E4 "The Dream Factory"', '2026-04-27 23:59:00-07'::timestamptz, 10, 'quiz'),
      ('engl-c1000-commentary-8-los-angeles-like-movies', 'engl-c1000', 'Commentary #8: Is Los Angeles Like the Movies?', '2026-05-03 23:59:00-07'::timestamptz, 20, 'discussion'),
      ('engl-c1000-i-search-paper', 'engl-c1000', 'I-Search Paper Due Here', '2026-05-03 23:59:00-07'::timestamptz, 115, 'paper'),
      ('engl-c1000-quiz-9-lost-la-coded-geographies', 'engl-c1000', 'QUIZ 9: Lost LA: S2, E5 "Coded Geographies"', '2026-05-04 23:59:00-07'::timestamptz, 12, 'quiz'),
      ('engl-c1000-commentary-9-whats-in-a-map', 'engl-c1000', 'Commentary #9: "What''s in a map?"', '2026-05-10 23:59:00-07'::timestamptz, 20, 'discussion'),
      ('engl-c1000-quiz-10-lost-la-pacific-rim', 'engl-c1000', 'QUIZ 10: Lost LA: S2, E6 "Pacific Rim"', '2026-05-11 23:59:00-07'::timestamptz, 20, 'quiz'),
      ('engl-c1000-commentary-10-coming-to-terms-with-los-angeles', 'engl-c1000', 'Commentary #10: "Coming to Terms With Los Angeles"', '2026-05-17 23:59:00-07'::timestamptz, 20, 'discussion'),
      ('engl-c1000-final-audit', 'engl-c1000', 'Final Audit', '2026-05-24 23:59:00-07'::timestamptz, 100, 'final'),
      ('engl-c1000-los-angeles-chapter-final-writing-project', 'engl-c1000', 'Los Angeles Chapter (Final Writing Project)', '2026-05-24 23:59:00-07'::timestamptz, 650, 'final'),
      ('engl-c1000-final-exam-c1000', 'engl-c1000', 'Final Exam C1000', '2026-06-03 23:59:00-07'::timestamptz, 65, 'final'),
      ('health-101-assignment-1-defining-public-health-personal-health', 'health-101', 'Assignment #1: Defining Public Health and Personal Health', '2026-04-18 23:59:00-07'::timestamptz, 12, 'assignment'),
      ('health-101-assignment-2-framework-disciplines-careers', 'health-101', 'Assignment #2- Framework, Disciplines and Careers in Public Health', '2026-04-18 23:59:00-07'::timestamptz, 20, 'assignment'),
      ('health-101-introductions-discussion', 'health-101', 'Introductions Discussion', '2026-04-18 23:59:00-07'::timestamptz, 10, 'discussion'),
      ('health-101-week-1-discussion', 'health-101', 'Week 1 Discussion', '2026-04-18 23:59:00-07'::timestamptz, 20, 'discussion'),
      ('health-101-quiz-1-chapters-1-4', 'health-101', 'Quiz 1: Chapters 1-4', '2026-04-25 23:59:00-07'::timestamptz, 20, 'quiz'),
      ('health-101-week-2-discussion-a-outbreak-investigation', 'health-101', 'Week 2 Discussion A: Outbreak investigation', '2026-04-25 23:59:00-07'::timestamptz, 10, 'discussion'),
      ('health-101-week-2-discussion-b-disease-prevention', 'health-101', 'Week 2 Discussion B: Disease Prevention Activity', '2026-04-25 23:59:00-07'::timestamptz, 20, 'discussion'),
      ('health-101-quiz-2-chapters-5-7', 'health-101', 'Quiz 2: Chapters 5 and 7', '2026-05-02 23:59:00-07'::timestamptz, 15, 'quiz'),
      ('health-101-unit-5-discussion-maternal-infant-child-health', 'health-101', 'Unit 5 Discussion- Maternal, Infant, and Child Health', '2026-05-02 23:59:00-07'::timestamptz, 20, 'discussion'),
      ('health-101-chapter-8-discussion-violence-suicide-prevention', 'health-101', 'Chapter 8 Discussion: Violence / Suicide prevention in children', '2026-05-09 23:59:00-07'::timestamptz, 12, 'discussion'),
      ('health-101-extra-credit-quiz-chapter-6', 'health-101', 'Extra Credit Quiz: Chapter 6', '2026-05-09 23:59:00-07'::timestamptz, 0, 'extra_credit'),
      ('health-101-quiz-3-chapters-8-9', 'health-101', 'Quiz 3: Chapters 8 & 9', '2026-05-09 23:59:00-07'::timestamptz, 20, 'quiz'),
      ('health-101-chapter-10-discussion', 'health-101', 'Chapter 10 Discussion', '2026-05-16 23:59:00-07'::timestamptz, 15, 'discussion'),
      ('health-101-quiz-4-chapters-10-11', 'health-101', 'Quiz 4: Chapters 10 & 11', '2026-05-16 23:59:00-07'::timestamptz, 15, 'quiz'),
      ('health-101-discussion-chapter-13-healthcare-delivery', 'health-101', 'Discussion- Chapter 13 Healthcare Delivery in the US', '2026-05-23 23:59:00-07'::timestamptz, 10, 'discussion'),
      ('health-101-quiz-5-chapters-12-13', 'health-101', 'Quiz 5: Chapters 12 & 13', '2026-05-23 23:59:00-07'::timestamptz, 15, 'quiz'),
      ('health-101-chapter-14-discussion-environmental-issues', 'health-101', 'Chapter 14 Discussion: Environmental Issues in Public Health', '2026-05-30 23:59:00-07'::timestamptz, 20, 'discussion'),
      ('health-101-chapter-15-discussion-injuries-community-health', 'health-101', 'Chapter 15 Discussion: Injuries as a Community and Public Health Issue', '2026-05-30 23:59:00-07'::timestamptz, 15, 'discussion'),
      ('health-101-quiz-6-chapters-14-15', 'health-101', 'Quiz 6: Chapters 14 & 15', '2026-05-30 23:59:00-07'::timestamptz, 20, 'quiz'),
      ('health-101-concluding-thoughts-discussion-slo', 'health-101', 'Concluding Thoughts Discussion: SLO', '2026-06-06 23:59:00-07'::timestamptz, 20, 'discussion'),
      ('health-101-extra-credit-quiz-chapter-16', 'health-101', 'Extra Credit Quiz: Chapter 16', '2026-06-06 23:59:00-07'::timestamptz, 0, 'extra_credit'),
      ('health-101-final-exam', 'health-101', 'Final Exam', '2026-06-06 23:59:00-07'::timestamptz, 42, 'final'),
      ('health-101-course-exit-survey', 'health-101', 'Course Exit Survey', '2026-06-06 23:59:00-07'::timestamptz, null, 'other')
  ) as assignment(id, course_id, title, due_at, points_possible, task_type)
)
insert into public.assignments
  (
    id,
    course_id,
    canvas_assignment_id,
    title,
    due_at,
    status,
    points_possible,
    estimated_minutes,
    difficulty,
    task_type,
    priority_score,
    risk_level,
    progress_percent,
    canvas_submission_confirmed,
    notes,
    url,
    source,
    last_seen_at,
    updated_at
  )
select
  id,
  course_id,
  null,
  title,
  due_at,
  'GRADED',
  points_possible,
  case
    when task_type in ('final', 'exam') then 120
    when task_type in ('essay', 'paper', 'project') and points_possible >= 100 then 240
    when task_type in ('essay', 'paper', 'project') then 150
    when task_type = 'discussion' then 75
    when task_type in ('quiz', 'extra_credit') then 45
    else 90
  end,
  case
    when task_type in ('final', 'exam') or points_possible >= 100 then 'heavy'
    when task_type in ('essay', 'paper', 'project') or points_possible >= 30 then 'medium'
    else 'light'
  end,
  task_type,
  0,
  'LOW',
  100,
  true,
  'Backfilled from Spring 2026 Canvas grades/modules PDFs.',
  null,
  'canvas',
  now(),
  now()
from spring_assignments
on conflict (id) do update set
  title = excluded.title,
  due_at = excluded.due_at,
  status = excluded.status,
  points_possible = excluded.points_possible,
  estimated_minutes = excluded.estimated_minutes,
  difficulty = excluded.difficulty,
  task_type = excluded.task_type,
  priority_score = excluded.priority_score,
  risk_level = excluded.risk_level,
  progress_percent = excluded.progress_percent,
  canvas_submission_confirmed = excluded.canvas_submission_confirmed,
  notes = excluded.notes,
  source = excluded.source,
  last_seen_at = now(),
  updated_at = now();
