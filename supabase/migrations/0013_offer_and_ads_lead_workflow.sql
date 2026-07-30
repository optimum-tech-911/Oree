-- Confirmed commercial offer and Google Ads lead workflow.
-- The public intake remains service-role-only through the submit-lead Edge Function.

alter table public.leads
  add column if not exists legal_form_interest text,
  add column if not exists activity text,
  add column if not exists creation_timeline text,
  add column if not exists message text,
  add column if not exists last_contact_at timestamptz,
  add column if not exists next_follow_up_at timestamptz,
  add column if not exists qualification_reason text,
  add column if not exists lost_reason text,
  add column if not exists customer_won_at timestamptz;

alter table public.leads drop constraint if exists leads_legal_form_interest_check;
alter table public.leads add constraint leads_legal_form_interest_check
  check (legal_form_interest is null or legal_form_interest in ('SASU','EURL','SAS','SARL','EI','MICRO','OTHER'));

alter table public.leads drop constraint if exists leads_commercial_status_check;
update public.leads
set commercial_status = case commercial_status
  when 'contact_attempted' then 'to_contact'
  when 'converted' then 'won'
  when 'invalid' then 'out_of_scope'
  else commercial_status
end;
alter table public.leads add constraint leads_commercial_status_check
  check (commercial_status in ('new','to_contact','contacted','qualified','appointment_booked','proposal_sent','won','lost','out_of_scope','micro_only'));

create index if not exists leads_follow_up_idx
  on public.leads(next_follow_up_at)
  where next_follow_up_at is not null and commercial_status not in ('won','lost','out_of_scope','micro_only');

create table if not exists public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  author_user_id uuid not null references auth.users(id) on delete restrict,
  body text not null check (char_length(body) between 2 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists lead_notes_lead_idx on public.lead_notes(lead_id, created_at desc);
alter table public.lead_notes enable row level security;
revoke all on table public.lead_notes from public, anon, authenticated;
grant select on table public.lead_notes to authenticated;

drop policy if exists lead_notes_staff_select on public.lead_notes;
create policy lead_notes_staff_select on public.lead_notes
for select to authenticated
using (
  public.is_staff(array['admin'])
  or exists (
    select 1 from public.leads l
    where l.id = lead_id and l.assigned_advisor_id = (select auth.uid())
  )
);

create table if not exists public.lead_lifecycle_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  event_name text not null check (event_name in ('qualify_lead','close_convert_lead')),
  event_key text not null unique,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  exported_at timestamptz
);

create index if not exists lead_lifecycle_events_pending_idx
  on public.lead_lifecycle_events(occurred_at)
  where exported_at is null;
alter table public.lead_lifecycle_events enable row level security;
revoke all on table public.lead_lifecycle_events from public, anon, authenticated;
grant select on table public.lead_lifecycle_events to authenticated;

