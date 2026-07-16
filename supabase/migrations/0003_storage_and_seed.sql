insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-documents',
  'project-documents',
  false,
  15728640,
  array['application/pdf','image/jpeg','image/png','image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy project_documents_read
on storage.objects for select to authenticated
using (
  bucket_id = 'project-documents'
  and (public.is_project_member(((storage.foldername(name))[1])::uuid) or public.can_manage_project(((storage.foldername(name))[1])::uuid))
);

create policy project_documents_insert
on storage.objects for insert to authenticated
with check (
  bucket_id = 'project-documents'
  and public.is_project_member(((storage.foldername(name))[1])::uuid)
  and owner_id = auth.uid()::text
);

-- Updates and deletions are deliberately handled by a controlled Edge Function.
