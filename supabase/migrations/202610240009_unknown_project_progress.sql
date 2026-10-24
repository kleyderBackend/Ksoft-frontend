-- An undefined estimate is not zero progress. Preserve it for assigned staff.
begin;
create or replace function public.ksoft_developer_document() returns jsonb language plpgsql security definer set search_path='' as $$
declare records jsonb := '{}'; m text; items jsonb; settings jsonb;
begin
  if not public.ksoft_is_developer() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  foreach m in array array['requests','payments','expenses','projects','tasks','supports','contacts','clients','quotes','files'] loop records:=records||jsonb_build_object(m,'[]'::jsonb); end loop;
  select coalesce(jsonb_agg(jsonb_build_object('id',r.id,'createdAt',r.payload->'createdAt','updatedAt',r.payload->'updatedAt','values',(select jsonb_object_agg(key,value) from jsonb_each(r.payload->'values') where key in ('name','type','status','start','due','progress','scope')) || jsonb_build_object('progress',coalesce(r.payload->'values'->>'progress',''))) order by r.position),'[]') into items
  from public.ksoft_records r where r.module='projects' and exists(select 1 from public.ksoft_assignments a where a.module='projects' and a.record_id=r.id and a.user_id=auth.uid());
  records:=records||jsonb_build_object('projects',items);
  select coalesce(jsonb_agg(jsonb_build_object('id',r.id,'createdAt',r.payload->'createdAt','updatedAt',r.payload->'updatedAt','values',(select jsonb_object_agg(key,value) from jsonb_each(r.payload->'values') where key in ('name','project','owner','due','priority','status','notes')) || jsonb_build_object('notes',coalesce(r.payload->'values'->>'notes',''))) order by r.position),'[]') into items
  from public.ksoft_records r where r.module='tasks' and exists(select 1 from public.ksoft_assignments a where a.module='tasks' and a.record_id=r.id and a.user_id=auth.uid())
    and exists(select 1 from public.ksoft_assignments a join public.ksoft_records p on p.module='projects' and p.id=a.record_id where a.module='projects' and a.record_id=r.payload->'values'->>'project' and a.user_id=auth.uid());
  records:=records||jsonb_build_object('tasks',items);
  select jsonb_build_object('company',coalesce(w.metadata->'workspace'->'settings'->>'company','Ksoft Technology'),'owner',d.display_name,'email',coalesce(u.email,''),'currency','COP') into settings
  from public.ksoft_developers d join auth.users u on u.id=d.user_id cross join public.ksoft_workspace w where d.user_id=auth.uid() and w.id;
  return jsonb_build_object('version',1,'posts','[]'::jsonb,'products','[]'::jsonb,'publicProjects','[]'::jsonb,'trash','[]'::jsonb,'history','[]'::jsonb,'activity','[]'::jsonb,'workspace',jsonb_build_object('records',records,'settings',settings,'readNotifications',(select read_notifications from public.ksoft_developers where user_id=auth.uid())));
end $$;


