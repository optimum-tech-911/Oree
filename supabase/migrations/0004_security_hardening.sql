-- Security and lifecycle hardening applied after the base schema.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'first_name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'last_name', '')), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_updated_at() from public;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles','staff_roles','leads','diagnostic_sessions','projects','company_details',
    'founders','document_requirements','documents','project_tasks','appointments','data_requests'
  ]
  loop
    execute format(
      'drop trigger if exists %I on public.%I',
      'set_' || table_name || '_updated_at',
      table_name
    );
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
      'set_' || table_name || '_updated_at',
      table_name
    );
  end loop;
end;
$$;

-- Browser clients may edit descriptive project information only. Operational state,
-- advisor assignment and progress are changed through controlled server operations.
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

-- Replace the broad founder policy with lifecycle-aware policies.
drop policy if exists founders_owner_write on public.founders;

create policy founders_member_insert
on public.founders for insert to authenticated
with check (
  public.can_manage_project(project_id)
  or (
    public.is_project_member(project_id)
    and verification_status in ('pending','invited','information_complete')
  )
);

create policy founders_member_update
on public.founders for update to authenticated
using (public.is_project_member(project_id) or public.can_manage_project(project_id))
with check (
  public.can_manage_project(project_id)
  or (
    public.is_project_member(project_id)
    and verification_status in ('pending','invited','information_complete','changes_requested')
  )
);

create policy founders_owner_delete
on public.founders for delete to authenticated
using (
  public.can_manage_project(project_id)
  or exists (
    select 1
    from public.project_members pm
    where pm.project_id = founders.project_id
      and pm.user_id = auth.uid()
      and pm.member_role = 'owner'
      and pm.invitation_status = 'accepted'
  )
);

-- Explicit grants document the intended browser surface. Anonymous visitors receive
-- no direct table writes; lead creation remains an Edge Function responsibility.
revoke all on table public.leads, public.lead_attributions, public.notification_jobs from anon;
revoke all on table public.projects, public.project_members, public.documents, public.document_versions from anon;
