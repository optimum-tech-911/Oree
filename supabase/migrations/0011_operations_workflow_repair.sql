-- Keep operations access recoverable: an administrator may never remove the
-- final active administrator account. This preserves all existing RPC
-- signatures and browser contracts.

create or replace function public.admin_set_staff_role(p_user_id uuid, p_role text, p_active boolean)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_staff(array['admin']) then raise exception 'admin role required'; end if;
  if p_role not in ('advisor','admin') then raise exception 'invalid staff role'; end if;

  perform pg_advisory_xact_lock(hashtext('public.staff_roles.active_admin_guard'));

  if exists (
    select 1
    from public.staff_roles
    where user_id = p_user_id and role = 'admin' and active
  )
  and (p_role <> 'admin' or not p_active)
  and not exists (
    select 1
    from public.staff_roles
    where user_id <> p_user_id and role = 'admin' and active
  ) then
    raise exception 'at least one active admin is required';
  end if;

  insert into public.staff_roles(user_id, role, active)
  values (p_user_id, p_role, p_active)
  on conflict (user_id) do update set role = excluded.role, active = excluded.active;

  insert into public.audit_events(actor_user_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(),
    'staff_role_updated',
    'staff_role',
    p_user_id::text,
    jsonb_build_object('role', p_role, 'active', p_active)
  );
end;
$$;

revoke all on function public.admin_set_staff_role(uuid, text, boolean) from public;
grant execute on function public.admin_set_staff_role(uuid, text, boolean) to authenticated;
