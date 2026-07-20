-- Portal document registration and per-user message read state.

create table if not exists public.message_reads (
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (message_id, user_id)
);

alter table public.message_reads enable row level security;

create policy message_reads_owner_select on public.message_reads
for select to authenticated
using (user_id = auth.uid());

create policy message_reads_owner_insert on public.message_reads
for insert to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.messages m
    join public.conversations c on c.id = m.conversation_id
    where m.id = message_id
      and (public.is_project_member(c.project_id) or public.can_manage_project(c.project_id))
  )
);

create policy message_reads_owner_update on public.message_reads
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create index if not exists message_reads_user_idx on public.message_reads(user_id, read_at desc);

create or replace function public.register_document_upload(
  p_project_id uuid,
  p_requirement_id uuid,
  p_document_id uuid,
  p_version_id uuid,
  p_storage_path text,
  p_original_filename text,
  p_mime_type text,
  p_size_bytes bigint
)
returns uuid
language plpgsql
security definer
set search_path = public, storage, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_document uuid;
  v_requirement_project uuid;
begin
  if v_user is null or not public.is_project_member(p_project_id) then raise exception 'project membership required'; end if;
  if p_size_bytes <= 0 or p_size_bytes > 15728640 then raise exception 'invalid document size'; end if;
  if p_mime_type not in ('application/pdf','image/jpeg','image/png','image/webp') then raise exception 'invalid document type'; end if;
  if split_part(p_storage_path, '/', 1) <> p_project_id::text then raise exception 'invalid storage path'; end if;

  select project_id into v_requirement_project
    from public.document_requirements where id = p_requirement_id for update;
  if v_requirement_project is distinct from p_project_id then raise exception 'requirement mismatch'; end if;

  if not exists (
    select 1 from storage.objects
    where bucket_id = 'project-documents' and name = p_storage_path and owner_id = v_user::text
  ) then raise exception 'uploaded object not found'; end if;

  select id into v_document from public.documents
    where project_id = p_project_id and requirement_id = p_requirement_id
    order by created_at limit 1 for update;

  if v_document is null then
    v_document := p_document_id;
    if split_part(p_storage_path, '/', 2) <> v_document::text then raise exception 'document path mismatch'; end if;
    insert into public.documents(id, project_id, requirement_id, uploaded_by)
    values (v_document, p_project_id, p_requirement_id, v_user);
  elsif split_part(p_storage_path, '/', 2) <> v_document::text then
    raise exception 'document path mismatch';
  end if;

  insert into public.document_versions(id, document_id, storage_path, original_filename, mime_type, size_bytes, uploaded_by)
  values (p_version_id, v_document, p_storage_path, left(p_original_filename, 255), p_mime_type, p_size_bytes, v_user);
  update public.documents set current_version_id = p_version_id where id = v_document;
  update public.document_requirements set status = 'uploaded', advisor_comment = null where id = p_requirement_id;
  insert into public.project_events(project_id, event_type, event_state, actor_user_id, title, description, metadata)
  values (p_project_id, 'document_uploaded', 'done', v_user, 'Document transmis', left(p_original_filename, 255), jsonb_build_object('requirementId', p_requirement_id));
  return v_document;
end;
$$;

revoke all on function public.register_document_upload(uuid, uuid, uuid, uuid, text, text, text, bigint) from public;
grant execute on function public.register_document_upload(uuid, uuid, uuid, uuid, text, text, text, bigint) to authenticated;

create or replace function public.ops_assign_project(p_project_id uuid, p_advisor_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_staff(array['admin']) then raise exception 'admin role required'; end if;
  if not exists (select 1 from public.staff_roles where user_id = p_advisor_id and active and role in ('advisor','admin')) then
    raise exception 'active advisor required';
  end if;
  update public.projects set assigned_advisor_id = p_advisor_id where id = p_project_id;
  if not found then raise exception 'project not found'; end if;
  insert into public.audit_events(actor_user_id, project_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), p_project_id, 'project_assigned', 'project', p_project_id::text, jsonb_build_object('advisorId', p_advisor_id));
end;
$$;

revoke all on function public.ops_assign_project(uuid, uuid) from public;
grant execute on function public.ops_assign_project(uuid, uuid) to authenticated;

