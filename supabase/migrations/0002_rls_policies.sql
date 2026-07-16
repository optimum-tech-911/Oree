-- Helper functions are SECURITY DEFINER so policies do not recurse through project_members.
create or replace function public.is_staff(p_roles text[] default array['advisor','admin'])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.staff_roles sr
    where sr.user_id = auth.uid()
      and sr.active = true
      and sr.role = any(p_roles)
  );
$$;

create or replace function public.is_project_member(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.project_members pm
    where pm.project_id = p_project_id
      and pm.user_id = auth.uid()
      and pm.invitation_status = 'accepted'
  );
$$;

create or replace function public.can_manage_project(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_staff(array['admin'])
      or exists (
        select 1 from public.projects p
        where p.id = p_project_id
          and p.assigned_advisor_id = auth.uid()
      );
$$;

revoke all on function public.is_staff(text[]) from public;
revoke all on function public.is_project_member(uuid) from public;
revoke all on function public.can_manage_project(uuid) from public;
grant execute on function public.is_staff(text[]) to authenticated;
grant execute on function public.is_project_member(uuid) to authenticated;
grant execute on function public.can_manage_project(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.staff_roles enable row level security;
alter table public.leads enable row level security;
alter table public.lead_attributions enable row level security;
alter table public.diagnostic_sessions enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.company_details enable row level security;
alter table public.founders enable row level security;
alter table public.document_requirements enable row level security;
alter table public.documents enable row level security;
alter table public.document_versions enable row level security;
alter table public.project_tasks enable row level security;
alter table public.project_events enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.appointments enable row level security;
alter table public.consent_records enable row level security;
alter table public.audit_events enable row level security;
alter table public.data_requests enable row level security;
alter table public.notification_jobs enable row level security;

create policy profiles_select_self on public.profiles for select to authenticated using (id = auth.uid() or public.is_staff());
create policy profiles_update_self on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy staff_roles_select_self on public.staff_roles for select to authenticated using (user_id = auth.uid() or public.is_staff(array['admin']));

create policy leads_staff_select on public.leads for select to authenticated using (public.is_staff(array['admin']) or assigned_advisor_id = auth.uid());
create policy leads_staff_update on public.leads for update to authenticated using (public.is_staff(array['admin']) or assigned_advisor_id = auth.uid()) with check (public.is_staff(array['admin']) or assigned_advisor_id = auth.uid());

create policy attribution_staff_select on public.lead_attributions for select to authenticated using (
  public.is_staff(array['admin']) or exists (select 1 from public.leads l where l.id = lead_id and l.assigned_advisor_id = auth.uid())
);

create policy diagnostics_owner_select on public.diagnostic_sessions for select to authenticated using (
  user_id = auth.uid() or (project_id is not null and public.is_project_member(project_id)) or public.can_manage_project(project_id)
);
create policy diagnostics_owner_update on public.diagnostic_sessions for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy projects_select on public.projects for select to authenticated using (public.is_project_member(id) or public.can_manage_project(id));
create policy projects_client_update on public.projects for update to authenticated using (
  exists (select 1 from public.project_members pm where pm.project_id = id and pm.user_id = auth.uid() and pm.member_role = 'owner' and pm.invitation_status = 'accepted')
  or public.can_manage_project(id)
) with check (
  exists (select 1 from public.project_members pm where pm.project_id = id and pm.user_id = auth.uid() and pm.member_role = 'owner' and pm.invitation_status = 'accepted')
  or public.can_manage_project(id)
);

create policy project_members_select on public.project_members for select to authenticated using (public.is_project_member(project_id) or public.can_manage_project(project_id));

create policy company_details_select on public.company_details for select to authenticated using (public.is_project_member(project_id) or public.can_manage_project(project_id));
create policy company_details_owner_update on public.company_details for update to authenticated using (public.is_project_member(project_id) or public.can_manage_project(project_id)) with check (public.is_project_member(project_id) or public.can_manage_project(project_id));

create policy founders_select on public.founders for select to authenticated using (public.is_project_member(project_id) or public.can_manage_project(project_id));
create policy founders_owner_write on public.founders for all to authenticated using (public.is_project_member(project_id) or public.can_manage_project(project_id)) with check (public.is_project_member(project_id) or public.can_manage_project(project_id));

create policy requirements_select on public.document_requirements for select to authenticated using (public.is_project_member(project_id) or public.can_manage_project(project_id));
create policy requirements_staff_write on public.document_requirements for all to authenticated using (public.can_manage_project(project_id)) with check (public.can_manage_project(project_id));

create policy documents_select on public.documents for select to authenticated using (public.is_project_member(project_id) or public.can_manage_project(project_id));
create policy documents_member_insert on public.documents for insert to authenticated with check (uploaded_by = auth.uid() and public.is_project_member(project_id));
create policy documents_staff_update on public.documents for update to authenticated using (public.can_manage_project(project_id)) with check (public.can_manage_project(project_id));

create policy versions_select on public.document_versions for select to authenticated using (
  exists (select 1 from public.documents d where d.id = document_id and (public.is_project_member(d.project_id) or public.can_manage_project(d.project_id)))
);
create policy versions_member_insert on public.document_versions for insert to authenticated with check (
  uploaded_by = auth.uid() and exists (select 1 from public.documents d where d.id = document_id and public.is_project_member(d.project_id))
);

create policy tasks_select on public.project_tasks for select to authenticated using (public.is_project_member(project_id) or public.can_manage_project(project_id));
create policy tasks_staff_write on public.project_tasks for all to authenticated using (public.can_manage_project(project_id)) with check (public.can_manage_project(project_id));

create policy events_select on public.project_events for select to authenticated using (public.is_project_member(project_id) or public.can_manage_project(project_id));
create policy events_staff_insert on public.project_events for insert to authenticated with check (public.can_manage_project(project_id));

create policy conversations_select on public.conversations for select to authenticated using (public.is_project_member(project_id) or public.can_manage_project(project_id));

create policy messages_select on public.messages for select to authenticated using (
  exists (select 1 from public.conversations c where c.id = conversation_id and (public.is_project_member(c.project_id) or public.can_manage_project(c.project_id)))
  and (internal_only = false or public.can_manage_project((select project_id from public.conversations where id = conversation_id)))
);
create policy messages_insert on public.messages for insert to authenticated with check (
  sender_user_id = auth.uid()
  and exists (select 1 from public.conversations c where c.id = conversation_id and (public.is_project_member(c.project_id) or public.can_manage_project(c.project_id)))
  and (internal_only = false or public.can_manage_project((select project_id from public.conversations where id = conversation_id)))
);

create policy appointments_select on public.appointments for select to authenticated using (
  (project_id is not null and (public.is_project_member(project_id) or public.can_manage_project(project_id)))
  or advisor_id = auth.uid()
);
create policy appointments_member_insert on public.appointments for insert to authenticated with check (
  project_id is not null and public.is_project_member(project_id)
);
create policy appointments_update on public.appointments for update to authenticated using (
  (project_id is not null and public.is_project_member(project_id)) or advisor_id = auth.uid() or public.is_staff(array['admin'])
) with check (
  (project_id is not null and public.is_project_member(project_id)) or advisor_id = auth.uid() or public.is_staff(array['admin'])
);

create policy consent_owner_select on public.consent_records for select to authenticated using (user_id = auth.uid() or public.is_staff(array['admin']));
create policy consent_owner_insert on public.consent_records for insert to authenticated with check (user_id = auth.uid());

create policy audit_staff_select on public.audit_events for select to authenticated using (public.is_staff(array['admin']) or (project_id is not null and public.can_manage_project(project_id)));

create policy data_requests_owner_select on public.data_requests for select to authenticated using (user_id = auth.uid() or public.is_staff(array['admin']));
create policy data_requests_owner_insert on public.data_requests for insert to authenticated with check (user_id = auth.uid());

-- Notification jobs and public lead writes intentionally have no browser policies.

create or replace function public.create_project_bundle(
  p_display_name text,
  p_lead_id uuid default null,
  p_activity text default null,
  p_department text default null,
  p_desired_date date default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_project uuid;
begin
  if v_user is null then
    raise exception 'authentication required';
  end if;

  insert into public.projects(owner_user_id, lead_id, display_name, activity_description, department, desired_creation_date)
  values (v_user, p_lead_id, left(trim(p_display_name), 160), p_activity, p_department, p_desired_date)
  returning id into v_project;

  insert into public.project_members(project_id, user_id, member_role)
  values (v_project, v_user, 'owner');

  insert into public.company_details(project_id) values (v_project);
  insert into public.conversations(project_id) values (v_project);
  insert into public.project_events(project_id, event_type, event_state, actor_user_id, title, description)
  values (v_project, 'project_created', 'done', v_user, 'Projet créé', 'Votre espace de création est prêt.');

  insert into public.document_requirements(project_id, document_type, label, category)
  values
    (v_project, 'identity', 'Pièce d’identité du dirigeant', 'Identité'),
    (v_project, 'registered_office', 'Justificatif du siège social', 'Siège'),
    (v_project, 'non_conviction', 'Déclaration de non-condamnation', 'Dirigeant');

  if p_lead_id is not null then
    update public.leads
      set linked_user_id = v_user, linked_project_id = v_project, commercial_status = 'converted'
      where id = p_lead_id and lower(email) = lower(coalesce((select email from auth.users where id = v_user), ''));
  end if;

  return v_project;
end;
$$;

revoke all on function public.create_project_bundle(text, uuid, text, text, date) from public;
grant execute on function public.create_project_bundle(text, uuid, text, text, date) to authenticated;
