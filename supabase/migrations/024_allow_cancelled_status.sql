alter table public.assignments
  drop constraint if exists assignments_status_check;

alter table public.assignments
  add constraint assignments_status_check
  check (status in (
    'DISCOVERED',
    'ACKNOWLEDGED',
    'STARTED',
    'READY_FOR_AUDIT',
    'AI_AUDITED',
    'READY_TO_SUBMIT',
    'USER_MARKED_SUBMITTED',
    'CANVAS_CONFIRMED',
    'GRADED',
    'CANCELLED'
  ));
