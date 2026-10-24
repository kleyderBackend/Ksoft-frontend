-- Uses a registered SaaS; all task and assignment changes are rolled back.
begin;
do $check$
declare administrator uuid; developer uuid; project_id text; task_id text:=gen_random_uuid()::text; view jsonb; document jsonb; rev bigint; stamp text;
begin
 select user_id into administrator from public.ksoft_admins limit 1;
 select user_id into developer from public.ksoft_developers where active and role='developer' limit 1;
 select r.id into project_id from public.ksoft_records r join public.ksoft_records p on p.module='products' and p.id=r.payload->'values'->>'productId' where r.module='projects' and r.payload->'values'->>'type'='SaaS propio' limit 1;
 if administrator is null or developer is null or project_id is null then raise exception 'MISSING_REGISTERED_SAAS_OR_ACCOUNT'; end if;
 perform set_config('request.jwt.claim.role','authenticated',true);
 perform set_config('request.jwt.claim.sub',administrator::text,true);
 view:=public.ksoft_read_workspace();document:=view->'document';rev:=(view->>'revision')::bigint;
 stamp:=to_char(now() at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');
 document:=jsonb_set(document,'{workspace,records,tasks}',(document->'workspace'->'records'->'tasks')||jsonb_build_array(jsonb_build_object('id',task_id,'createdAt',stamp,'updatedAt',stamp,'values',jsonb_build_object('name','Validación transaccional de asignación SaaS','project',project_id,'status','Pendiente','priority','Media','owner','','due','','notes',''))));
 perform public.ksoft_commit_workspace(document,rev);
 perform public.ksoft_assign_record('tasks',task_id,array[developer]);
 if not exists(select 1 from public.ksoft_assignments where module='projects' and record_id=project_id and user_id=developer) or not exists(select 1 from public.ksoft_assignments where module='tasks' and record_id=task_id and user_id=developer) then raise exception 'SAAS_ASSIGNMENT_FAILED'; end if;
 perform set_config('request.jwt.claim.sub',developer::text,true);
 view:=public.ksoft_read_staff_workspace();
 if not exists(select 1 from jsonb_array_elements(view->'document'->'workspace'->'records'->'tasks') task where task->>'id'=task_id) then raise exception 'ASSIGNED_TASK_NOT_VISIBLE'; end if;
end $check$;
rollback;
