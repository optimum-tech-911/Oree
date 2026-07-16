-- Orée - initial schema
create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  preferred_language text not null default 'fr',
  timezone text not null default 'Europe/Paris',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.staff_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('advisor', 'admin')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  department text,
  project_description text,
  project_stage text,
  desired_creation_window text,
  preferred_contact_method text,
  preferred_contact_time text,
  commercial_status text not null default 'new' check (commercial_status in ('new','contact_attempted','contacted','qualified','appointment_booked','proposal_sent','converted','lost','invalid')),
  commercial_score integer not null default 0,
  assigned_advisor_id uuid references auth.users(id) on delete set null,
  linked_user_id uuid references auth.users(id) on delete set null,
  linked_project_id uuid,
  claim_token_hash text,
  source_page text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lead_attributions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  first_source text,
  first_medium text,
  first_campaign text,
  first_term text,
  first_content text,
  first_landing_page text,
  first_referrer text,
  last_source text,
  last_medium text,
  last_campaign text,
  last_term text,
  last_content text,
  last_landing_page text,
  gclid text,
  gbraid text,
  wbraid text,
  first_visit_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.diagnostic_sessions (
  id uuid primary key default gen_random_uuid(),
  anonymous_session_id text,
  user_id uuid references auth.users(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  project_id uuid,
  definition_version text not null default '1.0.0',
  rule_version text not null default '1.0.0',
  status text not null default 'started' check (status in ('started','completed','converted','abandoned')),
  last_step text,
  answers_json jsonb not null default '{}'::jsonb,
  result_json jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  lead_id uuid references public.leads(id) on delete set null,
  display_name text not null,
  project_stage text not null default 'draft' check (project_stage in ('draft','orientation','information_collection','documents_requested','documents_review','awaiting_signature','formalities_preparation','submitted','correction_required','registered','cancelled')),
  current_legal_form text check (current_legal_form is null or current_legal_form in ('SASU','EURL','SAS','SARL','EI','MICRO')),
  considered_legal_forms text[] not null default '{}',
  activity_category text,
  activity_description text,
  department text,
  desired_creation_date date,
  complexity_level text check (complexity_level is null or complexity_level in ('simple','moderate','complex')),
  progress smallint not null default 5 check (progress between 0 and 100),
  assigned_advisor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads
  add constraint leads_linked_project_fk foreign key (linked_project_id) references public.projects(id) on delete set null;
alter table public.diagnostic_sessions
  add constraint diagnostic_project_fk foreign key (project_id) references public.projects(id) on delete set null;

create table public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  member_role text not null check (member_role in ('owner','cofounder','viewer')),
  invitation_status text not null default 'accepted' check (invitation_status in ('pending','accepted','declined','revoked')),
  created_at timestamptz not null default now(),
  unique (project_id, user_id)
);

create table public.company_details (
  project_id uuid primary key references public.projects(id) on delete cascade,
  proposed_company_name text,
  legal_form text check (legal_form is null or legal_form in ('SASU','EURL','SAS','SARL','EI','MICRO')),
  registered_office_type text,
  registered_office_address jsonb not null default '{}'::jsonb,
  capital_amount numeric(14,2),
  capital_type text,
  fiscal_year_end date,
  management_structure jsonb not null default '{}'::jsonb,
  activity_start_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.founders (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  linked_user_id uuid references auth.users(id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text,
  founder_type text not null default 'individual' check (founder_type in ('individual','legal_entity')),
  ownership_percentage numeric(5,2) check (ownership_percentage is null or (ownership_percentage >= 0 and ownership_percentage <= 100)),
  management_role text,
  verification_status text not null default 'pending' check (verification_status in ('pending','invited','information_complete','verified','changes_requested')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.document_requirements (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  document_type text not null,
  label text not null,
  category text not null default 'Projet',
  required boolean not null default true,
  requested_from_founder_id uuid references public.founders(id) on delete set null,
  status text not null default 'required' check (status in ('not_requested','required','uploaded','under_review','changes_requested','approved','signed','rejected')),
  advisor_comment text,
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  requirement_id uuid references public.document_requirements(id) on delete set null,
  uploaded_by uuid not null references auth.users(id) on delete restrict,
  current_version_id uuid,
  classification text not null default 'project_document',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  storage_path text not null unique,
  original_filename text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  checksum text,
  uploaded_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

alter table public.documents
  add constraint documents_current_version_fk foreign key (current_version_id) references public.document_versions(id) on delete set null;

create table public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  assigned_to uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo','in_progress','blocked','done','cancelled')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  event_type text not null,
  event_state text not null default 'done' check (event_state in ('done','current','upcoming')),
  actor_user_id uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_user_id uuid not null references auth.users(id) on delete restrict,
  message_type text not null default 'text' check (message_type in ('text','system','document_request','appointment')),
  body text not null,
  related_document_id uuid references public.documents(id) on delete set null,
  internal_only boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  advisor_id uuid references auth.users(id) on delete set null,
  appointment_type text not null default 'video' check (appointment_type in ('phone','video','onsite')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'booked' check (status in ('booked','confirmed','completed','cancelled','no_show')),
  external_provider text,
  external_event_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.consent_records (
  id uuid primary key default gen_random_uuid(),
  anonymous_session_id text,
  user_id uuid references auth.users(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  consent_type text not null,
  consent_state text not null check (consent_state in ('granted','denied','withdrawn')),
  policy_version text not null,
  source text not null,
  recorded_at timestamptz not null default now(),
  withdrawn_at timestamptz
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.data_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  request_type text not null check (request_type in ('access','export','rectification','deletion','restriction','objection')),
  status text not null default 'received' check (status in ('received','in_review','completed','rejected')),
  requested_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.notification_jobs (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('email','sms','webhook')),
  template_key text not null,
  recipient text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending','processing','sent','failed','cancelled')),
  attempts smallint not null default 0,
  next_attempt_at timestamptz not null default now(),
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_status_idx on public.leads(commercial_status, created_at desc);
create index leads_email_idx on public.leads(lower(email));
create index leads_assigned_idx on public.leads(assigned_advisor_id);
create index lead_attributions_lead_idx on public.lead_attributions(lead_id);
create index diagnostic_user_idx on public.diagnostic_sessions(user_id, updated_at desc);
create index diagnostic_lead_idx on public.diagnostic_sessions(lead_id);
create index projects_owner_idx on public.projects(owner_user_id);
create index projects_advisor_idx on public.projects(assigned_advisor_id, project_stage);
create index project_members_user_idx on public.project_members(user_id, project_id);
create index founders_project_idx on public.founders(project_id);
create index document_requirements_project_idx on public.document_requirements(project_id, status);
create index documents_project_idx on public.documents(project_id);
create index document_versions_document_idx on public.document_versions(document_id, created_at desc);
create index project_tasks_project_idx on public.project_tasks(project_id, status);
create index project_events_project_idx on public.project_events(project_id, created_at desc);
create index messages_conversation_idx on public.messages(conversation_id, created_at);
create index appointments_project_idx on public.appointments(project_id, starts_at);
create index appointments_advisor_idx on public.appointments(advisor_id, starts_at);
create index audit_project_idx on public.audit_events(project_id, created_at desc);
create index notification_jobs_pending_idx on public.notification_jobs(status, next_attempt_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger staff_roles_updated_at before update on public.staff_roles for each row execute function public.set_updated_at();
create trigger leads_updated_at before update on public.leads for each row execute function public.set_updated_at();
create trigger diagnostic_sessions_updated_at before update on public.diagnostic_sessions for each row execute function public.set_updated_at();
create trigger projects_updated_at before update on public.projects for each row execute function public.set_updated_at();
create trigger company_details_updated_at before update on public.company_details for each row execute function public.set_updated_at();
create trigger founders_updated_at before update on public.founders for each row execute function public.set_updated_at();
create trigger document_requirements_updated_at before update on public.document_requirements for each row execute function public.set_updated_at();
create trigger documents_updated_at before update on public.documents for each row execute function public.set_updated_at();
create trigger project_tasks_updated_at before update on public.project_tasks for each row execute function public.set_updated_at();
create trigger appointments_updated_at before update on public.appointments for each row execute function public.set_updated_at();
create trigger notification_jobs_updated_at before update on public.notification_jobs for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'first_name', ''),
    nullif(new.raw_user_meta_data ->> 'last_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
