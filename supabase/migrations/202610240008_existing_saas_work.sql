-- Existing product registrations also provide a work area for their tasks.
begin;
create function public.ksoft_provision_product_projects() returns integer language plpgsql security definer set search_path='' as $$
declare product record; project_id text; stamp text; created integer:=0;
begin
 perform 1 from public.ksoft_workspace where id for update;
 stamp:=to_char(now() at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');
 for product in select r.id,r.payload from public.ksoft_records r where r.module='products' and length(trim(r.payload->>'name'))>0 and r.payload->>'entryType' is distinct from 'project'
  and not exists(select 1 from public.ksoft_records p where p.module='projects' and p.payload->'values'->>'productId'=r.id)
  and not exists(select 1 from public.ksoft_workspace w cross join lateral jsonb_array_elements(coalesce(w.metadata->'trash','[]')) t where w.id and t->>'module'='projects' and t->'payload'->'values'->>'productId'=r.id)
 loop
  project_id:=gen_random_uuid()::text;
  insert into public.ksoft_records(module,id,position,payload) values('projects',project_id,coalesce((select max(position)+1 from public.ksoft_records where module='projects'),1),
   jsonb_build_object('id',project_id,'createdAt',stamp,'updatedAt',stamp,'values',jsonb_build_object('name',product.payload->>'name','type','SaaS propio','productId',product.id,'client','','quote','','status','Planificado','progress','0','start','','due','','scope','Desarrollo y mantenimiento de '||(product.payload->>'name')||'.','notes','')));
  created:=created+1;
 end loop;
 if created>0 then
  update public.ksoft_workspace set revision=revision+1,updated_at=now() where id;
  insert into public.ksoft_audit(action,revision) select 'provision_product_projects',revision from public.ksoft_workspace where id;
 end if;
 return created;
end $$;
revoke all on function public.ksoft_provision_product_projects() from public,anon,authenticated;
select public.ksoft_provision_product_projects();

create or replace function public.ksoft_assign_record(p_module text,p_id text,p_users uuid[]) returns void language plpgsql security definer set search_path='' as $$
declare project_id text;
begin
 if not public.ksoft_is_admin() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 perform 1 from public.ksoft_workspace where id for update;
 if p_module not in ('projects','tasks') or not exists(select 1 from public.ksoft_records where module=p_module and id=p_id) then raise exception 'INVALID_RECORD'; end if;
 if p_users is null or exists(select 1 from unnest(p_users) selected where not exists(select 1 from public.ksoft_developers where user_id=selected and active and role in ('developer','qa'))) then raise exception 'INVALID_DEVELOPER'; end if;
 if p_module='tasks' then
  select payload->'values'->>'project' into project_id from public.ksoft_records where module='tasks' and id=p_id;
  if exists(select 1 from public.ksoft_records where module='projects' and id=project_id and payload->'values'->>'type'='SaaS propio') then
   insert into public.ksoft_assignments(module,record_id,user_id) select 'projects',project_id,selected from (select distinct unnest(p_users) selected) members on conflict do nothing;
  elsif cardinality(p_users)>0 and (coalesce(project_id,'')='' or exists(select 1 from unnest(p_users) selected where not exists(select 1 from public.ksoft_assignments where module='projects' and record_id=project_id and user_id=selected))) then raise exception 'ASSIGN_PROJECT_FIRST'; end if;
 end if;
 delete from public.ksoft_assignments where module=p_module and record_id=p_id;
 insert into public.ksoft_assignments select p_module,p_id,selected from (select distinct unnest(p_users) selected) members;
 if p_module='projects' then
  delete from public.ksoft_assignments a where a.module='tasks' and not(a.user_id=any(p_users)) and exists(select 1 from public.ksoft_records t where t.module='tasks' and t.id=a.record_id and t.payload->'values'->>'project'=p_id);
 end if;
 update public.ksoft_workspace set revision=revision+1,updated_at=now() where id;
 insert into public.ksoft_audit(actor,action,revision) select auth.uid(),'assign:'||p_module||':'||p_id,revision from public.ksoft_workspace where id;
end $$;
commit;
