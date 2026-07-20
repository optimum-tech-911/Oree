-- Appointment lifecycle fields are operational data. Until a constrained booking
-- RPC/Edge Function is connected, browser clients receive read access only.

drop policy if exists appointments_member_insert on public.appointments;
drop policy if exists appointments_update on public.appointments;

revoke insert, update, delete on table public.appointments from authenticated;
grant select on table public.appointments to authenticated;

-- Selection remains governed by the existing appointments_select RLS policy:
-- project members see their project's appointments and staff see assigned work.
