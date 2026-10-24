begin;
create table public.ksoft_developers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  active boolean not null default true,
  read_notifications jsonb not null default '[]'
);
create table public.ksoft_assignments (
  module text not null check(module in ('projects','tasks')),
  record_id text not null,
  user_id uuid not null references public.ksoft_developers(user_id) on delete cascade,
  primary key(module,record_id,user_id)
);
alter table public.ksoft_developers enable row level security;
alter table public.ksoft_assignments enable row level security;
revoke all on public.ksoft_developers,public.ksoft_assignments from anon,authenticated;

create function public.ksoft_is_developer() returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.ksoft_developers where user_id=auth.uid() and active)
$$;
create function public.ksoft_get_access() returns jsonb language sql stable security definer set search_path='' as $$
  select case when public.ksoft_is_admin() then jsonb_build_object('role','admin','userId',auth.uid())
    when public.ksoft_is_developer() then jsonb_build_object('role','developer','userId',auth.uid()) else null end
$$;
create function public.ksoft_list_developers() returns jsonb language plpgsql security definer set search_path='' as $$
begin
  if not public.ksoft_is_admin() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('id',d.user_id,'name',d.display_name,'email',u.email) order by d.display_name) from public.ksoft_developers d join auth.users u on u.id=d.user_id where d.active),'[]');
end $$;
create function public.ksoft_get_assignments(p_module text,p_id text) returns jsonb language plpgsql security definer set search_path='' as $$
begin
  if not public.ksoft_is_admin() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  return coalesce((select jsonb_agg(user_id) from public.ksoft_assignments where module=p_module and record_id=p_id),'[]');
end $$;
create function public.ksoft_assign_record(p_module text,p_id text,p_users uuid[]) returns void language plpgsql security definer set search_path='' as $$
declare project_id text;
begin
  if not public.ksoft_is_admin() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  perform 1 from public.ksoft_workspace where id for update;
  if p_module not in ('projects','tasks') or not exists(select 1 from public.ksoft_records where module=p_module and id=p_id) then raise exception 'INVALID_RECORD'; end if;
  if p_users is null or exists(select 1 from unnest(p_users) selected where not exists(select 1 from public.ksoft_developers where user_id=selected and active)) then raise exception 'INVALID_DEVELOPER'; end if;
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

create function public.ksoft_developer_document() returns jsonb language plpgsql security definer set search_path='' as $$
declare records jsonb := '{}'; m text; items jsonb; settings jsonb;
begin
  if not public.ksoft_is_developer() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  foreach m in array array['requests','payments','expenses','projects','tasks','supports','contacts','clients','quotes','files'] loop records:=records||jsonb_build_object(m,'[]'::jsonb); end loop;
  select coalesce(jsonb_agg(jsonb_build_object('id',r.id,'createdAt',r.payload->'createdAt','updatedAt',r.payload->'updatedAt','values',(select jsonb_object_agg(key,value) from jsonb_each(r.payload->'values') where key in ('name','status','start','due','progress','scope')) || jsonb_build_object('progress',coalesce(nullif(r.payload->'values'->>'progress',''),'0'))) order by r.position),'[]') into items
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
create function public.ksoft_read_developer_workspace() returns jsonb language plpgsql security definer set search_path='' as $$
declare rev bigint;
begin
  if not public.ksoft_is_developer() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  select revision into rev from public.ksoft_workspace where id for share;
  return jsonb_build_object('document',public.ksoft_developer_document(),'revision',rev);
end $$;
create function public.ksoft_save_developer_workspace(document jsonb,expected_revision bigint) returns bigint language plpgsql security definer set search_path='' as $$
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

create function public.ksoft_public_payload(p_module text,p_record jsonb) returns jsonb language sql immutable set search_path='' as $$
  select jsonb_object_agg(key,value) from jsonb_each(p_record) where key=any(case when p_module='posts' then array['id','title','slug','excerpt','content','image','status','updatedAt'] else array['id','name','slug','headline','description','icon','logo','sector','audience','billingModel','availability','status','questions','editorialStatus','updatedAt','buttonText','contactButtonText','entryType','visibility','contactIntent','presentation'] end)
