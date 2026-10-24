-- Exercises publishing and assigned work against the live database, then rolls
-- back every record, publication, assignment and audit event made by the test.
begin;
do $check$
declare administrator uuid; developer uuid; document jsonb; view jsonb; rev bigint;
begin
  select user_id into administrator from public.ksoft_admins limit 1;
  select user_id into developer from public.ksoft_developers where active limit 1;
  if administrator is null or developer is null then raise exception 'MISSING_ROLE_ACCOUNT'; end if;
  perform set_config('request.jwt.claim.sub',administrator::text,true);
  perform set_config('request.jwt.claim.role','authenticated',true);
  view:=public.ksoft_read_workspace();document:=view->'document';rev:=(view->>'revision')::bigint;
  document:=jsonb_set(document,'{posts}',(document->'posts')||'[{"id":"qa-atomic-publication","title":"Verificación transaccional","slug":"qa-atomic-publication","excerpt":"Se revierte sin publicar datos duraderos.","content":"Prueba de conexión.","image":"","status":"ready","updatedAt":""}]'::jsonb);
  rev:=public.ksoft_commit_workspace(document,rev,'posts','qa-atomic-publication','publish');
  if not exists(select 1 from public.ksoft_public_site s cross join lateral jsonb_array_elements(s.payload->'posts') p where p->>'id'='qa-atomic-publication') then raise exception 'PUBLICATION_FAILED'; end if;
  document:=jsonb_set(document,'{workspace,records,projects}',(document->'workspace'->'records'->'projects')||'[{"id":"qa-assigned-project","createdAt":"2026-10-24T12:00:00Z","updatedAt":"2026-10-24T12:00:00Z","values":{"name":"Verificación transaccional","scope":"Desarrollo","status":"En curso","progress":"0","notes":"PRIVATE ADMIN NOTES"}}]'::jsonb);
  document:=jsonb_set(document,'{workspace,records,tasks}',(document->'workspace'->'records'->'tasks')||'[{"id":"qa-assigned-task","createdAt":"2026-10-24T12:00:00Z","updatedAt":"2026-10-24T12:00:00Z","values":{"name":"Verificación de permisos","project":"qa-assigned-project","status":"Pendiente","notes":""}}]'::jsonb);
  rev:=public.ksoft_commit_workspace(document,rev);
  perform public.ksoft_assign_record('projects','qa-assigned-project',array[developer]);
  perform public.ksoft_assign_record('tasks','qa-assigned-task',array[developer]);
  perform set_config('request.jwt.claim.sub',developer::text,true);
  view:=public.ksoft_read_developer_workspace();document:=view->'document';rev:=(view->>'revision')::bigint;
  if document::text like '%PRIVATE ADMIN NOTES%' then raise exception 'PRIVATE_DATA_EXPOSED'; end if;
  document:=jsonb_set(document,'{workspace,records,projects}',(select jsonb_agg(case when p->>'id'='qa-assigned-project' then jsonb_set(p,'{values,progress}','"25"'::jsonb) else p end) from jsonb_array_elements(document->'workspace'->'records'->'projects') p));
  perform public.ksoft_save_developer_workspace(document,rev);
  if not exists(select 1 from public.ksoft_records where module='projects' and id='qa-assigned-project' and payload->'values'->>'progress'='25') then raise exception 'DEVELOPER_UPDATE_FAILED'; end if;
end $check$;
rollback;
