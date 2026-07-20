-- A telephone number is only necessary when a visitor explicitly requests a callback.
-- Existing lead records remain unchanged; future records may rely on e-mail only.
alter table public.leads alter column phone drop not null;
