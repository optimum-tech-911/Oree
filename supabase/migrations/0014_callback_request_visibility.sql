-- Make callback requests explicit and immediately visible in the operations queue.
-- Existing intake functions already map wantsCallback=true to the phone contact method;
-- the trigger keeps this migration additive and compatible with deployed function versions.

alter table public.leads
  add column if not exists callback_requested boolean not null default false;

update public.leads
set callback_requested = true
where preferred_contact_method = 'phone'
  and callback_requested = false;

create or replace function public.mark_callback_request()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.callback_requested := coalesce(new.callback_requested, false)
    or new.preferred_contact_method = 'phone';
  return new;
end;
$$;

revoke all on function public.mark_callback_request() from public, anon, authenticated;

drop trigger if exists leads_mark_callback_request on public.leads;
create trigger leads_mark_callback_request
before insert on public.leads
for each row execute function public.mark_callback_request();

create index if not exists leads_callback_queue_idx
  on public.leads(created_at desc)
  where callback_requested = true
    and commercial_status not in ('won','lost','out_of_scope','micro_only');

comment on column public.leads.callback_requested is
  'True when the visitor explicitly requested phone follow-up during public intake.';
