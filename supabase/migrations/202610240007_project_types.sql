-- Distinguish customer delivery, owned SaaS development and internal initiatives.
begin;
create or replace function public.ksoft_save_workspace(document jsonb,expected_revision bigint) returns bigint language plpgsql security definer set search_path='' as $$
declare rev bigint; m text; items jsonb; item jsonb; v_metadata jsonb; source_module text; field_name text; target_module text;
begin
  if not public.ksoft_is_admin() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  select revision into rev from public.ksoft_workspace where id for update;
  if rev<>expected_revision then raise exception 'CONFLICT'; end if;
  if document->>'version' is distinct from '1' or jsonb_typeof(document->'workspace') is distinct from 'object' or octet_length(document::text)>6291456 then raise exception 'INVALID_DOCUMENT'; end if;
  foreach m in array array['requests','payments','expenses','projects','tasks','supports','contacts','clients','quotes','files','posts','products','publicProjects'] loop
    items := case when m in ('posts','products','publicProjects') then coalesce(document->m,'[]'::jsonb) else document->'workspace'->'records'->m end;
    if jsonb_typeof(items) is distinct from 'array' then raise exception 'INVALID_MODULE %',m; end if;
    if exists(select 1 from jsonb_array_elements(items) x where jsonb_typeof(x) is distinct from 'object' or coalesce(x->>'id','')='' or length(x->>'id')>200) then raise exception 'INVALID_RECORD'; end if;
    delete from public.ksoft_records where module=m;
    insert into public.ksoft_records(module,id,position,payload) select m,x->>'id',n::integer,x from jsonb_array_elements(items) with ordinality as t(x,n);
  end loop;
  -- Server-side relationship validation, independent of browser validation.
  for source_module,field_name,target_module in select * from (values
    ('payments','client','clients'),('payments','quote','quotes'),('quotes','client','clients'),
    ('projects','productId','products'),('projects','client','clients'),('projects','quote','quotes'),('tasks','project','projects'),
    ('files','project','projects'),('supports','client','clients'),('contacts','client','clients'),('requests','contact','contacts')
  ) as relations(s,f,t) loop
    if exists(select 1 from public.ksoft_records r where r.module=source_module and coalesce(r.payload->'values'->>field_name,'')<>'' and not exists(select 1 from public.ksoft_records target where target.module=target_module and target.id=r.payload->'values'->>field_name)) then raise exception 'INVALID_RELATION % %',source_module,field_name; end if;
  end loop;
  if exists(select 1 from public.ksoft_records r join public.ksoft_records q on q.module='quotes' and q.id=r.payload->'values'->>'quote' where r.module in ('payments','projects') and coalesce(r.payload->'values'->>'client','') is distinct from coalesce(q.payload->'values'->>'client','')) then raise exception 'CLIENT_MISMATCH'; end if;
  for item in select payload from public.ksoft_records where module='projects' loop
    if jsonb_typeof(item->'values') is distinct from 'object' or exists(select 1 from jsonb_each(item->'values') field where jsonb_typeof(field.value)<>'string') then raise exception 'INVALID_PROJECT'; end if;
    if coalesce(item->'values'->>'type','')<>'' and item->'values'->>'type' not in ('Cliente','SaaS propio','Proyecto propio') then raise exception 'INVALID_PROJECT_TYPE'; end if;
    if item->'values'->>'type' in ('SaaS propio','Proyecto propio') and (coalesce(item->'values'->>'client','')<>'' or coalesce(item->'values'->>'quote','')<>'') then raise exception 'INTERNAL_PROJECT_HAS_CLIENT'; end if;
    if item->'values'->>'type'='Cliente' and coalesce(item->'values'->>'client','')='' then raise exception 'PROJECT_CLIENT_REQUIRED'; end if;
    if coalesce(item->'values'->>'productId','')<>'' and item->'values'->>'type' is distinct from 'SaaS propio' then raise exception 'INVALID_PROJECT_PRODUCT'; end if;
  end loop;
  -- Money is validated on the server, including total allocations across payments.
  for item in select payload from public.ksoft_records where module in ('payments','expenses','quotes') loop
    if coalesce(item->'values'->>'amount','') !~ '^[0-9]+(\.[0-9]{1,2})?$' then raise exception 'INVALID_AMOUNT'; end if;
  end loop;
  if exists(select 1 from public.ksoft_records q join public.ksoft_records p on p.module='payments' and p.payload->'values'->>'quote'=q.id and p.payload->'values'->>'status'<>'Anulado' where q.module='quotes' group by q.id,q.payload having sum((p.payload->'values'->>'amount')::numeric)>(q.payload->'values'->>'amount')::numeric) then raise exception 'PAYMENT_EXCEEDS_QUOTE'; end if;
  v_metadata := document - 'posts' - 'products' - 'publicProjects';
  v_metadata := jsonb_set(v_metadata,'{workspace,records}','{}'::jsonb);
  update public.ksoft_workspace set metadata=v_metadata,revision=rev+1,updated_at=now() where id;
  insert into public.ksoft_audit(actor,action,revision) values(auth.uid(),'save',rev+1);
  return rev+1;
end $$;


create or replace function public.ksoft_developer_document() returns jsonb language plpgsql security definer set search_path='' as $$
declare records jsonb := '{}'; m text; items jsonb; settings jsonb;
begin
  if not public.ksoft_is_developer() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  foreach m in array array['requests','payments','expenses','projects','tasks','supports','contacts','clients','quotes','files'] loop records:=records||jsonb_build_object(m,'[]'::jsonb); end loop;
  select coalesce(jsonb_agg(jsonb_build_object('id',r.id,'createdAt',r.payload->'createdAt','updatedAt',r.payload->'updatedAt','values',(select jsonb_object_agg(key,value) from jsonb_each(r.payload->'values') where key in ('name','type','status','start','due','progress','scope')) || jsonb_build_object('progress',coalesce(nullif(r.payload->'values'->>'progress',''),'0'))) order by r.position),'[]') into items
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

commit;
