-- Normalize auth lookups for Postgres' RLS planner and avoid duplicate permissive
-- SELECT policies. This migration changes neither the intended roles nor the rows
-- visible to each role.

drop policy if exists profiles_select_self on public.profiles;
create policy profiles_select_self on public.profiles for select to authenticated
using (id = (select auth.uid()) or public.is_staff());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

drop policy if exists staff_roles_select_self on public.staff_roles;
create policy staff_roles_select_self on public.staff_roles for select to authenticated
using (user_id = (select auth.uid()) or public.is_staff(array['admin']));

drop policy if exists leads_staff_select on public.leads;
create policy leads_staff_select on public.leads for select to authenticated
using (public.is_staff(array['admin']) or assigned_advisor_id = (select auth.uid()));

drop policy if exists leads_staff_update on public.leads;
create policy leads_staff_update on public.leads for update to authenticated
using (public.is_staff(array['admin']) or assigned_advisor_id = (select auth.uid()))
with check (public.is_staff(array['admin']) or assigned_advisor_id = (select auth.uid()));

drop policy if exists attribution_staff_select on public.lead_attributions;
create policy attribution_staff_select on public.lead_attributions for select to authenticated
using (
  public.is_staff(array['admin'])
  or exists (
    select 1 from public.leads l
    where l.id = lead_id and l.assigned_advisor_id = (select auth.uid())
  )
);

drop policy if exists diagnostics_owner_select on public.diagnostic_sessions;
create policy diagnostics_owner_select on public.diagnostic_sessions for select to authenticated
using (
  user_id = (select auth.uid())
  or (project_id is not null and public.is_project_member(project_id))
  or public.can_manage_project(project_id)
);

drop policy if exists diagnostics_owner_update on public.diagnostic_sessions;
create policy diagnostics_owner_update on public.diagnostic_sessions for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists projects_client_update on public.projects;
create policy projects_client_update on public.projects for update to authenticated
using (
  exists (
    select 1 from public.project_members pm
    where pm.project_id = id
      and pm.user_id = (select auth.uid())
      and pm.member_role = 'owner'
      and pm.invitation_status = 'accepted'
  )
  or public.can_manage_project(id)
)
with check (
  exists (
    select 1 from public.project_members pm
    where pm.project_id = id
      and pm.user_id = (select auth.uid())
      and pm.member_role = 'owner'
      and pm.invitation_status = 'accepted'
  )
  or public.can_manage_project(id)
);

drop policy if exists founders_owner_delete on public.founders;
create policy founders_owner_delete on public.founders for delete to authenticated
using (
  public.can_manage_project(project_id)
  or exists (
    select 1 from public.project_members pm
    where pm.project_id = founders.project_id
      and pm.user_id = (select auth.uid())
      and pm.member_role = 'owner'
      and pm.invitation_status = 'accepted'
  )
);

drop policy if exists documents_member_insert on public.documents;
create policy documents_member_insert on public.documents for insert to authenticated
with check (uploaded_by = (select auth.uid()) and public.is_project_member(project_id));

drop policy if exists versions_member_insert on public.document_versions;
create policy versions_member_insert on public.document_versions for insert to authenticated
with check (
  uploaded_by = (select auth.uid())
  and exists (
    select 1 from public.documents d
    where d.id = document_id and public.is_project_member(d.project_id)
  )
);

drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages for insert to authenticated
with check (
  sender_user_id = (select auth.uid())
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id
      and (public.is_project_member(c.project_id) or public.can_manage_project(c.project_id))
  )
  and (
    internal_only = false
    or public.can_manage_project((select project_id from public.conversations where id = conversation_id))
  )
);

drop policy if exists appointments_select on public.appointments;
create policy appointments_select on public.appointments for select to authenticated
using (
  (project_id is not null and (public.is_project_member(project_id) or public.can_manage_project(project_id)))
  or advisor_id = (select auth.uid())
);

drop policy if exists consent_owner_select on public.consent_records;
create policy consent_owner_select on public.consent_records for select to authenticated
using (user_id = (select auth.uid()) or public.is_staff(array['admin']));

drop policy if exists consent_owner_insert on public.consent_records;
create policy consent_owner_insert on public.consent_records for insert to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists data_requests_owner_select on public.data_requests;
create policy data_requests_owner_select on public.data_requests for select to authenticated
using (user_id = (select auth.uid()) or public.is_staff(array['admin']));

drop policy if exists data_requests_owner_insert on public.data_requests;
create policy data_requests_owner_insert on public.data_requests for insert to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists message_reads_owner_select on public.message_reads;
create policy message_reads_owner_select on public.message_reads for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists message_reads_owner_insert on public.message_reads;
create policy message_reads_owner_insert on public.message_reads for insert to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.messages m
    join public.conversations c on c.id = m.conversation_id
    where m.id = message_id and public.is_project_member(c.project_id)
  )
);

drop policy if exists message_reads_owner_update on public.message_reads;
create policy message_reads_owner_update on public.message_reads for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

-- Staff can read through the shared member/staff SELECT policy. Split mutation
-- policies by command so SELECT does not evaluate two permissive policies.
drop policy if exists requirements_staff_write on public.document_requirements;
create policy requirements_staff_insert on public.document_requirements for insert to authenticated
with check (public.can_manage_project(project_id));
create policy requirements_staff_update on public.document_requirements for update to authenticated
using (public.can_manage_project(project_id))
with check (public.can_manage_project(project_id));
create policy requirements_staff_delete on public.document_requirements for delete to authenticated
using (public.can_manage_project(project_id));

drop policy if exists tasks_staff_write on public.project_tasks;
create policy tasks_staff_insert on public.project_tasks for insert to authenticated
with check (public.can_manage_project(project_id));
create policy tasks_staff_update on public.project_tasks for update to authenticated
using (public.can_manage_project(project_id))
with check (public.can_manage_project(project_id));
create policy tasks_staff_delete on public.project_tasks for delete to authenticated
using (public.can_manage_project(project_id));
