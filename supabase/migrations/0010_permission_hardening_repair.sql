-- Restore least-privilege browser grants after any broad API grant operation.
-- Row-level security remains the source of truth for visible records.

revoke insert, update, delete on table public.appointments from authenticated;
grant select on table public.appointments to authenticated;

revoke all on table public.staff_roles from authenticated;
grant select on table public.staff_roles to authenticated;

revoke all on table public.audit_events from authenticated;
grant select on table public.audit_events to authenticated;

revoke update on table public.projects from authenticated;
grant update (
  display_name,
  current_legal_form,
  considered_legal_forms,
  activity_category,
  activity_description,
  department,
  desired_creation_date,
  updated_at
) on table public.projects to authenticated;