create or replace function public.ksoft_save_developer_workspace(document jsonb,expected_revision bigint) returns bigint language plpgsql security definer set search_path='' as $$
declare rev bigint; original jsonb; m text; items jsonb; item jsonb; before_item jsonb; allowed_keys text[]; notifications jsonb;
begin
  if not public.ksoft_is_developer() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  select revision into rev from public.ksoft_workspace where id for update;
  if rev<>expected_revision then raise exception 'CONFLICT'; end if;
  original:=public.ksoft_developer_document();
  if document->'workspace'->'settings' is distinct from original->'workspace'->'settings' or document->>'version' is distinct from '1' then raise exception 'FORBIDDEN_FIELDS'; end if;
  foreach m in array array['requests','payments','expenses','supports','contacts','clients','quotes','files'] loop
    if document->'workspace'->'records'->m is distinct from '[]'::jsonb then raise exception 'FORBIDDEN_FIELDS'; end if;
  end loop;
  foreach m in array array['posts','products','publicProjects','trash','history','activity'] loop
    if coalesce(document->m,'[]')<>'[]'::jsonb then raise exception 'FORBIDDEN_FIELDS'; end if;
  end loop;
  foreach m in array array['projects','tasks'] loop
    items:=document->'workspace'->'records'->m;
    if jsonb_typeof(items) is distinct from 'array' or jsonb_array_length(items)<>jsonb_array_length(original->'workspace'->'records'->m) then raise exception 'FORBIDDEN_RECORDS'; end if;
    if (select count(distinct x->>'id') from jsonb_array_elements(items) x)<>jsonb_array_length(items) then raise exception 'DUPLICATE_RECORD'; end if;
    allowed_keys:=case when m='projects' then case when public.ksoft_get_access()->>'role'='qa' then array[]::text[] else array['progress'] end else array['status','notes'] end;
    for item in select value from jsonb_array_elements(items) loop
      if jsonb_typeof(item->'values') is distinct from 'object' or exists(select 1 from jsonb_each(item->'values') value where jsonb_typeof(value.value)<>'string') then raise exception 'INVALID_FIELD_TYPE'; end if;
      select value into before_item from jsonb_array_elements(original->'workspace'->'records'->m) where value->>'id'=item->>'id';
      if before_item is null or (item-'values'-'updatedAt') is distinct from (before_item-'values'-'updatedAt') or ((item->'values')-allowed_keys) is distinct from ((before_item->'values')-allowed_keys) then raise exception 'FORBIDDEN_FIELDS'; end if;
      if m='projects' then
        if coalesce(item->'values'->>'progress','')<>'' and item->'values'->>'progress' !~ '^([0-9]|[1-9][0-9]|100)$' then raise exception 'INVALID_PROGRESS'; end if;
      else
        if item->'values'->>'status' not in ('Pendiente','En curso','Completada') or jsonb_typeof(item->'values'->'status') is distinct from 'string' or jsonb_typeof(item->'values'->'notes') is distinct from 'string' or length(item->'values'->>'notes')>5000 then raise exception 'INVALID_TASK'; end if;
      end if;
      if item->'values' is distinct from before_item->'values' then
        update public.ksoft_records r set payload=jsonb_set(jsonb_set(r.payload,'{values}',(r.payload->'values')||coalesce((select jsonb_object_agg(key,value) from jsonb_each(item->'values') where key=any(allowed_keys)),'{}')),'{updatedAt}',to_jsonb(to_char(now() at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))) where r.module=m and r.id=item->>'id';
      end if;
    end loop;
  end loop;
  notifications:=coalesce(document->'workspace'->'readNotifications','[]');
  if jsonb_typeof(notifications) is distinct from 'array' or jsonb_array_length(notifications)>500 or exists(select 1 from jsonb_array_elements(notifications) n where jsonb_typeof(n)<>'string') then raise exception 'INVALID_NOTIFICATIONS'; end if;
  update public.ksoft_developers set read_notifications=notifications where user_id=auth.uid();
  update public.ksoft_workspace set revision=rev+1,updated_at=now() where id;
  insert into public.ksoft_audit(actor,action,revision) values(auth.uid(),'developer_save',rev+1);
  return rev+1;
end $$;

create or replace function public.ksoft_provision_product_projects() returns integer language plpgsql security definer set search_path='' as $$
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
   jsonb_build_object('id',project_id,'createdAt',stamp,'updatedAt',stamp,'values',jsonb_build_object('name',product.payload->>'name','type','SaaS propio','productId',product.id,'client','','quote','','status','Planificado','progress','','start','','due','','scope','Desarrollo y mantenimiento de '||(product.payload->>'name')||'.','notes','')));
  created:=created+1;
 end loop;
 if created>0 then
  update public.ksoft_workspace set revision=revision+1,updated_at=now() where id;
  insert into public.ksoft_audit(action,revision) select 'provision_product_projects',revision from public.ksoft_workspace where id;
 end if;
 return created;
end $$;

commit;