$$;
create function public.ksoft_sync_public_entry(p_module text,p_id text,p_action text) returns void language plpgsql security definer set search_path='' as $$
declare entry jsonb; site jsonb; items jsonb;
begin
  if p_module not in ('posts','products','publicProjects') or p_action not in ('publish','unpublish') then raise exception 'INVALID_PUBLICATION'; end if;
  select payload into site from public.ksoft_public_site where id for update;
  site:=coalesce(site,'{"products":[],"publicProjects":[],"posts":[]}'::jsonb);
  if p_action='publish' then
    select payload into entry from public.ksoft_records where module=p_module and id=p_id;
    if entry is null or (case when p_module='posts' then entry->>'status' is distinct from 'ready' else entry->>'editorialStatus' is distinct from 'ready' or entry->>'visibility' is distinct from 'visible' end) then raise exception 'CONTENT_NOT_READY'; end if;
    if p_module<>'posts' and exists(select 1 from jsonb_array_elements((site->'products')||(site->'publicProjects')) published where published->>'slug'=entry->>'slug' and published->>'id'<>p_id) then raise exception 'DUPLICATE_PUBLIC_SLUG'; end if;
    entry:=public.ksoft_public_payload(p_module,entry);
    select coalesce(jsonb_agg(case when value->>'id'=p_id then entry else value end order by position),'[]') into items from jsonb_array_elements(coalesce(site->p_module,'[]')) with ordinality t(value,position);
    if not exists(select 1 from jsonb_array_elements(items) x where x->>'id'=p_id) then items:=items||jsonb_build_array(entry); end if;
  else
    select coalesce(jsonb_agg(value order by position),'[]') into items from jsonb_array_elements(coalesce(site->p_module,'[]')) with ordinality t(value,position) where value->>'id'<>p_id;
  end if;
  update public.ksoft_public_site set payload=site||jsonb_build_object(p_module,items),published_at=now() where id;
end $$;
create function public.ksoft_commit_workspace(document jsonb,expected_revision bigint,p_module text default null,p_id text default null,p_action text default null) returns bigint language plpgsql security definer set search_path='' as $$
declare rev bigint; removed record;
begin
  if not public.ksoft_is_admin() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  rev:=public.ksoft_save_workspace(document,expected_revision);
  if p_action is not null then
    perform public.ksoft_sync_public_entry(p_module,p_id,p_action);
    insert into public.ksoft_audit(actor,action,revision) values(auth.uid(),p_action||':'||p_module||':'||p_id,rev);
  end if;
  for removed in select m.module,entry->>'id' as id from public.ksoft_public_site s cross join lateral (values('posts'),('products'),('publicProjects')) m(module) cross join lateral jsonb_array_elements(coalesce(s.payload->m.module,'[]')) entry where not exists(select 1 from public.ksoft_records r where r.module=m.module and r.id=entry->>'id') loop
    perform public.ksoft_sync_public_entry(removed.module,removed.id,'unpublish');
  end loop;
  return rev;
end $$;

revoke all on function public.ksoft_is_developer(),public.ksoft_get_access(),public.ksoft_list_developers(),public.ksoft_get_assignments(text,text),public.ksoft_assign_record(text,text,uuid[]),public.ksoft_developer_document(),public.ksoft_read_developer_workspace(),public.ksoft_save_developer_workspace(jsonb,bigint),public.ksoft_public_payload(text,jsonb),public.ksoft_sync_public_entry(text,text,text),public.ksoft_commit_workspace(jsonb,bigint,text,text,text) from public,anon,authenticated;
grant execute on function public.ksoft_get_access(),public.ksoft_list_developers(),public.ksoft_get_assignments(text,text),public.ksoft_assign_record(text,text,uuid[]),public.ksoft_read_developer_workspace(),public.ksoft_save_developer_workspace(jsonb,bigint),public.ksoft_commit_workspace(jsonb,bigint,text,text,text) to authenticated;
commit;
