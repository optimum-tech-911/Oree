create table if not exists public.lead_intake_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  email_hash text,
  origin text,
  user_agent text,
  accepted boolean not null default false,
  rejection_reason text,
  lead_id uuid references public.leads(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists lead_intake_attempts_ip_created_idx
  on public.lead_intake_attempts(ip_hash, created_at desc);

create index if not exists lead_intake_attempts_email_created_idx
  on public.lead_intake_attempts(email_hash, created_at desc)
  where email_hash is not null;

alter table public.lead_intake_attempts enable row level security;

revoke all on table public.lead_intake_attempts from public, anon, authenticated;
revoke all on sequence public.lead_intake_attempts_id_seq from public, anon, authenticated;

grant select, insert on table public.lead_intake_attempts to service_role;
grant usage, select on sequence public.lead_intake_attempts_id_seq to service_role;
