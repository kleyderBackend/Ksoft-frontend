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
    allowed_keys:=case when m='projects' then array['progress'] else array['status','notes'] end;
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
commit;