drop policy if exists lead_lifecycle_events_staff_select on public.lead_lifecycle_events;
create policy lead_lifecycle_events_staff_select on public.lead_lifecycle_events
for select to authenticated
using (
  public.is_staff(array['admin'])
  or exists (
    select 1 from public.leads l
    where l.id = lead_id and l.assigned_advisor_id = (select auth.uid())
  )
);

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
  v_legal_form text;
  v_activity text;
  v_timeline text;
  v_landing_page text;
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

  v_legal_form := upper(coalesce(nullif(p_answers ->> 'legalFormInterest', ''), p_result -> 'forms' ->> 0));
  if v_legal_form not in ('SASU','EURL','SAS','SARL','EI','MICRO','OTHER') then
    v_legal_form := null;
  end if;
  v_activity := nullif(left(trim(coalesce(p_answers ->> 'activityDetails', p_answers ->> 'activity', '')), 500), '');
  v_timeline := nullif(left(trim(coalesce(p_answers ->> 'creationTimeline', p_answers ->> 'timeline', '')), 80), '');
  v_landing_page := nullif(left(trim(coalesce(p_attribution ->> 'landing_page', '')), 2048), '');

  insert into public.leads (
    intake_key, first_name, last_name, email, phone, preferred_contact_method,
    department, project_description, project_stage, desired_creation_window,
    source_page, claim_token_hash, claim_token_expires_at, legal_form_interest,
    activity, creation_timeline, message
  ) values (
    p_submission_id,
    left(trim(p_answers ->> 'firstName'), 80),
    left(trim(p_answers ->> 'lastName'), 100),
    lower(left(trim(p_answers ->> 'email'), 254)),
    nullif(left(trim(coalesce(p_answers ->> 'phone', '')), 30), ''),
    coalesce(
      nullif(left(trim(coalesce(p_answers ->> 'preferredContactChannel', '')), 30), ''),
      case when coalesce((p_answers ->> 'wantsCallback')::boolean, false) then 'phone' else 'email' end
    ),
    nullif(left(trim(coalesce(p_answers ->> 'department', '')), 8), ''),
    nullif(left(trim(coalesce(p_answers ->> 'message', p_answers ->> 'blockedMessage', '')), 4000), ''),
    nullif(left(trim(coalesce(p_answers ->> 'stage', '')), 80), ''),
    v_timeline,
    v_landing_page,
    p_claim_token_hash,
    now() + interval '24 hours',
    v_legal_form,
    v_activity,
    v_timeline,
    nullif(left(trim(coalesce(p_answers ->> 'message', p_answers ->> 'blockedMessage', '')), 4000), '')
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
    'firstName', 'lastName', 'email', 'phone', 'privacyAccepted', 'wantsCallback',
    'message', 'blockedMessage', 'activityDetails', 'preferredContactChannel'
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
    values (
      'email',
      'new_lead',
      left(trim(p_notification_email), 320),
      jsonb_build_object(
        'leadId', v_lead,
        'securePath', '/ops/leads?lead=' || v_lead::text,
        'projectSummary', jsonb_build_object(
          'legalForm', v_legal_form,
          'activity', v_activity,
          'timeline', v_timeline
        ),
        'acquisitionSource', jsonb_build_object(
          'landingPage', v_landing_page,
          'campaign', p_attribution ->> 'utm_campaign',
          'keyword', p_attribution ->> 'utm_term'
        )
      )
    );
  end if;

  return v_lead;
end;
$$;

revoke all on function public.submit_lead_bundle(jsonb, jsonb, jsonb, text, uuid, text, text, text) from public, anon, authenticated;
grant execute on function public.submit_lead_bundle(jsonb, jsonb, jsonb, text, uuid, text, text, text) to service_role;

create or replace function public.ops_manage_lead(
  p_lead_id uuid,
  p_status text,
  p_score integer,
  p_assigned_advisor_id uuid default null,
  p_note text default null,
  p_next_follow_up_at timestamptz default null,
  p_qualification_reason text default null,
  p_lost_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_current_advisor uuid;
  v_current_status text;
  v_allowed boolean := false;
begin
  if not public.is_staff() then raise exception 'staff role required'; end if;
  if p_status not in ('new','to_contact','contacted','qualified','appointment_booked','proposal_sent','won','lost','out_of_scope','micro_only') then
    raise exception 'invalid lead status';
  end if;
  if p_score < 0 or p_score > 100 then raise exception 'invalid score'; end if;

  select assigned_advisor_id, commercial_status
  into v_current_advisor, v_current_status
  from public.leads where id = p_lead_id for update;
  if not found then raise exception 'lead not found'; end if;

  if not public.is_staff(array['admin']) then
    if v_current_advisor is not null and v_current_advisor <> auth.uid() then raise exception 'lead assignment required'; end if;
    if p_assigned_advisor_id is not null and p_assigned_advisor_id <> auth.uid() then raise exception 'cannot assign another advisor'; end if;
  end if;
  if p_assigned_advisor_id is not null and not exists (
    select 1 from public.staff_roles where user_id = p_assigned_advisor_id and active and role in ('advisor','admin')
  ) then raise exception 'invalid advisor'; end if;

  v_allowed := v_current_status = p_status
    or (v_current_status = 'new' and p_status = any(array['to_contact','contacted','qualified','appointment_booked','lost','out_of_scope','micro_only']))
    or (v_current_status = 'to_contact' and p_status = any(array['contacted','qualified','appointment_booked','lost','out_of_scope','micro_only']))
    or (v_current_status = 'contacted' and p_status = any(array['to_contact','qualified','appointment_booked','proposal_sent','lost','out_of_scope','micro_only']))
    or (v_current_status = 'qualified' and p_status = any(array['contacted','appointment_booked','proposal_sent','won','lost','out_of_scope']))
    or (v_current_status = 'appointment_booked' and p_status = any(array['contacted','qualified','proposal_sent','won','lost','out_of_scope']))
    or (v_current_status = 'proposal_sent' and p_status = any(array['contacted','qualified','appointment_booked','won','lost','out_of_scope']))
    or (v_current_status = 'lost' and p_status = any(array['to_contact','contacted']))
    or (v_current_status in ('out_of_scope','micro_only') and p_status = 'to_contact');
  if not v_allowed then raise exception 'invalid lead status transition'; end if;

  if p_status in ('qualified','out_of_scope') and length(trim(coalesce(p_qualification_reason, ''))) < 2 then
    raise exception 'qualification reason required';
  end if;
  if p_status = 'lost' and length(trim(coalesce(p_lost_reason, ''))) < 2 then
    raise exception 'lost reason required';
  end if;

  update public.leads set
    commercial_status = p_status,
    commercial_score = p_score,
    assigned_advisor_id = coalesce(p_assigned_advisor_id, assigned_advisor_id),
    next_follow_up_at = p_next_follow_up_at,
    qualification_reason = coalesce(nullif(left(trim(p_qualification_reason), 1000), ''), qualification_reason),
    lost_reason = coalesce(nullif(left(trim(p_lost_reason), 1000), ''), lost_reason),
    last_contact_at = case
      when p_status in ('contacted','qualified','appointment_booked','proposal_sent','won','lost') then now()
      else last_contact_at
    end,
    customer_won_at = case when p_status = 'won' then coalesce(customer_won_at, now()) else customer_won_at end
  where id = p_lead_id;

  if length(trim(coalesce(p_note, ''))) >= 2 then
    insert into public.lead_notes(lead_id, author_user_id, body)
    values (p_lead_id, auth.uid(), left(trim(p_note), 4000));
  end if;

  if p_status = 'qualified' then
    insert into public.lead_lifecycle_events(lead_id, event_name, event_key, payload)
    values (p_lead_id, 'qualify_lead', p_lead_id::text || ':qualify_lead', jsonb_build_object('status', p_status))
    on conflict (event_key) do nothing;
  elsif p_status = 'won' then
    insert into public.lead_lifecycle_events(lead_id, event_name, event_key, payload)
    values (p_lead_id, 'close_convert_lead', p_lead_id::text || ':close_convert_lead', jsonb_build_object('status', p_status))
    on conflict (event_key) do nothing;
  end if;

  insert into public.audit_events(actor_user_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(),
    'lead_managed',
    'lead',
    p_lead_id::text,
    jsonb_build_object(
      'previousStatus', v_current_status,
      'status', p_status,
      'score', p_score,
      'nextFollowUpAt', p_next_follow_up_at
    )
  );
end;
$$;

revoke all on function public.ops_manage_lead(uuid, text, integer, uuid, text, timestamptz, text, text) from public;
grant execute on function public.ops_manage_lead(uuid, text, integer, uuid, text, timestamptz, text, text) to authenticated;

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
declare v_user uuid := auth.uid(); v_project uuid; v_linked_user uuid; v_existing_project uuid;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if length(trim(coalesce(p_display_name, ''))) < 2 then raise exception 'display name required'; end if;
  if p_lead_id is not null then
    select linked_user_id, linked_project_id into v_linked_user, v_existing_project
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
    update public.leads set linked_project_id = v_project, commercial_status = 'won',
      customer_won_at = coalesce(customer_won_at, now()) where id = p_lead_id;
    update public.diagnostic_sessions set user_id = v_user, project_id = v_project, status = 'converted' where lead_id = p_lead_id;
    update public.consent_records set user_id = v_user where lead_id = p_lead_id;
    insert into public.lead_lifecycle_events(lead_id, event_name, event_key, payload)
    values (p_lead_id, 'close_convert_lead', p_lead_id::text || ':close_convert_lead', jsonb_build_object('status', 'won'))
    on conflict (event_key) do nothing;
  end if;
  return v_project;
end;
$$;

revoke all on function public.create_project_bundle(text, uuid, text, text, date) from public;
grant execute on function public.create_project_bundle(text, uuid, text, text, date) to authenticated;
