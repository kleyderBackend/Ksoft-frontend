-- Pilot participation is tracked inside requests, independently of enquiry status.
begin;
create function public.ksoft_validate_pilot_requests(document jsonb) returns void language plpgsql set search_path='' as $$
declare item jsonb; v jsonb; k text; stage text; participant text; product text; start_date text; allowed text[];
begin
 for item in select value from jsonb_array_elements(document->'workspace'->'records'->'requests') loop
  v:=item->'values';
  foreach k in array array['participantType','pilotStatus','pilotStart','linkedAccountId','pilotTerms','pilotNotes'] loop
   if v?k and jsonb_typeof(v->k) is distinct from 'string' then raise exception 'INVALID_PILOT_FIELD'; end if;
   if length(coalesce(v->>k,''))>(case when k in ('pilotTerms','pilotNotes') then 5000 when k='linkedAccountId' then 200 else 120 end) then raise exception 'INVALID_PILOT_FIELD'; end if;
  end loop;
  if v->>'purpose' is distinct from 'Participación en piloto' then
   if exists(select 1 from unnest(array['participantType','pilotStatus','pilotStart','linkedAccountId','pilotTerms','pilotNotes']) field where coalesce(v->>field,'')<>'') then raise exception 'PILOT_FIELDS_WITHOUT_PILOT'; end if;
   continue;
  end if;
  product:=coalesce(v->>'product','');stage:=coalesce(nullif(v->>'pilotStatus',''),'Solicitado');participant:=coalesce(v->>'participantType','');start_date:=coalesce(v->>'pilotStart','');
  if product='' then raise exception 'PILOT_PRODUCT_REQUIRED'; end if;
  if stage not in ('Solicitado','Invitado','Activo','Pausado','Finalizado') then raise exception 'INVALID_PILOT_STATUS'; end if;
  allowed:=case product when 'ksoft-travel' then array['Hotel','Guía','Otro'] when 'saas-dental' then array['Consultorio','Clínica dental','Odontólogo','Otro'] else array['Empresa','Persona','Otro'] end;
  if participant<>'' and not(participant=any(allowed)) then raise exception 'INVALID_PILOT_PARTICIPANT'; end if;
  if stage<>'Solicitado' and participant='' then raise exception 'PILOT_PARTICIPANT_REQUIRED'; end if;
  if stage in ('Activo','Pausado','Finalizado') and start_date='' then raise exception 'PILOT_START_REQUIRED'; end if;
  if start_date<>'' then
   if start_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then raise exception 'INVALID_PILOT_DATE'; end if;
   begin perform start_date::date; exception when others then raise exception 'INVALID_PILOT_DATE'; end;
  end if;
 end loop;
end $$;
revoke all on function public.ksoft_validate_pilot_requests(jsonb) from public,anon,authenticated;

create or replace function public.ksoft_save_workspace(document jsonb,expected_revision bigint) returns bigint language plpgsql security definer set search_path='' as $$
declare rev bigint; m text; items jsonb; item jsonb; v_metadata jsonb; source_module text; field_name text; target_module text;
begin
  if not public.ksoft_is_admin() then raise exception 'FORBIDDEN' using errcode='42501'; end if;
  select revision into rev from public.ksoft_workspace where id for update;
  if rev<>expected_revision then raise exception 'CONFLICT'; end if;
  if document->>'version' is distinct from '1' or jsonb_typeof(document->'workspace') is distinct from 'object' or octet_length(document::text)>6291456 then raise exception 'INVALID_DOCUMENT'; end if;
  perform public.ksoft_validate_pilot_requests(document);
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



commit;
