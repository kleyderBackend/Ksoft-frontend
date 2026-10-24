-- Keep developer updates compatible with the validated workspace schema.
begin;
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
        if coalesce(item->'values'->>'progress','') !~ '^([0-9]|[1-9][0-9]|100)$' then raise exception 'INVALID_PROGRESS'; end if;
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
create or replace function public.ksoft_assign_record(p_module text,p_id text,p_users uuid[]) returns void language plpgsql security definer set search_path='' as $$
declare project_id text;
begin
  if not public.ksoft_is_admin() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  perform 1 from public.ksoft_workspace where id for update;
  if p_module not in ('projects','tasks') or not exists(select 1 from public.ksoft_records where module=p_module and id=p_id) then raise exception 'INVALID_RECORD'; end if;
  if p_users is null or exists(select 1 from unnest(p_users) selected where not exists(select 1 from public.ksoft_developers where user_id=selected and active and role in ('developer','qa'))) then raise exception 'INVALID_DEVELOPER'; end if;
  if p_module='tasks' then
    select payload->'values'->>'project' into project_id from public.ksoft_records where module='tasks' and id=p_id;
    if cardinality(p_users)>0 and (coalesce(project_id,'')='' or exists(select 1 from unnest(p_users) selected where not exists(select 1 from public.ksoft_assignments where module='projects' and record_id=project_id and user_id=selected))) then raise exception 'ASSIGN_PROJECT_FIRST'; end if;
  end if;
  delete from public.ksoft_assignments where module=p_module and record_id=p_id;
  insert into public.ksoft_assignments select p_module,p_id,selected from (select distinct unnest(p_users) selected) users;
  if p_module='projects' then
    delete from public.ksoft_assignments a where a.module='tasks' and not(a.user_id=any(p_users)) and exists(select 1 from public.ksoft_records t where t.module='tasks' and t.id=a.record_id and t.payload->'values'->>'project'=p_id);
  end if;
  update public.ksoft_workspace set revision=revision+1,updated_at=now() where id;
  insert into public.ksoft_audit(actor,action,revision) select auth.uid(),'assign:'||p_module||':'||p_id,revision from public.ksoft_workspace where id;
end $$;


commit;
