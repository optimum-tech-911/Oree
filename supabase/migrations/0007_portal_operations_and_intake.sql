-- Production portal contracts: atomic lead intake, idempotent project creation,
-- controlled operational mutations and appointment requests.

alter table public.leads
  add column if not exists intake_key uuid,
  add column if not exists claim_token_expires_at timestamptz;

create unique index if not exists leads_intake_key_idx
  on public.leads(intake_key)
  where intake_key is not null;

alter table public.profiles
  add column if not exists availability_note text,
  add column if not exists notification_preferences jsonb not null default '{"email":true,"documents":true,"appointments":true,"messages":true}'::jsonb;

alter table public.appointments drop constraint if exists appointments_status_check;
alter table public.appointments add constraint appointments_status_check
  check (status in ('requested','booked','confirmed','completed','cancelled','no_show'));

create unique index if not exists projects_unique_lead_idx
  on public.projects(lead_id)
  where lead_id is not null;

create or replace function public.submit_lead_bundle(
  p_answers jsonb,
  p_attribution jsonb,
  p_result jsonb,
  p_anonymous_session_id text,
  p_submission_id uuid,
  p_claim_token_hash text,
  p_privacy_policy_version text,
  p_notification_email text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_lead uuid;
  v_safe_answers jsonb;
begin
  if p_submission_id is null or length(coalesce(p_claim_token_hash, '')) < 40 then
    raise exception 'invalid intake identity';
  end if;
  if coalesce(p_answers ->> 'privacyAccepted', 'false') <> 'true' then
    raise exception 'privacy consent required';
  end if;
  if length(trim(coalesce(p_privacy_policy_version, ''))) = 0 then
    raise exception 'privacy policy version required';
  end if;

  select id into v_lead from public.leads where intake_key = p_submission_id;
  if v_lead is not null then
    return v_lead;
  end if;

  insert into public.leads (
    intake_key, first_name, last_name, email, phone, preferred_contact_method,
    department, project_description, project_stage, desired_creation_window,
    source_page, claim_token_hash, claim_token_expires_at
  ) values (
    p_submission_id,
    left(trim(p_answers ->> 'firstName'), 80),
    left(trim(p_answers ->> 'lastName'), 100),
    lower(left(trim(p_answers ->> 'email'), 254)),
    nullif(left(trim(coalesce(p_answers ->> 'phone', '')), 30), ''),
    case when coalesce((p_answers ->> 'wantsCallback')::boolean, false) then 'phone' else 'email' end,
    nullif(left(trim(coalesce(p_answers ->> 'department', '')), 8), ''),
    nullif(left(trim(coalesce(p_answers ->> 'blockedMessage', '')), 4000), ''),
    nullif(left(trim(coalesce(p_answers ->> 'stage', '')), 80), ''),
    nullif(left(trim(coalesce(p_answers ->> 'timeline', '')), 30), ''),
    nullif(left(trim(coalesce(p_attribution ->> 'landing_page', '')), 2048), ''),
    p_claim_token_hash,
    now() + interval '24 hours'
  ) returning id into v_lead;

  insert into public.lead_attributions (
    lead_id, first_source, first_medium, first_campaign, first_term, first_content,
    first_landing_page, first_referrer, last_source, last_medium, last_campaign,
    last_term, last_content, last_landing_page, gclid, gbraid, wbraid, first_visit_at
  ) values (
    v_lead,
    p_attribution ->> 'utm_source', p_attribution ->> 'utm_medium',
    p_attribution ->> 'utm_campaign', p_attribution ->> 'utm_term',
    p_attribution ->> 'utm_content', p_attribution ->> 'landing_page',
    p_attribution ->> 'referrer', p_attribution ->> 'utm_source',
    p_attribution ->> 'utm_medium', p_attribution ->> 'utm_campaign',
    p_attribution ->> 'utm_term', p_attribution ->> 'utm_content',
    p_attribution ->> 'landing_page', p_attribution ->> 'gclid',
    p_attribution ->> 'gbraid', p_attribution ->> 'wbraid',
    nullif(p_attribution ->> 'first_visit_at', '')::timestamptz
  );

  v_safe_answers := p_answers - array[
    'firstName', 'lastName', 'email', 'phone', 'privacyAccepted', 'wantsCallback'
  ];

  insert into public.diagnostic_sessions (
    anonymous_session_id, lead_id, status, last_step, answers_json, result_json, completed_at
  ) values (
    nullif(left(trim(coalesce(p_anonymous_session_id, '')), 160), ''),
    v_lead, 'completed', 'contact', coalesce(v_safe_answers, '{}'::jsonb),
    coalesce(p_result, '{}'::jsonb), now()
  );

  insert into public.consent_records (
    anonymous_session_id, lead_id, consent_type, consent_state, policy_version, source
  ) values (
    nullif(left(trim(coalesce(p_anonymous_session_id, '')), 160), ''),
    v_lead, 'lead_request_processing', 'granted',
    left(trim(p_privacy_policy_version), 120), 'diagnostic_contact'
  );

  if length(trim(coalesce(p_notification_email, ''))) > 0 then
    insert into public.notification_jobs(channel, template_key, recipient, payload)
    values ('email', 'new_lead', left(trim(p_notification_email), 320), jsonb_build_object('leadId', v_lead));
  end if;

  return v_lead;
end;
$$;

revoke all on function public.submit_lead_bundle(jsonb, jsonb, jsonb, text, uuid, text, text, text) from public, anon, authenticated;
grant execute on function public.submit_lead_bundle(jsonb, jsonb, jsonb, text, uuid, text, text, text) to service_role;

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
set search_path = public, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_project uuid;
  v_linked_user uuid;
  v_existing_project uuid;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if length(trim(coalesce(p_display_name, ''))) < 2 then raise exception 'display name required'; end if;

  if p_lead_id is not null then
    select linked_user_id, linked_project_id
      into v_linked_user, v_existing_project
      from public.leads where id = p_lead_id for update;
    if not found then raise exception 'lead not found'; end if;
    if v_linked_user is distinct from v_user then raise exception 'lead ownership required'; end if;
    if v_existing_project is not null then return v_existing_project; end if;
  end if;

  insert into public.projects(owner_user_id, lead_id, display_name, activity_description, department, desired_creation_date)
  values (v_user, p_lead_id, left(trim(p_display_name), 160), nullif(trim(p_activity), ''), nullif(trim(p_department), ''), p_desired_date)
  returning id into v_project;

  insert into public.project_members(project_id, user_id, member_role) values (v_project, v_user, 'owner');
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
    update public.leads set linked_project_id = v_project, commercial_status = 'converted' where id = p_lead_id;
    update public.diagnostic_sessions set user_id = v_user, project_id = v_project, status = 'converted' where lead_id = p_lead_id;
    update public.consent_records set user_id = v_user where lead_id = p_lead_id;
  end if;

  return v_project;
end;
$$;

revoke all on function public.create_project_bundle(text, uuid, text, text, date) from public;
grant execute on function public.create_project_bundle(text, uuid, text, text, date) to authenticated;

create or replace function public.request_project_appointment(
  p_project_id uuid,
  p_starts_at timestamptz,
  p_duration_minutes integer,
  p_appointment_type text,
  p_notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_id uuid;
begin
  if auth.uid() is null or not public.is_project_member(p_project_id) then raise exception 'project membership required'; end if;
  if p_starts_at < now() + interval '1 hour' or p_starts_at > now() + interval '180 days' then raise exception 'invalid appointment date'; end if;
  if p_duration_minutes not in (30, 45, 60) then raise exception 'invalid duration'; end if;
  if p_appointment_type not in ('phone','video','onsite') then raise exception 'invalid appointment type'; end if;

  insert into public.appointments(project_id, appointment_type, starts_at, ends_at, status, notes)
  values (p_project_id, p_appointment_type, p_starts_at, p_starts_at + make_interval(mins => p_duration_minutes), 'requested', nullif(left(trim(p_notes), 2000), ''))
  returning id into v_id;
  insert into public.audit_events(actor_user_id, project_id, action, entity_type, entity_id)
  values (auth.uid(), p_project_id, 'appointment_requested', 'appointment', v_id::text);
  return v_id;
end;
$$;

revoke all on function public.request_project_appointment(uuid, timestamptz, integer, text, text) from public;
grant execute on function public.request_project_appointment(uuid, timestamptz, integer, text, text) to authenticated;

create or replace function public.ops_update_lead(
  p_lead_id uuid,
  p_status text,
  p_score integer,
  p_assigned_advisor_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_current_advisor uuid;
begin
  if not public.is_staff() then raise exception 'staff role required'; end if;
  if p_status not in ('new','contact_attempted','contacted','qualified','appointment_booked','proposal_sent','converted','lost','invalid') then raise exception 'invalid lead status'; end if;
  if p_score < 0 or p_score > 100 then raise exception 'invalid score'; end if;
  select assigned_advisor_id into v_current_advisor from public.leads where id = p_lead_id for update;
  if not found then raise exception 'lead not found'; end if;
  if not public.is_staff(array['admin']) then
    if v_current_advisor is not null and v_current_advisor <> auth.uid() then raise exception 'lead assignment required'; end if;
    if p_assigned_advisor_id is not null and p_assigned_advisor_id <> auth.uid() then raise exception 'cannot assign another advisor'; end if;
  end if;
  if p_assigned_advisor_id is not null and not exists (
    select 1 from public.staff_roles where user_id = p_assigned_advisor_id and active and role in ('advisor','admin')
  ) then raise exception 'invalid advisor'; end if;
  update public.leads set commercial_status = p_status, commercial_score = p_score,
    assigned_advisor_id = coalesce(p_assigned_advisor_id, assigned_advisor_id) where id = p_lead_id;
  insert into public.audit_events(actor_user_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'lead_updated', 'lead', p_lead_id::text, jsonb_build_object('status', p_status, 'score', p_score));
end;
$$;

revoke all on function public.ops_update_lead(uuid, text, integer, uuid) from public;
grant execute on function public.ops_update_lead(uuid, text, integer, uuid) to authenticated;

create or replace function public.ops_update_project_stage(p_project_id uuid, p_stage text, p_progress integer)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.can_manage_project(p_project_id) then raise exception 'project management permission required'; end if;
  if p_stage not in ('draft','orientation','information_collection','documents_requested','documents_review','awaiting_signature','formalities_preparation','submitted','correction_required','registered','cancelled') then raise exception 'invalid project stage'; end if;
  if p_progress < 0 or p_progress > 100 then raise exception 'invalid progress'; end if;
  update public.projects set project_stage = p_stage, progress = p_progress where id = p_project_id;
  insert into public.project_events(project_id, event_type, event_state, actor_user_id, title, description)
  values (p_project_id, 'stage_updated', 'done', auth.uid(), 'Étape du projet mise à jour', p_stage);
  insert into public.audit_events(actor_user_id, project_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), p_project_id, 'project_stage_updated', 'project', p_project_id::text, jsonb_build_object('stage', p_stage, 'progress', p_progress));
end;
$$;

revoke all on function public.ops_update_project_stage(uuid, text, integer) from public;
grant execute on function public.ops_update_project_stage(uuid, text, integer) to authenticated;

create or replace function public.ops_review_requirement(p_requirement_id uuid, p_status text, p_comment text default null)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_project uuid;
begin
  select project_id into v_project from public.document_requirements where id = p_requirement_id for update;
  if v_project is null or not public.can_manage_project(v_project) then raise exception 'document review permission required'; end if;
  if p_status not in ('under_review','changes_requested','approved','rejected') then raise exception 'invalid review status'; end if;
  if p_status in ('changes_requested','rejected') and length(trim(coalesce(p_comment, ''))) < 5 then raise exception 'review comment required'; end if;
  update public.document_requirements set status = p_status, advisor_comment = nullif(left(trim(p_comment), 2000), '') where id = p_requirement_id;
  insert into public.project_events(project_id, event_type, event_state, actor_user_id, title, description)
  values (v_project, 'document_reviewed', 'done', auth.uid(), 'Contrôle documentaire mis à jour', p_comment);
  insert into public.audit_events(actor_user_id, project_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), v_project, 'document_requirement_reviewed', 'document_requirement', p_requirement_id::text, jsonb_build_object('status', p_status));
end;
$$;

revoke all on function public.ops_review_requirement(uuid, text, text) from public;
grant execute on function public.ops_review_requirement(uuid, text, text) to authenticated;

create or replace function public.ops_manage_appointment(
  p_appointment_id uuid,
  p_status text,
  p_advisor_id uuid default null,
  p_notes text default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare v_project uuid; v_current_advisor uuid;
begin
  if not public.is_staff() then raise exception 'staff role required'; end if;
  if p_status not in ('booked','confirmed','completed','cancelled','no_show') then raise exception 'invalid appointment status'; end if;
  select project_id, advisor_id into v_project, v_current_advisor from public.appointments where id = p_appointment_id for update;
  if not found then raise exception 'appointment not found'; end if;
  if not public.is_staff(array['admin']) then
    if v_current_advisor is not null and v_current_advisor <> auth.uid() then raise exception 'appointment assignment required'; end if;
    if p_advisor_id is not null and p_advisor_id <> auth.uid() then raise exception 'cannot assign another advisor'; end if;
  end if;
  update public.appointments set status = p_status, advisor_id = coalesce(p_advisor_id, advisor_id, auth.uid()), notes = coalesce(nullif(left(trim(p_notes), 2000), ''), notes) where id = p_appointment_id;
  insert into public.audit_events(actor_user_id, project_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), v_project, 'appointment_updated', 'appointment', p_appointment_id::text, jsonb_build_object('status', p_status));
end;
$$;

revoke all on function public.ops_manage_appointment(uuid, text, uuid, text) from public;
grant execute on function public.ops_manage_appointment(uuid, text, uuid, text) to authenticated;

create or replace function public.admin_set_staff_role(p_user_id uuid, p_role text, p_active boolean)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_staff(array['admin']) then raise exception 'admin role required'; end if;
  if p_role not in ('advisor','admin') then raise exception 'invalid staff role'; end if;
  if p_user_id = auth.uid() and not p_active then raise exception 'cannot deactivate own admin access'; end if;
  insert into public.staff_roles(user_id, role, active) values (p_user_id, p_role, p_active)
  on conflict (user_id) do update set role = excluded.role, active = excluded.active;
  insert into public.audit_events(actor_user_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'staff_role_updated', 'staff_role', p_user_id::text, jsonb_build_object('role', p_role, 'active', p_active));
end;
$$;

revoke all on function public.admin_set_staff_role(uuid, text, boolean) from public;
grant execute on function public.admin_set_staff_role(uuid, text, boolean) to authenticated;

grant update (first_name, last_name, phone, preferred_language, timezone, availability_note, notification_preferences, updated_at)
  on table public.profiles to authenticated;

